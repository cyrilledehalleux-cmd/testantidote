"""En-tête simple des fichiers Markdown (entre deux lignes « --- »).

Format volontairement minimal pour les non-programmeurs :
une ligne par information, « clé: valeur ». La valeur est le reste de la
ligne, telle quelle (pas de guillemets à gérer).
Le même format est lu par l'application (build/build.mjs).
"""
import re

KEY = re.compile(r"^([a-z_]+):[ ]?(.*)$")


def dump_frontmatter(d):
    lines = ["---"]
    for k, v in d.items():
        v = str(v)
        if "\n" in v:
            raise ValueError(f"Valeur sur plusieurs lignes pour {k}")
        lines.append(f"{k}: {v}")
    lines.append("---")
    return "\n".join(lines) + "\n"


def parse_frontmatter(text):
    """Retourne (dict, corps). Lève ValueError si l'en-tête est mal formé."""
    text = text.lstrip("﻿")
    if not text.startswith("---\n") and not text.startswith("---\r\n"):
        raise ValueError("Le fichier doit commencer par une ligne « --- »")
    lines = text.splitlines(keepends=True)
    meta = {}
    for n, ln in enumerate(lines[1:], start=1):
        s = ln.rstrip("\r\n")
        if s.strip() == "---":
            return meta, "".join(lines[n + 1:])
        if not s.strip():
            continue
        m = KEY.match(s)
        if not m:
            raise ValueError(f"Ligne {n + 1} de l'en-tête mal formée : « {s} » (attendu « clé: valeur »)")
        meta[m.group(1)] = m.group(2).strip()
    raise ValueError("En-tête non fermé : il manque la deuxième ligne « --- »")
