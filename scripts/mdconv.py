"""Conversion HTML → Markdown fidèle (aucune modification du texte).

Principes :
- Le texte n'est jamais modifié. Seuls les espaces « HTML » (espace, tabulation,
  retour de ligne) sont fusionnés, comme le fait un navigateur à l'affichage.
  Les espaces insécables (U+00A0) et autres caractères spéciaux sont conservés.
- Gras / italique en Markdown (**…**, *…*) quand c'est sans ambiguïté ;
  sinon, petite balise HTML (<strong>, <em>) pour ne rien perdre.
- <u>, <sup>, <sub> : gardés en HTML (le Markdown ne sait pas les écrire).
- <br> : écrit « <br> » en fin de ligne.
- Toute balise inconnue arrête la conversion (pour qu'on la traite consciemment).
"""
import re
import unicodedata

from bs4 import NavigableString, Tag, Comment

HTML_WS = re.compile(r"[ \t\n\r\f]+")

INLINE_TAGS = {"strong", "b", "em", "i", "u", "sup", "sub", "a", "br", "span", "small", "font", "mark"}
BLOCK_TAGS = {"p", "ul", "ol", "li", "div", "table", "blockquote", "h1", "h2", "h3", "h4", "h5", "h6", "hr"}
KIND = {"strong": "bold", "b": "bold", "em": "italic", "i": "italic", "u": "u", "sup": "sup", "sub": "sub"}
MD_DELIM = {"bold": "**", "italic": "*"}
HTML_TAG = {"bold": "strong", "italic": "em", "u": "u", "sup": "sup", "sub": "sub"}


class ConversionError(Exception):
    pass


def is_ws(ch):
    return ch.isspace() or ch == "\u00a0"


def is_punct(ch):
    return unicodedata.category(ch)[0] in "PS"


# ---------------------------------------------------------------- inline ----

def inline_tokens(node, out):
    """Aplatit le contenu inline en jetons."""
    if isinstance(node, Comment):
        return
    if isinstance(node, NavigableString):
        out.append(["text", HTML_WS.sub(" ", str(node))])
        return
    name = node.name
    if name == "br":
        out.append(["br"])
        return
    if name in KIND:
        kind = KIND[name]
        out.append(["open", kind])
        for c in node.children:
            inline_tokens(c, out)
        out.append(["close", kind])
        return
    if name == "a":
        out.append(["aopen", node.get("href", "")])
        for c in node.children:
            inline_tokens(c, out)
        out.append(["aclose"])
        return
    if name in ("span", "font", "mark", "small"):
        for c in node.children:
            inline_tokens(c, out)
        return
    raise ConversionError(f"Balise inline inconnue : <{name}>")


def normalize_tokens(toks):
    """Fusionne les textes, enlève les espaces de bord à l'intérieur des
    balises de mise en forme (déplacés à l'extérieur : le texte affiché est
    identique) et supprime les mises en forme vides."""
    # fusion des textes adjacents
    merged = []
    for t in toks:
        if t[0] == "text" and merged and merged[-1][0] == "text":
            merged[-1][1] += t[1]
        else:
            merged.append(list(t))
    toks = merged
    changed = True
    while changed:
        changed = False
        for i, t in enumerate(toks):
            # espace au début d'une mise en forme → avant l'ouverture
            if t[0] in ("open", "aopen") and i + 1 < len(toks) and toks[i + 1][0] == "text":
                s = toks[i + 1][1]
                lead = len(s) - len(s.lstrip(" \u00a0"))
                if lead:
                    toks[i + 1][1] = s[lead:]
                    toks.insert(i, ["text", s[:lead]])
                    changed = True
                    break
            # espace à la fin d'une mise en forme → après la fermeture
            if t[0] in ("close", "aclose") and i > 0 and toks[i - 1][0] == "text":
                s = toks[i - 1][1]
                trail = len(s) - len(s.rstrip(" \u00a0"))
                if trail:
                    toks[i - 1][1] = s[: len(s) - trail]
                    toks.insert(i + 1, ["text", s[len(s) - trail:]])
                    changed = True
                    break
            # textes vides
            if t[0] == "text" and t[1] == "":
                del toks[i]
                changed = True
                break
            # mise en forme vide : <strong></strong>
            if t[0] == "open" and i + 1 < len(toks) and toks[i + 1][0] == "close" and toks[i + 1][1] == t[1]:
                del toks[i:i + 2]
                changed = True
                break
            # **a****b** → **ab** (deux gras collés = un seul gras)
            if t[0] == "close" and i + 1 < len(toks) and toks[i + 1][0] == "open" and toks[i + 1][1] == t[1]:
                del toks[i:i + 2]
                changed = True
                break
            # fusion des textes devenus adjacents
            if t[0] == "text" and i + 1 < len(toks) and toks[i + 1][0] == "text":
                t[1] += toks[i + 1][1]
                del toks[i + 1]
                changed = True
                break
    return toks


