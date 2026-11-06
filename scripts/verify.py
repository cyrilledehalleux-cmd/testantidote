#!/usr/bin/env python3
"""Vérification automatique : le contenu Markdown est-il identique au site ?

Pour chaque page (monographies + avis au lecteur + abréviations…) :
  1. texte de la page source (contenu principal seulement, sans les éléments
     d'interface du site : boutons « Ouvrir tout / Imprimer », le « + »
     des sections repliables, la ligne de date qui est comparée à part)
  2. texte du fichier Markdown, rendu en HTML par un moteur CommonMark
  3. si l'application a été construite (dist/), texte réellement affiché par
     l'application (HTML produit par build/build.mjs)
On compare ligne par ligne (avec le type : titre, paragraphe, liste et niveau),
puis la mise en forme (gras, italique, souligné, exposant, liens),
puis le titre et la date de révision.

Résultat : reports/verify-diff.txt — doit être VIDE.
Code de sortie 1 s'il y a la moindre différence.

Usage : python3 scripts/verify.py
"""
import copy
import difflib
import json
import pathlib
import re
import sys

from bs4 import BeautifulSoup, Tag
from markdown_it import MarkdownIt

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from frontmatter import parse_frontmatter  # noqa: E402
from textutil import formatting, images, lines, HTML_WS  # noqa: E402

ROOT = pathlib.Path(__file__).resolve().parent.parent
MD = MarkdownIt("commonmark", {"html": True}).enable("table")
INDEX_FILES = ["advice", "about", "abbreviations"]


def source_monograph(path):
    soup = BeautifulSoup(path.read_text(encoding="utf-8"), "html.parser")
    h1 = list(soup.find("h1").stripped_strings)
    detail = copy.copy(soup.find("div", class_="antidoteDetail"))
    removed = []
    for st in detail.find_all("style"):
        removed.append("bloc <style> (mise en forme CSS)")
        st.decompose()
    for b in detail.find_all("button"):
        removed.append("bouton : " + HTML_WS.sub(" ", b.get_text()).strip())
        b.decompose()
    date_text = ""
    for sm in detail.find_all("small"):
        date_text = HTML_WS.sub(" ", sm.get_text()).strip()
        removed.append("ligne de date : " + date_text)
        sm.decompose()
    # titres des sections repliables : niveau réel selon l'imbrication, sans le « + »
    for h in detail.find_all("h2"):
        level = 2 + len([a for a in h.parents if isinstance(a, Tag) and "dropdownToggleWrapper" in (a.get("class") or [])]) - 1
        if not h.find_parent("div", class_="dropdownToggle"):
            level = 2
        h.name = f"h{level}"
        for s in h.find_all(string=True):
            if s.strip():
                if s.lstrip().startswith("+"):
                    s.replace_with(s.lstrip()[1:])
                    removed.append("« + » d'affichage devant un titre")
                break
    title = HTML_WS.sub(" ", " ".join(h1[1:])).strip()
    return detail, title, date_text, removed


def source_index_part(path, n):
    soup = BeautifulSoup(path.read_text(encoding="utf-8"), "html.parser")
    block = soup.find("div", attrs={"property": "schema:text"})
    parts, cur = [], None
    for c in block.children:
        if isinstance(c, Tag) and c.name == "h2":
            cur = BeautifulSoup("<div></div>", "html.parser").div
            parts.append((HTML_WS.sub(" ", c.get_text()).strip(), cur))
        elif cur is not None:
            cur.append(copy.copy(c))
    return parts[n]


def compose(sections):
    """Même assemblage que l'application (app/app.js, sectionHtml)."""
    return "".join(f"<h{s['level']}>{s['titleHtml']}</h{s['level']}>{s['html']}{compose(s['children'])}" for s in sections)


def source_centres(path):
    """Page « Centres » : liste des centres ; logos retirés ; h3 (nom) → niveau 2, h4 (note) → niveau 3."""
    soup = BeautifulSoup(path.read_text(encoding="utf-8"), "html.parser")
    h1 = list(soup.find("h1").stripped_strings)
    detail = BeautifulSoup("<div></div>", "html.parser").div
    for d in soup.select("div.centreDetail"):
        detail.append(copy.copy(d))
    # chaque centre est une « carte » (section ## dans le Markdown) : la liste qui les enveloppe
    # sur le site (ul/li) est traitée comme un simple conteneur
    for t in detail.find_all(["ul", "li"]):
        t.name = "div"
    n = 0
    for img in detail.find_all("img"):
        img.decompose()
        n += 1
    for h in detail.find_all("h3"):
        h.name = "h2"
    for h in detail.find_all("h4"):
        h.name = "h3"
    return detail, HTML_WS.sub(" ", " ".join(h1[1:])).strip(), n


def rendered(html):
    return BeautifulSoup("<div>" + html + "</div>", "html.parser").div


