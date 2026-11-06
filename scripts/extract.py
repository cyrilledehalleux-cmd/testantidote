#!/usr/bin/env python3
"""Extrait le contenu des pages HTML enregistrées vers des fichiers Markdown.

Entrée  : source/html/<lang>/*.html  (+ source/html/manifest.json)
Sortie  : content/<lang>/<id>.md     (une monographie par langue)
          content/<lang>/advice.md, abbreviations.md, about.md (page d'accueil du guide)
          reports/extraction-data.json (pour le rapport)

Les sections sont détectées dans le HTML (aucune liste codée en dur),
dans l'ordre et avec les titres d'origine.

Usage : python3 scripts/extract.py
"""
import json
import pathlib
import re
import sys

from bs4 import BeautifulSoup, NavigableString, Tag

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from mdconv import Converter, HTML_WS, ConversionError  # noqa: E402
from frontmatter import dump_frontmatter  # noqa: E402

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "source" / "html"
OUT = ROOT / "content"
FOOTER_MARK = "<!-- pied de page / footer -->"
DATE_RE = re.compile(r"(\d{4}-\d{2}-\d{2})")


def clean_title(h):
    """Texte d'un titre de section, sans les boutons ni le « + » d'affichage."""
    parts = []
    for c in h.children:
        if isinstance(c, Tag) and c.name == "button":
            continue
        parts.append(c.get_text() if isinstance(c, Tag) else str(c))
    t = HTML_WS.sub(" ", "".join(parts)).strip()
    if t.startswith("+"):
        t = t[1:].strip()
    return t


def heading_inner_md(h):
    """Titre en Markdown (garde l'éventuelle mise en forme interne)."""
    import copy
    from mdconv import inline_md
    h = copy.copy(h)
    for b in h.find_all("button"):
        b.decompose()
    # le « + » qui précède le titre est un bouton d'affichage du site, pas du contenu
    for s in h.find_all(string=True):
        if s.strip():
            if s.lstrip().startswith("+"):
                s.replace_with(s.lstrip()[1:])
            break
    return inline_md(list(h.children)).strip()


def parse_section(wrapper, level, conv, info):
    toggle = wrapper.find("div", class_="dropdownToggle", recursive=False)
    content = wrapper.find("div", class_="drowndownContent", recursive=False)
    h = toggle.find(re.compile(r"^h[1-6]$"))
    title = clean_title(h)
    lines = ["#" * level + " " + heading_inner_md(h)]
    entry = {"title": title, "level": level, "subsections": [], "chars": 0}
    pending = []

    def flush():
        if pending:
            md = conv.to_markdown(pending)
            if md:
                lines.append(md)
                entry["chars"] += len(md)
            pending.clear()

    for c in content.children:
        if isinstance(c, Tag) and "dropdownToggleWrapper" in (c.get("class") or []):
            flush()
            sub_md, sub_entry = parse_section(c, level + 1, conv, info)
            lines.append(sub_md)
            entry["subsections"].append(sub_entry)
        elif isinstance(c, Tag) and c.find("div", class_="dropdownToggleWrapper"):
            # conteneur intermédiaire contenant des sous-sections
            flush()
            for cc in c.children:
                if isinstance(cc, Tag) and "dropdownToggleWrapper" in (cc.get("class") or []):
                    sub_md, sub_entry = parse_section(cc, level + 1, conv, info)
                    lines.append(sub_md)
                    entry["subsections"].append(sub_entry)
                else:
                    pending.append(cc)
            flush()
        else:
            pending.append(c)
    flush()
    if entry["chars"] == 0 and not entry["subsections"]:
        info["anomalies"].append(f"Section vide : « {title} »")
    return "\n\n".join(lines), entry


