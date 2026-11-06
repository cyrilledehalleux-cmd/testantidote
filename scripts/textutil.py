"""Texte « à plat » d'un fragment HTML, pour comparer source et Markdown.

Chaque ligne = (type, texte) où type vaut :
  h2, h3, h4…  pour un titre (niveau)
  p            pour un paragraphe hors liste
  li1, li2…    pour du texte dans une liste (profondeur d'imbrication)
Les espaces HTML (espace, tabulation, retour de ligne) sont fusionnés comme à
l'affichage dans un navigateur ; les autres caractères sont gardés tels quels.
"""
import re
import urllib.parse

from bs4 import Comment, NavigableString, Tag

from mdconv import image_filename, is_red

HTML_WS = re.compile(r"[ \t\n\r\f]+")
BLOCK = {"p", "div", "ul", "ol", "li", "h1", "h2", "h3", "h4", "h5", "h6", "table", "tr", "td", "th",
         "blockquote", "hr", "section", "article", "thead", "tbody"}
FORMAT = {"strong": "B", "b": "B", "em": "I", "i": "I", "u": "U", "sup": "SUP", "sub": "SUB"}


def _kind(node):
    depth = 0
    heading = None
    for a in node.parents:
        if a.name == "li":
            depth += 1
        if a.name and re.match(r"^h[1-6]$", a.name) and heading is None:
            heading = a.name
    if heading:
        return heading
    return f"li{depth}" if depth else "p"


def lines(root):
    """Liste de (type, texte) dans l'ordre du document."""
    out = []
    cur = {"kind": None, "buf": []}

    def flush():
        t = HTML_WS.sub(" ", "".join(cur["buf"])).strip(" ")
        if t.strip("  "):
            out.append((cur["kind"], t))
        cur["buf"] = []
        cur["kind"] = None

    def walk(n):
        for c in n.children:
            if isinstance(c, Comment):
                continue
            if getattr(c, "name", None) in ("style", "script"):
                continue
            if isinstance(c, NavigableString):
                if cur["kind"] is None:
                    cur["kind"] = _kind(c)
                cur["buf"].append(str(c))
            elif c.name == "br":
                flush()
            elif c.name in BLOCK:
                flush()
                walk(c)
                flush()
            else:
                walk(c)

    walk(root)
    flush()
    return out


def formatting(root):
    """Suite des passages mis en forme : (« B+I », texte) – permet de vérifier
    que gras, italique, souligné, exposant, liens sont conservés."""
    import copy
    root = copy.copy(root)
    for br in root.find_all("br"):  # un retour à la ligne sépare toujours deux passages
        br.replace_with(NavigableString("\u2063"))
    segs = []
    for s in root.find_all(string=True):
        if isinstance(s, Comment) or s.find_parent(["style", "script"]):
            continue
        kinds = set()
        for a in s.parents:
            if a.name in FORMAT:
                kinds.add(FORMAT[a.name])
            if a.name in ("font", "span") and (is_red(a) or "rouge" in (a.get("class") or [])):
                kinds.add("ROUGE")
            if a.name == "a":
                kinds.add("A:" + urllib.parse.unquote(a.get("href", "")).strip())
        key = "+".join(sorted(kinds))
        txt = HTML_WS.sub(" ", str(s))
        block_break = s.find_parent(list(BLOCK))
        if segs and segs[-1][0] == key and segs[-1][2] is block_break:
            segs[-1][1] += txt
        else:
            segs.append([key, txt, block_break])
    res = []
    for key, txt, _ in segs:
        for part in txt.split("\u2063"):
            t = part.strip(" \u00a0")
            if key and t:
                res.append((key, HTML_WS.sub(" ", t)))
    return res


def images(root):
    """Liste ordonnée des images (nom de fichier normalisé)."""
    return [image_filename(i.get("src", "")) for i in root.find_all("img")]
