// Passages de la monographie « Dextrose » affichés dans le calculateur.
// Le texte n'est PAS recopié ici : l'application le lit dans la monographie (data/content.json),
// donc il reste identique au guide et suit les modifications des cliniciens.
// Chaque entrée = un fragment unique qui identifie la ligne à citer (en français et en anglais).
// tests/dextrose-quotes.test.mjs vérifie que chaque fragment est trouvé dans les deux langues.
export const DEXTROSE_ID = 'dextrose';
export const QUOTES = {
  indicationHdi: { fr: 'Traitement adjuvant à l’insuline à haute dose afin de maintenir l’euglycémie lors', en: 'Adjuvant therapy with high doses of insulin to maintain euglycemia in cases' },
  maintenance: { fr: '0,5 g/kg/h (ou selon glycémie)', en: '0.5 g/kg/h (or based on blood glucose', all: true }, // dose pédiatrique ET dose adulte
  warning: { fr: 'Chez le patient hémodynamiquement instable, une glycémie à la baisse', en: 'In patients with an unstable hemodynamic status' },
  monitoring: { fr: 'Glycémie capillaire aux 30 min', en: 'Capillary blood glucose every 30 min' },
  after24h: { fr: 'il faudra parfois continuer l’administration de dextrose pendant 24 h ou plus après l’arrêt', en: 'may need to be continued for 24 h or more after the discontinuation' },
  peripheral: { fr: '850 mOsm/L, la concentration du soluté dextrosé', en: '850 mOsm/L, the dextrose solution concentration' },
  glycosuria: { fr: 'ne pas entraîner de la glycosurie', en: 'To prevent glucosuria' },
  wean: { fr: 'arrêter brusquement la perfusion du dextrose concentré', en: 'needs to be ceased abruptly' },
};

/** Lignes de texte de la monographie, avec le titre de leur section : [{ text, section, sectionId }]. */
export function monographLines(monograph) {
  const out = [];
  const walk = (secs, trail) => secs.forEach(s => {
    const title = [...trail, s.title].join(' › ');
    for (const line of s.text.split('\n')) if (line.trim()) out.push({ text: line.trim(), section: title, sectionId: s.id });
    walk(s.children, [...trail, s.title]);
  });
  walk(monograph.sections, []);
  return out;
}

/** Trouve la (ou les) ligne(s) correspondant à une entrée de QUOTES. */
export function findQuote(lines, key, lang) {
  const q = QUOTES[key];
  const frag = q[lang];
  const hits = lines.filter(l => l.text.includes(frag));
  return q.all ? hits : hits.slice(0, 1);
}
