/* ZirkonIA Score: calcolo del punteggio (sezione 5) e attivazione degli asset (sezioni 7 e 8).
   Usa ZK_DATA (data.js). Copiato identico in Score.gs della Web App: se lo modifichi, ricopialo.
   answers: array di 12 interi da 0 a 3 (punti della risposta).
   profile (facoltativo): { size: chiave di ZK_DATA.sizes, sector: chiave di ZK_DATA.sectors }.
   Il profilo non cambia il punteggio: sposta il valore degli asset dentro la forbice e sceglie gli esempi. */
var ZK_SCORE = (function () {
  function compute(answers, profile) {
    var D = ZK_DATA;
    if (!answers || answers.length !== D.questions.length) throw new Error('Servono ' + D.questions.length + ' risposte');
    for (var i = 0; i < answers.length; i++) {
      var a = answers[i];
      if (typeof a !== 'number' || a % 1 !== 0 || a < 0 || a > 3) throw new Error('Risposta ' + (i + 1) + ' non valida');
    }

    var dims = [];
    var exact = 0;
    for (var d = 0; d < D.dimensions.length; d++) {
      var dim = D.dimensions[d];
      var raw = 0;
      for (var q = 0; q < dim.questions.length; q++) raw += answers[dim.questions[q]];
      var max = dim.questions.length * 3;
      exact += raw / max * dim.weight;
      /* recoverable: punti dello ZirkonIA Score che la dimensione può ancora dare (pesata), 1 decimale */
      dims.push({ key: dim.key, name: dim.name, raw: raw, max: max, score: Math.round(raw / max * 100),
        recoverable: Math.round((max - raw) / max * dim.weight * 10) / 10 });
    }

    var score = Math.round(exact);
    var p = D.potential;
    var potential = Math.min(p.cap, Math.max(p.floor, score + p.add));
    /* Con un punteggio oltre 90 la formula darebbe un potenziale più basso dell'attuale:
       in quel caso il potenziale coincide con l'attuale (gap 0). */
    if (potential < score) potential = score;

    var archetype = D.archetypes[0];
    for (var k = 0; k < D.archetypes.length; k++) {
      if (score >= D.archetypes[k].min && score <= D.archetypes[k].max) { archetype = D.archetypes[k]; break; }
    }

    /* posizione nella forbice di valore, in base alla dimensione dell'azienda */
    var pos = 0, sizeObj = null, sectorObj = null;
    if (profile) {
      for (var z = 0; z < (D.sizes || []).length; z++) if (D.sizes[z].key === profile.size) { sizeObj = D.sizes[z]; pos = sizeObj.t; }
      for (var y = 0; y < (D.sectors || []).length; y++) if (D.sectors[y].key === profile.sector) sectorObj = D.sectors[y];
    }
    var factor = sectorObj && typeof sectorObj.factor === 'number' ? sectorObj.factor : 1;
    /* valore dell'asset per questa azienda: dimensione, settore e quanto è scoperta la dimensione */
    function valueOf(asset, dimScore, idx) {
      if (typeof asset.low !== 'number' || typeof asset.high !== 'number') return asset.value;
      var base = asset.low + (asset.high - asset.low) * pos;
      var need = 0.9 + 0.2 * Math.max(0, Math.min(1, (D.assetThreshold - dimScore) / D.assetThreshold));
      var v = base * factor * need;
      v = Math.max(asset.low * 0.85, Math.min(asset.high * 1.1, v));
      v = Math.round(v / 50) * 50;
      if (v % 100 === 0) v += (idx % 2 ? -50 : 50); /* niente cifre tonde: 4.400 → 4.450, 2.900 → 2.850 */
      return v;
    }

    var assets = [];
    var assetsTotal = 0;
    for (var s = 0; s < D.assets.length; s++) {
      var asset = D.assets[s];
      for (var t = 0; t < dims.length; t++) {
        if (dims[t].key === asset.dim && dims[t].score < D.assetThreshold) {
          var v = valueOf(asset, dims[t].score, s);
          assets.push({ id: asset.id, dim: asset.dim, name: asset.name, value: v,
            example: sectorObj && sectorObj.ex ? sectorObj.ex[asset.id] || '' : '' });
          assetsTotal += v;
        }
      }
    }

    return {
      score: score,
      potential: potential,
      gap: potential - score,
      archetype: { name: archetype.name, subtitle: archetype.subtitle },
      dimensions: dims,
      assets: assets,
      assetsTotal: assetsTotal,
      profile: { size: sizeObj ? sizeObj.key : '', sizeLabel: sizeObj ? sizeObj.label : '',
        sector: sectorObj ? sectorObj.key : '', sectorLabel: sectorObj ? sectorObj.label : '', noun: sectorObj ? sectorObj.noun : 'la tua azienda' }
    };
  }

  /* 7000 -> "7.000" (senza dipendere da toLocaleString, assente o diverso in Apps Script). */
  function euro(n) {
    return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  return { compute: compute, euro: euro };
})();