def compare(label, src_root, dst_root, out):
    a, b = lines(src_root), lines(dst_root)
    fa = [f"{k}\t{t}" for k, t in a]
    fb = [f"{k}\t{t}" for k, t in b]
    diff = list(difflib.unified_diff(fa, fb, f"{label} [site]", f"{label} [markdown]", lineterm="", n=1))
    fmt_a = [f"{k}\t{t}" for k, t in formatting(src_root)]
    fmt_b = [f"{k}\t{t}" for k, t in formatting(dst_root)]
    diff_fmt = list(difflib.unified_diff(fmt_a, fmt_b, f"{label} [site, mise en forme]",
                                         f"{label} [markdown, mise en forme]", lineterm="", n=1))
    ia, ib = images(src_root), images(dst_root)
    diff_img = [] if ia == ib else [f"--- {label} images : site {ia} / markdown {ib}"]
    for name in ib:
        if not (ROOT / "content" / "images" / name).exists():
            diff_img.append(f"--- {label} : image manquante content/images/{name}")
    diff_fmt += diff_img
    out.extend(diff + diff_fmt)
    chars = sum(len(t) for _, t in a)
    return len(diff) + len(diff_fmt) == 0, len(a), chars


def main():
    manifest = json.loads((ROOT / "source/html/manifest.json").read_text(encoding="utf-8"))
    dist = ROOT / "dist" / "data" / "content.json"
    app = json.loads(dist.read_text(encoding="utf-8")) if dist.exists() else None
    out, summary, chrome = [], [], set()
    for key, meta in manifest.items():
        lang, slug = key.split("/")
        src = ROOT / meta["file"]
        if meta.get("page") == "centres":
            root, title, nimg = source_centres(src)
            chrome.add(f"logos des centres antipoison (images externes, {nimg} par langue)")
            fm, body = parse_frontmatter((ROOT / "content" / lang / "centres.md").read_text(encoding="utf-8"))
            ok, nl, nc = compare(f"{lang}/centres", root, rendered(MD.render(body)), out)
            if fm.get("title") != title:
                out.append(f"{lang}/centres: titre différent : site « {title} » / fichier « {fm.get('title')} »")
                ok = False
            if app is not None and "centres" in app[lang]["pages"]:
                ok2, _, _ = compare(f"{lang}/centres (application)", root, rendered(app[lang]["pages"]["centres"]["html"]), out)
                ok = ok and ok2
            summary.append((f"{lang}/centres", ok, nl, nc))
            continue
        if slug == "index":
            for n, name in enumerate(INDEX_FILES):
                title, root = source_index_part(src, n)
                md_path = ROOT / "content" / lang / f"{name}.md"
                fm, body = parse_frontmatter(md_path.read_text(encoding="utf-8"))
                ok, nl, nc = compare(f"{lang}/{name}", root, rendered(MD.render(body)), out)
                if fm.get("title") != title:
                    out.append(f"{lang}/{name}: titre différent : site « {title} » / fichier « {fm.get('title')} »")
                    ok = False
                if app is not None:
                    page = app[lang]["pages"][name]
                    ok2, _, _ = compare(f"{lang}/{name} (application)", root, rendered(page["html"]), out)
                    ok = ok and ok2
                summary.append((f"{lang}/{name}", ok, nl, nc))
            continue
        aid = meta["antidote_id"]
        root, title, date_text, removed = source_monograph(src)
        chrome.update(removed)
        md_path = ROOT / "content" / lang / f"{aid}.md"
        fm, body = parse_frontmatter(md_path.read_text(encoding="utf-8"))
        ok, nl, nc = compare(f"{lang}/{aid}", root, rendered(MD.render(body)), out)
        if fm.get("title") != title:
            out.append(f"{lang}/{aid}: titre différent : site « {title} » / fichier « {fm.get('title')} »")
            ok = False
        m = re.search(r"\d{4}-\d{2}-\d{2}", date_text)
        if not m or fm.get("last_revision") != m.group(0):
            out.append(f"{lang}/{aid}: date de révision différente : site « {date_text} » / fichier « {fm.get('last_revision')} »")
            ok = False
        if app is not None:
            mono = app[lang]["monographs"][aid]
            ok2, _, _ = compare(f"{lang}/{aid} (application)", root, rendered(compose(mono["sections"]) + mono["footerHtml"]), out)
            if mono["title"] != title or mono["last_revision"] != fm.get("last_revision"):
                out.append(f"{lang}/{aid} (application): titre ou date différents")
                ok2 = False
            ok = ok and ok2
        summary.append((f"{lang}/{aid}", ok, nl, nc))

    (ROOT / "reports").mkdir(exist_ok=True)
    (ROOT / "reports" / "verify-diff.txt").write_text("\n".join(out) + ("\n" if out else ""), encoding="utf-8")
    (ROOT / "reports" / "verify-summary.json").write_text(json.dumps({
        "app_checked": app is not None,
        "pages": [{"page": p, "identical": ok, "lines": nl, "chars": nc} for p, ok, nl, nc in summary],
        "removed_site_chrome": sorted(chrome),
    }, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    for p, ok, nl, nc in summary:
        print(f"  {'OK ' if ok else 'ÉCART'}  {p:40s} {nl:4d} lignes  {nc:6d} caractères")
    print(f"  Application (dist/) vérifiée : {'oui' if app is not None else 'non (lancer npm run build)'}")
    if out:
        print(f"\n{len(out)} lignes de différence → reports/verify-diff.txt")
        return 1
    print("\nAucune différence : reports/verify-diff.txt est vide.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
