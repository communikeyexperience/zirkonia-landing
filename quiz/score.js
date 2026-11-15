/* ZirkonIA Score: calcolo del punteggio (sezione 5) e attivazione degli asset (sezioni 7 e 8).
   Usa ZK_DATA (data.js). Copiato identico in apps-script/Score.gs: se lo modifichi, ricopialo.
   answers: array di 12 interi da 0 a 3 (punti della risposta). */
var ZK_SCORE = (function () {
  function compute(answers) {
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

    var assets = [];
    var assetsTotal = 0;
    for (var s = 0; s < D.assets.length; s++) {
      var asset = D.assets[s];
      for (var t = 0; t < dims.length; t++) {
        if (dims[t].key === asset.dim && dims[t].score < D.assetThreshold) {
          assets.push({ dim: asset.dim, name: asset.name, value: asset.value });
          assetsTotal += asset.value;
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
      assetsTotal: assetsTotal
    };
  }

  /* 7000 -> "7.000" (senza dipendere da toLocaleString, assente o diverso in Apps Script). */
  function euro(n) {
    return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  return { compute: compute, euro: euro };
})();