_ENTITY = re.compile(r"&(#\d+|#[xX][0-9a-fA-F]+|[A-Za-z][A-Za-z0-9]*);")


def escape_text(s):
    s = s.replace("\\", "\\\\")
    for ch in "*_`[]<~":
        s = s.replace(ch, "\\" + ch)
    s = _ENTITY.sub(lambda m: "\\&" + m.group(0)[1:], s)
    return s


def render_inline(toks):
    """Jetons → texte Markdown (avec repli HTML si l'emphase Markdown
    serait mal interprétée)."""
    # Pour chaque paire open/close, décider Markdown ou HTML.
    stack, pairs = [], {}
    for i, t in enumerate(toks):
        if t[0] == "open":
            stack.append(i)
        elif t[0] == "close":
            j = stack.pop()
            pairs[j] = i
            pairs[i] = j

    def char_before(i):
        k = i - 1
        while k >= 0:
            if toks[k][0] == "text" and toks[k][1]:
                return toks[k][1][-1]
            if toks[k][0] in ("br",):
                return "\n"
            if toks[k][0] in ("aopen", "aclose"):
                return "["  # ponctuation
            k -= 1
        return "\n"

    def char_after(i):
        k = i + 1
        while k < len(toks):
            if toks[k][0] == "text" and toks[k][1]:
                return toks[k][1][0]
            if toks[k][0] == "br":
                return "\n"
            if toks[k][0] in ("aopen", "aclose"):
                return "["
            k += 1
        return "\n"

    use_md = {}
    for i, t in enumerate(toks):
        if t[0] != "open":
            continue
        j = pairs[i]
        kind = t[1]
        ok = kind in MD_DELIM
        if ok:
            # ouverture : doit être « left-flanking »
            nxt, prv = char_after(i), char_before(i)
            if is_ws(nxt):
                ok = False
            elif is_punct(nxt) and not (is_ws(prv) or is_punct(prv)):
                ok = False
            # fermeture : doit être « right-flanking »
            prv2, nxt2 = char_before(j), char_after(j)
            if is_ws(prv2):
                ok = False
            elif is_punct(prv2) and not (is_ws(nxt2) or is_punct(nxt2)):
                ok = False
        use_md[i] = use_md[j] = ok
    # Deux marques collées (ex. <em><strong>) : HTML pour les deux, sans ambiguïté.
    for i, t in enumerate(toks):
        if t[0] in ("open", "close") and i + 1 < len(toks) and toks[i + 1][0] in ("open", "close"):
            for k in (i, i + 1):
                use_md[k] = use_md[pairs[k]] = False

    out = []
    for i, t in enumerate(toks):
        typ = t[0]
        if typ == "text":
            out.append(escape_text(t[1]))
        elif typ == "br":
            out.append("<br>\n")
        elif typ == "open":
            out.append(MD_DELIM[t[1]] if use_md[i] else f"<{HTML_TAG[t[1]]}>")
        elif typ == "close":
            out.append(MD_DELIM[t[1]] if use_md[i] else f"</{HTML_TAG[t[1]]}>")
        elif typ == "aopen":
            out.append("[")
            t.append(len(out))
        elif typ == "aclose":
            # retrouver l'href de l'ouverture correspondante
            k = i - 1
            depth = 0
            while k >= 0:
                if toks[k][0] == "aclose":
                    depth += 1
                elif toks[k][0] == "aopen":
                    if depth == 0:
                        break
                    depth -= 1
                k -= 1
            href = toks[k][1].replace(" ", "%20").replace("(", "%28").replace(")", "%29")
            out.append(f"]({href})")
    s = "".join(out)
    # pas d'espaces au début d'une ligne après <br> (le navigateur les ignore)
    s = re.sub(r"<br>\n[ ]+", "<br>\n", s)
    # <br> en fin de bloc : sans effet à l'affichage
    s = re.sub(r"(<br>\n)+$", "", s.rstrip(" "))
    s = s.strip(" ")
    # Espace insécable au bord d'un bloc ou d'une ligne : le moteur Markdown
    # l'enlèverait. On l'écrit « &nbsp; » pour le conserver.
    s = re.sub(r"^[  ]+", lambda m: m.group(0).replace(" ", "&nbsp;"), s)
    s = re.sub(r"[  ]+$", lambda m: m.group(0).replace(" ", "&nbsp;"), s)
    s = re.sub(r"[  ]+(?=<br>\n)", lambda m: m.group(0).replace(" ", "&nbsp;"), s)
    s = re.sub(r"(?<=<br>\n)[  ]+", lambda m: m.group(0).replace(" ", "&nbsp;"), s)
    return s