def parse_monograph(path, meta):
    soup = BeautifulSoup(path.read_text(encoding="utf-8"), "html.parser")
    lang = soup.html.get("lang", "")[:2]
    h1 = soup.find("h1")
    h1_strings = list(h1.stripped_strings)
    guide_title, title = h1_strings[0], HTML_WS.sub(" ", " ".join(h1_strings[1:])).strip()
    detail = soup.find("div", class_="antidoteDetail")
    if detail is None:
        raise ConversionError(f"{path}: bloc antidoteDetail introuvable")

    conv = Converter()
    info = {"anomalies": [], "sections": [], "lang": lang}
    body = []
    footer_md = ""
    last_rev, last_rev_label = "", ""
    children = list(detail.children)
    i = 0
    while i < len(children):
        c = children[i]
        if isinstance(c, NavigableString):
            if str(c).strip():
                info["anomalies"].append(f"Texte hors section ignoré : {str(c).strip()[:60]}")
            i += 1
            continue
        cls = c.get("class") or []
        if c.name and re.match(r"^h[1-6]$", c.name):
            # section non repliable (ex. « Key points ») : contenu jusqu'à la section suivante
            sec_title = clean_title(c)
            level = 2
            lines = ["#" * level + " " + heading_inner_md(c)]
            j = i + 1
            pending = []
            while j < len(children):
                n = children[j]
                if isinstance(n, Tag) and ("dropdownToggleWrapper" in (n.get("class") or []) or re.match(r"^h[1-6]$", n.name)):
                    break
                pending.append(n)
                j += 1
            md = conv.to_markdown(pending)
            if md:
                lines.append(md)
            else:
                info["anomalies"].append(f"Section vide : « {sec_title} »")
            body.append("\n\n".join(lines))
            info["sections"].append({"title": sec_title, "level": level, "subsections": [], "chars": len(md)})
            i = j
            continue
        if "dropdownToggleWrapper" in cls:
            md, entry = parse_section(c, 2, conv, info)
            body.append(md)
            info["sections"].append(entry)
            i += 1
            continue
        if c.name == "br":
            i += 1
            continue
        small = c.find("small") if c.name == "div" else None
        if small is not None and DATE_RE.search(small.get_text()):
            txt = HTML_WS.sub(" ", small.get_text()).strip()
            last_rev = DATE_RE.search(txt).group(1)
            last_rev_label = txt.split(":")[0].strip()
            i += 1
            continue
        if c.name == "div":
            # pied de page (droits d'auteur, ISSN, auteurs…)
            md = conv.to_markdown([c])
            if md:
                footer_md = (footer_md + "\n\n" + md).strip()
            i += 1
            continue
        raise ConversionError(f"{path}: élément inattendu <{c.name}>")

    info["anomalies"].extend(conv.anomalies)
    fm = {
        "id": meta["antidote_id"],
        "title": title,
        "guide_title": guide_title,
        "source_url": meta["url"],
        "retrieved": meta["downloaded"][:10],
        "last_revision": last_rev,
        "last_revision_label": last_rev_label,
    }
    if not last_rev:
        info["anomalies"].append("Date de dernière révision introuvable")
    text = dump_frontmatter(fm) + "\n" + "\n\n".join(body) + "\n"
    if footer_md:
        text += "\n" + FOOTER_MARK + "\n\n" + footer_md + "\n"
    info.update({"id": fm["id"], "title": title, "last_revision": last_rev, "source_url": meta["url"],
                 "chars": len(text), "file": None})
    return text, info


def parse_index(path, meta):
    """Page d'accueil du guide : une page Markdown par section (h2)."""
    soup = BeautifulSoup(path.read_text(encoding="utf-8"), "html.parser")
    blocks = soup.find_all("div", attrs={"property": "schema:text"})
    if len(blocks) != 1:
        raise ConversionError(f"{path}: {len(blocks)} blocs de texte trouvés (1 attendu)")
    block = blocks[0]
    parts, cur = [], None
    for c in block.children:
        if isinstance(c, Tag) and c.name == "h2":
            cur = {"h": c, "nodes": []}
            parts.append(cur)
        elif cur is not None:
            cur["nodes"].append(c)
        elif str(c).strip():
            raise ConversionError(f"{path}: contenu avant le premier titre")
    return parts


INDEX_FILES = ["advice", "about", "abbreviations"]  # dans l'ordre de la page


def main():
    manifest = json.loads((SRC / "manifest.json").read_text(encoding="utf-8"))
    report = {"monographs": [], "pages": []}
    for key, meta in manifest.items():
        lang, slug = key.split("/")
        path = ROOT / meta["file"]
        (OUT / lang).mkdir(parents=True, exist_ok=True)
        if slug == "index":
            parts = parse_index(path, meta)
            if len(parts) != len(INDEX_FILES):
                raise ConversionError(f"{path}: {len(parts)} sections, {len(INDEX_FILES)} attendues")
            for name, part in zip(INDEX_FILES, parts):
                conv = Converter()
                md = conv.to_markdown(part["nodes"])
                fm = {"title": clean_title(part["h"]), "source_url": meta["url"], "retrieved": meta["downloaded"][:10]}
                out = OUT / lang / f"{name}.md"
                out.write_text(dump_frontmatter(fm) + "\n" + md + "\n", encoding="utf-8")
                report["pages"].append({"lang": lang, "file": str(out.relative_to(ROOT)), "title": fm["title"],
                                        "chars": len(md), "anomalies": conv.anomalies})
                print(f"  {out.relative_to(ROOT)}")
            continue
        text, info = parse_monograph(path, meta)
        out = OUT / lang / f"{meta['antidote_id']}.md"
        out.write_text(text, encoding="utf-8")
        info["file"] = str(out.relative_to(ROOT))
        info["source_file"] = meta["file"]
        report["monographs"].append(info)
        print(f"  {out.relative_to(ROOT)}  ({len(info['sections'])} sections)")
    (ROOT / "reports").mkdir(exist_ok=True)
    (ROOT / "reports" / "extraction-data.json").write_text(
        json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
