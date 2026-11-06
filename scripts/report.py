#!/usr/bin/env python3
"""Rapport d'extraction + pages de relecture imprimables.

Entrées : reports/extraction-data.json (scripts/extract.py),
          reports/verify-summary.json (scripts/verify.py), content/<lang>/*.md
Sorties : reports/extraction-report.md, reports/review-fr.html, reports/review-en.html

Usage : python3 scripts/report.py
"""
import datetime
import html
import json
import pathlib
import sys

from markdown_it import MarkdownIt

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from frontmatter import parse_frontmatter  # noqa: E402

ROOT = pathlib.Path(__file__).resolve().parent.parent
MD = MarkdownIt("commonmark", {"html": True}).enable("table")
LANGS = ["fr", "en"]


def shape(sections):
    """Forme de l'arbre (nombre de sous-sections), pour comparer FR et EN."""
    return [len(s["subsections"]) for s in sections]


def flat(sections, prefix=""):
    for n, s in enumerate(sections, 1):
        num = f"{prefix}{n}"
        yield num, s
        yield from flat(s["subsections"], num + ".")


def main():
    data = json.loads((ROOT / "reports/extraction-data.json").read_text(encoding="utf-8"))
    vpath = ROOT / "reports/verify-summary.json"
    verify = json.loads(vpath.read_text(encoding="utf-8")) if vpath.exists() else None
    vmap = {p["page"]: p for p in verify["pages"]} if verify else {}
    by_id = {}
    for m in data["monographs"]:
        by_id.setdefault(m["id"], {})[m["lang"]] = m

    r = []
    r.append("# Rapport d'extraction / Extraction report\n")
    r.append(f"Généré le {datetime.date.today().isoformat()} par `scripts/report.py`.\n")
    r.append("Source : pages officielles du *Guide canadien des antidotes* (CIUSSS de la Capitale-Nationale), "
             "téléchargées telles quelles dans `source/html/` (voir `source/html/manifest.json` : URL, date, SHA-256).\n")
    r.append("## Vérification automatique / Automatic verification\n")
    if verify:
        n_ok = sum(1 for p in verify["pages"] if p["identical"])
        r.append(f"- Pages comparées : **{len(verify['pages'])}**, identiques : **{n_ok}**.")
        r.append(f"- Application construite (`dist/`) également vérifiée : **{'oui' if verify['app_checked'] else 'non'}**.")
        diff = (ROOT / "reports/verify-diff.txt").read_text(encoding="utf-8")
        r.append(f"- `reports/verify-diff.txt` : **{'vide (aucune différence)' if not diff.strip() else 'NON VIDE – voir le fichier'}**.")
        r.append("- Éléments d'interface du site retirés (et seulement ceux-ci) :")
        for c in verify["removed_site_chrome"]:
            r.append(f"  - {c}")
        r.append("- La date « Last updated / Dernière mise à jour » est retirée du texte et comparée séparément "
                 "avec `last_revision` dans l'en-tête du fichier.")
        r.append("- Méthode : texte du site (bloc principal) et texte du Markdown rendu (moteur CommonMark) comparés "
                 "ligne par ligne avec le type de ligne (titre et niveau, paragraphe, liste et niveau d'imbrication), "
                 "puis comparaison de la mise en forme (gras, italique, souligné, exposant, liens). "
                 "Les espaces de mise en page HTML (espaces multiples, tabulations, retours de ligne dans le code source) "
                 "sont fusionnés des deux côtés comme le fait un navigateur ; les espaces insécables sont conservés.\n")
    else:
        r.append("- `scripts/verify.py` n'a pas encore été lancé.\n")

    r.append("## Monographies / Monographs\n")
    for aid, langs in by_id.items():
        r.append(f"### {langs.get('fr', {}).get('title', '?')} / {langs.get('en', {}).get('title', '?')}\n")
        r.append("| | FR | EN |\n|---|---|---|")
        g = lambda l, k: str(langs.get(l, {}).get(k, "—"))
        r.append(f"| Fichier | `{g('fr', 'file')}` | `{g('en', 'file')}` |")
        r.append(f"| Source | {g('fr', 'source_url')} | {g('en', 'source_url')} |")
        r.append(f"| Dernière révision | {g('fr', 'last_revision')} | {g('en', 'last_revision')} |")
        r.append(f"| Sections (##) | {len(langs.get('fr', {}).get('sections', []))} | {len(langs.get('en', {}).get('sections', []))} |")
        sub = lambda l: sum(len(s["subsections"]) for s in langs.get(l, {}).get("sections", []))
        r.append(f"| Sous-sections (###) | {sub('fr')} | {sub('en')} |")
        vc = lambda l: vmap.get(f"{l}/{aid}", {})
        r.append(f"| Caractères (texte affiché) | {vc('fr').get('chars', '—')} | {vc('en').get('chars', '—')} |")
        r.append(f"| Identique au site | {'oui' if vc('fr').get('identical') else 'NON'} | {'oui' if vc('en').get('identical') else 'NON'} |")
        r.append("")
        fr, en = langs.get("fr"), langs.get("en")
        anomalies = []
        if fr and en:
            if shape(fr["sections"]) != shape(en["sections"]):
                anomalies.append("La structure des sections diffère entre FR et EN (voir la liste ci-dessous).")
            if fr["last_revision"] != en["last_revision"]:
                anomalies.append(f"Dates de révision différentes : FR {fr['last_revision']}, EN {en['last_revision']}.")
        else:
            anomalies.append("Une langue est manquante.")
        for l in LANGS:
            for a in langs.get(l, {}).get("anomalies", []):
                anomalies.append(f"[{l.upper()}] {a}")
        r.append("**Sections, dans l'ordre d'origine :**\n")
        r.append("| # | FR | EN |\n|---|---|---|")
        fl = list(flat(fr["sections"])) if fr else []
        el = list(flat(en["sections"])) if en else []
        for k in range(max(len(fl), len(el))):
            a = fl[k] if k < len(fl) else None
            b = el[k] if k < len(el) else None
            num = (a or b)[0]
            ind = "↳ " if "." in num else ""
            ta = f"{ind}{a[1]['title']}" if a else "*(manquante)*"
            tb = f"{ind}{b[1]['title']}" if b else "*(manquante)*"
            r.append(f"| {num} | {ta} | {tb} |")
        r.append("")
        r.append("**Anomalies :** " + ("aucune." if not anomalies else ""))
        for a in anomalies:
            r.append(f"- {a}")
        r.append("")

    r.append("## Pages générales / General pages\n")
    r.append("| Fichier | Titre | Caractères | Identique au site | Anomalies |\n|---|---|---|---|---|")
    for p in data["pages"]:
        name = pathlib.Path(p["file"]).stem
        v = vmap.get(f"{p['lang']}/{name}", {})
        r.append(f"| `{p['file']}` | {p['title']} | {v.get('chars', '—')} | {'oui' if v.get('identical') else 'NON'} | "
                 f"{'; '.join(p['anomalies']) or 'aucune'} |")
    r.append("")
    r.append("## Calculateur / Calculator\n")
    r.append("- La page officielle *Anticorps spécifique de la digoxine / Digoxin-Specific Antibodies*, section "
             "**Posologie / Dosage** (Dose pédiatrique et Dose adulte), donne explicitement les formules : "
             "nmol/L × 0,00781 × poids (kg) et [ng/mL × poids (kg)] ÷ 100, arrondi à la fiole supérieure.")
    r.append("- À la demande de l'utilisateur, le calculateur applique la formule de **MDCalc** "
             "(DigiFab Dosing for Digoxin Poisoning, page enregistrée dans `source/mdcalc/`) : "
             "fioles = [digoxinémie (ng/mL) × poids (kg)] ÷ 100, ou (quantité ingérée en mg ÷ 0,5 mg/fiole) × 80 % ; "
             "conversion 1 ng/mL = 1,281 nmol/L (constante de MDCalc). Unités SI par défaut (nmol/L, kg).")
    r.append("- Le résultat de la formule officielle en nmol/L (× 0,00781) est affiché en contre-vérification ; "
             "un avertissement apparaît si les deux arrondis diffèrent.")
    r.append("- Cas de test : `tests/digifab.test.mjs` (valeurs attendues à calculer à la main par l'équipe : TODO).\n")
    (ROOT / "reports/extraction-report.md").write_text("\n".join(r) + "\n", encoding="utf-8")
    print("  reports/extraction-report.md")

    # Pages de relecture imprimables
    for lang in LANGS:
        h = [f"<!doctype html><html lang='{lang}'><head><meta charset='utf-8'>",
             "<meta name='viewport' content='width=device-width, initial-scale=1'>",
             f"<title>{'Relecture' if lang == 'fr' else 'Review'} – Guide canadien des antidotes ({lang.upper()})</title>",
             "<style>body{font:15px/1.45 Georgia,serif;max-width:46rem;margin:2rem auto;padding:0 1rem;color:#111;background:#fff}"
             "h1{font-size:1.6rem;margin-top:3rem;border-top:3px solid #333;padding-top:1rem}h1:first-of-type{border:0;margin-top:0}"
             "h2{font-size:1.25rem;margin-top:1.6rem}h3{font-size:1.08rem}h4{font-size:1rem}"
             ".meta{font:13px/1.4 system-ui,sans-serif;color:#444;background:#f3f3f3;padding:.5rem .75rem}"
             ".foot{font-size:13px;color:#333;border-top:1px solid #aaa;margin-top:1.5rem}"
             ".banner{font:bold 14px system-ui,sans-serif;background:#ffe9a8;padding:.4rem .75rem}"
             "@media print{.banner{background:none;border:1px solid #000}h1{page-break-before:always}h1:first-of-type{page-break-before:avoid}}"
             "</style></head><body>",
             "<p class='banner'>DÉMO – contenu non validé / DEMO – content not validated. "
             + ("Page de relecture pour comparaison avec les fichiers Word." if lang == "fr" else
                "Review page for comparison with the Word files.") + "</p>"]
        ids = list(by_id.keys())
        files = sorted(ids, key=lambda i: by_id[i][lang]["title"].lower())
        for aid in files:
            fm, body = parse_frontmatter((ROOT / "content" / lang / f"{aid}.md").read_text(encoding="utf-8"))
            main_part, _, foot = body.partition("<!-- pied de page / footer -->")
            h.append(f"<h1>{html.escape(fm['title'])}</h1>")
            h.append(f"<p class='meta'>{html.escape(fm.get('last_revision_label', ''))} : <b>{html.escape(fm['last_revision'])}</b>"
                     f" · {'Source' if lang == 'en' else 'Source'} : {html.escape(fm['source_url'])}"
                     f" · {'Retrieved' if lang == 'en' else 'Téléchargé le'} {html.escape(fm['retrieved'])}"
                     f" · {'File' if lang == 'en' else 'Fichier'} : content/{lang}/{aid}.md</p>")
            h.append(MD.render(main_part))
            if foot.strip():
                h.append(f"<div class='foot'>{MD.render(foot)}</div>")
        for name in ["advice", "abbreviations"]:
            fm, body = parse_frontmatter((ROOT / "content" / lang / f"{name}.md").read_text(encoding="utf-8"))
            h.append(f"<h1>{html.escape(fm['title'])}</h1>")
            h.append(MD.render(body))
        h.append("</body></html>")
        (ROOT / f"reports/review-{lang}.html").write_text("\n".join(h), encoding="utf-8")
        print(f"  reports/review-{lang}.html")


if __name__ == "__main__":
    main()