LINE_START = re.compile(r"^(#{1,6}(?=\s|$)|[>+=\-]|\d{1,9}(?=[.)](?:\s|$))|\|)")


def protect_line_starts(text):
    lines = text.split("\n")
    res = []
    for ln in lines:
        m = LINE_START.match(ln)
        if m:
            g = m.group(0)
            if g[0].isdigit():
                # « 1. » en début de ligne serait lu comme une liste numérotée
                ln = g + "\\" + ln[len(g):]
            else:
                ln = "\\" + ln
        res.append(ln)
    return "\n".join(res)


def inline_md(nodes):
    toks = []
    for n in nodes:
        inline_tokens(n, toks)
    toks = normalize_tokens(toks)
    return protect_line_starts(render_inline(toks))


# ----------------------------------------------------------------- blocks ---

def is_inline(node):
    if isinstance(node, Comment):
        return True
    if isinstance(node, NavigableString):
        return True
    return node.name in INLINE_TAGS


def indent(text, n):
    pad = " " * n
    return "\n".join(pad + ln if ln.strip() else "" for ln in text.split("\n"))


class Converter:
    def __init__(self):
        self.anomalies = []

    def blocks(self, children):
        """Liste de nœuds → liste de blocs Markdown (chaînes)."""
        out = []
        run = []
        last_list_marker = None

        def flush():
            if run:
                md = inline_md(run)
                if md.strip(" \u00a0\n"):
                    out.append(("p", md))
                elif "".join(str(r) for r in run).strip():
                    self.anomalies.append("Texte composé uniquement d'espaces ignoré")
                run.clear()

        for c in children:
            if is_inline(c):
                run.append(c)
                continue
            flush()
            name = c.name
            if name == "p":
                md = inline_md(list(c.children))
                if md.strip(" \u00a0\n"):
                    out.append(("p", md))
                else:
                    self.anomalies.append("Paragraphe vide (ou seulement des espaces) ignoré")
            elif name in ("ul", "ol"):
                out.append(("list", self.list_md(c, out)))
            elif name in ("div", "blockquote"):
                if name == "blockquote":
                    raise ConversionError("<blockquote> non géré")
                out.extend(self.blocks(list(c.children)))
            elif name == "hr":
                out.append(("hr", "* * *"))
            elif name == "table":
                out.append(("table", self.table_md(c)))
            else:
                raise ConversionError(f"Balise de bloc inattendue : <{name}>")
        flush()
        return out

    def list_md(self, ul, previous_blocks):
        ordered = ul.name == "ol"
        start = int(ul.get("start", "1")) if ordered else 1
        # deux listes collées fusionneraient : changer de puce
        bullet = "-"
        if previous_blocks and previous_blocks[-1][0] == "list" and not ordered:
            prev = previous_blocks[-1][1].lstrip()
            if prev.startswith("- "):
                bullet = "+"
        items = []
        n = start
        for li in ul.children:
            if isinstance(li, NavigableString):
                if str(li).strip():
                    raise ConversionError("Texte directement dans une liste")
                continue
            if li.name != "li":
                raise ConversionError(f"<{li.name}> directement dans une liste")
            marker = f"{n}. " if ordered else f"{bullet} "
            n += 1
            sub = self.blocks(list(li.children))
            parts = []
            for k, (typ, md) in enumerate(sub):
                if k == 0:
                    parts.append(md)
                else:
                    # sous-liste juste après le texte : liste « serrée »
                    sep = "\n" if (typ == "list" and sub[k - 1][0] == "p") else "\n\n"
                    parts.append(sep + md)
            body = "".join(parts) if parts else ""
            if not body:
                self.anomalies.append("Élément de liste vide")
            first, *rest = body.split("\n", 1)
            text = marker + first
            if rest:
                text += "\n" + indent(rest[0], len(marker))
            items.append(text)
        return "\n".join(items)

    def table_md(self, table):
        rows = table.find_all("tr")
        if not rows:
            raise ConversionError("Tableau vide")
        grid = []
        for r in rows:
            cells = r.find_all(["td", "th"], recursive=False)
            for c in cells:
                if c.get("colspan") or c.get("rowspan"):
                    raise ConversionError("Tableau avec cellules fusionnées : à traiter manuellement")
            grid.append([inline_md(list(c.children)).replace("|", "\\|").replace("<br>\n", "<br>") for c in cells])
        width = max(len(r) for r in grid)
        grid = [r + [""] * (width - len(r)) for r in grid]
        lines = ["| " + " | ".join(grid[0]) + " |", "|" + "---|" * width]
        lines += ["| " + " | ".join(r) + " |" for r in grid[1:]]
        return "\n".join(lines)

    def to_markdown(self, children):
        return "\n\n".join(md for _, md in self.blocks(children))
