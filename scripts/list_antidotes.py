#!/usr/bin/env python3
"""Met à jour la liste des antidotes de scripts/sources.json à partir de la page
d'index anglaise du guide (source/html/en/index.html, déjà téléchargée).

Chaque lien /en/antidotes/<slug> de l'index devient une entrée { id, en }.
Les pages qui ne sont pas des monographies (ex. « Contact Us ») sont exclues.
La page française est ensuite trouvée par scripts/download.py en suivant le lien
« Français » de chaque page anglaise (jamais devinée).

Usage : python3 scripts/list_antidotes.py   puis   python3 scripts/download.py
"""
import json
import pathlib
import urllib.parse

from bs4 import BeautifulSoup

ROOT = pathlib.Path(__file__).resolve().parent.parent
NOT_MONOGRAPHS = {"liens-et-coordonnées", "liens-et-coordonnees", "centres"}


def main():
    cfg_path = ROOT / "scripts" / "sources.json"
    cfg = json.loads(cfg_path.read_text(encoding="utf-8"))
    soup = BeautifulSoup((ROOT / "source/html/en/index.html").read_text(encoding="utf-8"), "html.parser")
    seen, antidotes = set(), []
    for a in soup.find_all("a", href=True):
        h = a["href"]
        if not h.startswith("/en/antidotes/") or h.count("/") != 3:
            continue
        slug = urllib.parse.unquote(h.rsplit("/", 1)[-1])
        if slug in NOT_MONOGRAPHS or slug in seen:
            continue
        seen.add(slug)
        antidotes.append({"id": slug, "en": h})
    cfg["antidotes"] = antidotes
    cfg_path.write_text(json.dumps(cfg, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"{len(antidotes)} antidotes inscrits dans scripts/sources.json")


if __name__ == "__main__":
    main()
