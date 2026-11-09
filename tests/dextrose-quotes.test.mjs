// Les passages de la monographie Dextrose cités dans le calculateur doivent exister (FR et EN).
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadMonograph } from '../build/content.mjs';
import { QUOTES, monographLines, findQuote, DEXTROSE_ID } from '../app/calc/dextrose-quotes.js';

for (const lang of ['fr', 'en']) {
  const m = loadMonograph(lang, DEXTROSE_ID);
  const lines = monographLines({ sections: m.sections });
  for (const key of Object.keys(QUOTES)) {
    test(`Monographie Dextrose (${lang}) : passage « ${key} » trouvé`, () => {
      const hits = findQuote(lines, key, lang);
      assert.ok(hits.length >= 1, `fragment introuvable : ${QUOTES[key][lang]}`);
      if (key === 'maintenance') assert.equal(hits.length, 2, 'dose pédiatrique et dose adulte');
    });
  }
}
