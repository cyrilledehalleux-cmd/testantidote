#!/usr/bin/env python3
"""Télécharge les pages officielles, sans aucune modification.

- Page anglaise : URL de scripts/sources.json
- Page française : trouvée en suivant le lien « Français » de la page anglaise
  (le slug français n'est jamais deviné).
- Fichiers enregistrés tels quels dans source/html/<lang>/<slug>.html
- source/html/manifest.json garde l'URL, la date de téléchargement et le SHA-256.

Usage : python3 scripts/download.py
"""
import datetime
import hashlib
import json
import pathlib
import sys
import urllib.request

from bs4 import BeautifulSoup

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "source" / "html"
UA = "Mozilla/5.0 (antidote-guide-demo extractor)"


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        if r.status != 200:
            raise RuntimeError(f"{url}: HTTP {r.status}")
        return r.read()


def french_link(raw_html, base):
    soup = BeautifulSoup(raw_html, "html.parser")
    for a in soup.find_all("a"):
        if a.get_text(strip=True) == "Français" and a.get("href"):
            href = a["href"]
            return href if href.startswith("http") else base + href
    raise RuntimeError("Lien « Français » introuvable")


def save(lang, slug, url, raw, manifest):
    path = SRC / lang / f"{slug}.html"
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(raw)
    manifest[f"{lang}/{slug}"] = {
        "url": url,
        "file": str(path.relative_to(ROOT)),
        "downloaded": datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds"),
        "sha256": hashlib.sha256(raw).hexdigest(),
        "bytes": len(raw),
    }
    print(f"  {lang}/{slug}.html  ← {url}")


def main():
    cfg = json.loads((ROOT / "scripts" / "sources.json").read_text(encoding="utf-8"))
    base = cfg["base"]
    manifest = {}
    for lang, p in cfg["index"].items():
        save(lang, "index", base + p, fetch(base + p), manifest)
    for a in cfg["antidotes"]:
        en_url = base + a["en"]
        en_raw = fetch(en_url)
        save("en", a["id"], en_url, en_raw, manifest)
        fr_url = french_link(en_raw, base)
        fr_slug = fr_url.rstrip("/").rsplit("/", 1)[-1]
        fr_raw = fetch(fr_url)
        save("fr", fr_slug, fr_url, fr_raw, manifest)
        manifest[f"fr/{fr_slug}"]["antidote_id"] = a["id"]
        manifest[f"en/{a['id']}"]["antidote_id"] = a["id"]
    (SRC / "manifest.json").write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print("OK – source/html/manifest.json")


if __name__ == "__main__":
    sys.exit(main())
