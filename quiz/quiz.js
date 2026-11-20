/* ZirkonIA Score: flusso del quiz (schermate 0-14), invio dei dati all'Apps Script, risultato.
   Dipende da data.js (ZK_DATA) e score.js (ZK_SCORE). Nessuna libreria esterna. */
(function () {
  'use strict';

  /* URL della Web App di Apps Script (Deploy → Web app). Finché è vuoto non si invia nulla. */
  var ENDPOINT = 'https://script.google.com/macros/s/AKfycbzniLWhuM-ki0hFU56EI53Zt3Xh0wuO7xdOm9n2SEBuJ13fV4ZqY8YkiqI3u1w7B4WO/exec';

  /* Prenotazione della consulenza: WhatsApp con un messaggio precompilato
     che riporta chi scrive, il livello (archetipo) e il punteggio. */
  var WHATSAPP = 'https://wa.me/393484925505';
  function bookingUrl(res, nome, azienda) {
    var chi = nome ? 'sono ' + nome + (azienda ? ' di ' + azienda : '') + '. ' : '';
    var livello = /^Livello/.test(res.archetype.name) ? 'sono a ' + res.archetype.name : 'il mio livello è ' + res.archetype.name;
    var testo = 'Buongiorno, ' + chi + 'Ho fatto lo ZirkonIA Score: ' + livello +
      ', con ' + res.score + ' punti su 100 e un potenziale di ' + res.potential +
      '. Vorrei prenotare la consulenza gratuita one-to-one.';
    return WHATSAPP + '?text=' + encodeURIComponent(testo);
  }

  /* Fonte del lead: «sito» di norma; per un evento si aggiunge ?src=nome all'indirizzo del QR
     (per esempio zirkonia.ai/quiz/?src=fiera-iknosys). Solo lettere, cifre e trattini. */
  var SOURCE = (function () {
    var m = /[?&]src=([a-z0-9-]{1,40})/i.exec(location.search);
    return m ? m[1].toLowerCase() : 'sito';
  })();

  var sent = false; /* un solo invio per pagina; i doppi invii tra pagine li blocca lo script */
  var D = ZK_DATA;
  var N = D.questions.length;
  var answers = new Array(N);  /* punti 0-3 di ogni risposta */
  var selected = new Array(N); /* posizione dell'opzione scelta (per ritrovarla con Indietro) */
  var unsure = new Array(N); /* true se la risposta è «non so / non riesco» (vale 0 punti) */
  var current = 0;
  var busy = false;

  var $ = function (id) { return document.getElementById(id); };
  var screens = document.querySelectorAll('.qz-screen');
  var dimNames = {};
  D.dimensions.forEach(function (d) { dimNames[d.key] = d.name; });

  function show(name, focusId) {
    for (var i = 0; i < screens.length; i++) {
      screens[i].classList.toggle('is-active', screens[i].getAttribute('data-screen') === name);
    }
    window.scrollTo(0, 0);
    if (focusId) { var el = $(focusId); if (el) el.focus({ preventScroll: true }); }
  }

  function renderQuestion() {
    var q = D.questions[current];
    $('qText').textContent = q.text;
    $('qCount').textContent = (current + 1) + ' / ' + N;
    $('qDim').textContent = dimNames[q.dim];
    var bar = document.querySelector('.qz-progress');
    bar.setAttribute('aria-valuenow', String(current));
    $('progressBar').style.width = (current / N * 100) + '%';

    var box = $('qOptions');
    box.innerHTML = '';
    q.options.forEach(function (label, idx) {
      box.appendChild(optionButton(label, !unsure[current] && selected[current] === idx, function () { return choose(idx, false); }, ''));
    });
    if (q.unsure) {
      box.appendChild(optionButton(q.unsure, !!unsure[current], function () { return choose(0, true); }, ' qz-opt-unsure'));
    }
  }

  function optionButton(label, pressed, onClick, extraClass) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'qz-opt' + extraClass;
    b.setAttribute('aria-pressed', pressed ? 'true' : 'false');
    var dot = document.createElement('span'); dot.className = 'dot'; dot.setAttribute('aria-hidden', 'true');
    var txt = document.createElement('span'); txt.textContent = label;
    b.appendChild(dot); b.appendChild(txt);
    b.addEventListener('click', function () { if (onClick()) b.setAttribute('aria-pressed', 'true'); });
    return b;
  }

  function transition(fn) {
    var box = $('questionBox');
    box.classList.add('is-leaving');
    setTimeout(function () {
      fn();
      box.classList.remove('is-leaving');
      box.classList.add('is-entering');
      setTimeout(function () { box.classList.remove('is-entering'); }, 30);
    }, 180);
  }

  function choose(idx, isUnsure) {
    if (busy) return false;
    busy = true;
    var q = D.questions[current];
    selected[current] = idx;
    answers[current] = isUnsure ? 0 : (q.points ? q.points[idx] : idx);
    unsure[current] = isUnsure;
    var opts = $('qOptions').children;
    for (var i = 0; i < opts.length; i++) opts[i].setAttribute('aria-pressed', 'false');
    $('progressBar').style.width = ((current + 1) / N * 100) + '%';
    setTimeout(function () {
      if (current < N - 1) {
        transition(function () { current++; renderQuestion(); $('qText').focus({ preventScroll: true }); busy = false; });
      } else {
        busy = false;
        showForm();
      }
    }, 240);
    return true;
  }

  function back() {
    if (busy) return;
    if (current === 0) { show('intro', 'intro-title'); return; }
    transition(function () { current--; renderQuestion(); $('qText').focus({ preventScroll: true }); });
  }

  /* ---------- form con anteprima del punteggio ---------- */
  var RING = 2 * Math.PI * 52;
  function showForm() {
    var res = ZK_SCORE.compute(answers);
    var locked = document.querySelectorAll('.qz-blur');
    locked[0].textContent = String(res.potential);
    locked[1].textContent = '€ ' + ZK_SCORE.euro(res.assetsTotal);
    var lvl = /^Livello/.test(res.archetype.name);
    document.querySelector('.qz-congrats-pre').textContent = lvl ? 'Complimenti, sei a' : 'Complimenti, il tuo livello è';
    $('congratsArch').textContent = res.archetype.name;
    $('congratsSub').textContent = res.archetype.subtitle;
    var now = $('ringNow'), pot = $('ringPot');
    [now, pot].forEach(function (c) { c.style.strokeDasharray = RING; c.style.strokeDashoffset = RING; });
    $('teaserScore').textContent = '0';
    document.querySelector('.qz-ring').setAttribute('aria-label', 'Il tuo punteggio oggi: ' + res.score + ' su 100');
    show('form', 'form-title');
    setTimeout(function () {
      now.style.strokeDashoffset = RING * (1 - res.score / 100);
      pot.style.strokeDashoffset = RING * (1 - res.potential / 100);
      countUp($('teaserScore'), res.score);
    }, 120);
  }

  /* ---------- form ---------- */
  function clean(v) { return String(v || '').replace(/\s+/g, ' ').trim(); }
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var PHONE_RE = /^\+?[0-9 .\-\/()]{6,20}$/;

  function validate(form) {
    var errs = [];
    var fields = form.querySelectorAll('input[required]');
    for (var i = 0; i < fields.length; i++) fields[i].removeAttribute('aria-invalid');
    function bad(name, msg) { form.elements[name].setAttribute('aria-invalid', 'true'); errs.push(msg); }
    if (!clean(form.nome.value)) bad('nome', 'il nome');
    if (!clean(form.azienda.value)) bad('azienda', 'l’azienda');
    if (!EMAIL_RE.test(clean(form.email.value))) bad('email', 'un’email valida');
    var digits = clean(form.cellulare.value).replace(/\D/g, '');
    if (!PHONE_RE.test(clean(form.cellulare.value)) || digits.length < 6) bad('cellulare', 'un numero di cellulare valido');
    if (!form.privacy.checked) bad('privacy', 'la conferma dell’informativa sulla privacy');
    return errs;
  }

  /* Invio robusto: fino a 3 tentativi (subito, dopo 2 e dopo 5 secondi), con keepalive
     perché la richiesta prosegua anche se il visitatore chiude la pagina.
     Con mode no-cors il browser segnala solo gli errori di rete, che sono il caso tipico in fiera. */
  var mailState = 'idle', lastPayload = null;
  var RETRY_DELAYS = [0, 2000, 5000];

  function send(payload) {
    if (!ENDPOINT) { if (window.console) console.warn('ZirkonIA Score: ENDPOINT non impostato, invio saltato.'); return; }
    if (sent) return;
    sent = true;
    lastPayload = payload;
    attempt(0);
  }

  function attempt(i) {
    setMail('sending');
    setTimeout(function () {
      var done = function () { setMail('ok'); };
      var fail = function () {
        if (i + 1 < RETRY_DELAYS.length) attempt(i + 1);
        else { sent = false; setMail('fail'); }
      };
      try {
        fetch(ENDPOINT, { method: 'POST', mode: 'no-cors', keepalive: true,
          headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(lastPayload) })
          .then(done, fail);
      } catch (e) { fail(); }
    }, RETRY_DELAYS[i]);
  }

  function retrySend() {
    if (!lastPayload || mailState === 'sending') return;
    sent = true;
    attempt(0);
  }

  function setMail(state) { mailState = state; renderMail(); }

  function renderMail() {
    var card = $('mailCard'); if (!card) return;
    var email = lastPayload ? lastPayload.email : '';
    var title = $('mailTitle'), text = $('mailText'), hint = $('mailHint'), retry = $('mailRetry');
    card.classList.toggle('qz-mail-warn', mailState === 'fail');
    retry.hidden = mailState !== 'fail';
    hint.hidden = mailState !== 'ok';
    if (mailState === 'sending') {
      title.textContent = 'Stiamo inviando il report…';
      text.textContent = 'Lo riceverai a ' + email + ' tra pochi istanti.';
    } else if (mailState === 'fail') {
      title.textContent = 'Il report non è ancora partito';
      text.textContent = 'La connessione sembra assente. Controlla la rete e premi «Riprova l’invio»: le tue risposte sono ancora qui.';
    } else {
      title.textContent = 'Controlla la tua email';
      text.textContent = 'Ti abbiamo inviato il report completo a ' + email + '.';
    }
  }

  function onSubmit(ev) {
    ev.preventDefault();
    var form = ev.target;
    var errs = validate(form);
    var errBox = $('formError');
    if (errs.length) {
      errBox.textContent = 'Per vedere il risultato servono ' + errs.join(', ') + '.';
      errBox.hidden = false;
      var first = form.querySelector('[aria-invalid="true"]');
      if (first) first.focus();
      return;
    }
    errBox.hidden = true;
    for (var i = 0; i < N; i++) if (typeof answers[i] !== 'number') { current = i; renderQuestion(); show('question', 'qText'); return; }

    var res = ZK_SCORE.compute(answers);
    var btn = $('submitBtn');
    btn.disabled = true;

    if (!clean(form.sito.value)) {
      send({
        nome: clean(form.nome.value),
        azienda: clean(form.azienda.value),
        email: clean(form.email.value),
        cellulare: clean(form.cellulare.value),
        privacy: true,
        answers: answers.slice(),
        unsure: unsure.map(function (u, i) { return u ? i + 1 : 0; }).filter(Boolean),
        score: res.score,
        potential: res.potential,
        archetype: res.archetype.name,
        source: SOURCE,
        ts: new Date().toISOString()
      });
    }
    showResult(res, clean(form.nome.value), clean(form.email.value), clean(form.azienda.value));
    btn.disabled = false;
  }

  /* ---------- risultato ---------- */
  /* Accenni del report: punto di forza, dimensione con più margine, asset. Il dettaglio è nell'email. */
  function renderHints(res) {
    var dims = res.dimensions;
    var best = dims.reduce(function (a, b) { return b.score > a.score ? b : a; });
    /* «Dove recuperi di più» = la dimensione che può dare più punti allo Score (tiene conto dei pesi) */
    var gain = dims.reduce(function (a, b) { return b.recoverable > a.recoverable ? b : a; });
    var items = [['Il tuo punto di forza', best.name, best.score, String(best.score)]];
    if (gain.recoverable > 0 && gain.key !== best.key) items.push(['Dove recuperi di più', gain.name, gain.score, '+' + Math.round(gain.recoverable)]);
    else if (gain.recoverable > 0) items = [['Dove recuperi di più', gain.name, gain.score, '+' + Math.round(gain.recoverable)]];
    var box = $('hints'); box.innerHTML = '';
    items.forEach(function (it) {
      var li = document.createElement('li');
      li.innerHTML = '<div><small></small><b></b></div><div class="qz-hint-bar"><i></i></div><span class="qz-hint-num"></span>';
      li.querySelector('small').textContent = it[0];
      li.querySelector('b').textContent = it[1];
      li.querySelector('.qz-hint-num').textContent = it[3];
      li.querySelector('i').style.width = it[2] + '%';
      box.appendChild(li);
    });
    var last = document.createElement('li'); last.className = 'qz-hint-assets';
    if (res.assets.length) {
      last.innerHTML = '<div><small>Asset che costruiresti con ZirkonIA</small><b></b></div><span class="qz-hint-value"></span>';
      last.querySelector('b').textContent = res.assets.length + ' asset · il dettaglio è nel report';
      last.querySelector('.qz-hint-value').textContent = '\u20ac ' + ZK_SCORE.euro(res.assetsTotal);
    } else {
      last.innerHTML = '<div><small>Asset</small><b>Tutte le dimensioni sono sopra 60: nel report trovi da dove ripartire.</b></div>';
    }
    box.appendChild(last);
  }

  function showResult(res, nome, email, azienda) {
    var first = (nome || '').split(' ')[0];
    var a = /^Livello/.test(res.archetype.name) ? 'sei a' : 'il tuo livello è';
    $('resHello').textContent = first ? first + ', ' + a : a.charAt(0).toUpperCase() + a.slice(1);
    $('result-title').textContent = res.archetype.name;
    $('archSub').textContent = res.archetype.subtitle;
    $('scoreNow').textContent = '0';
    $('scorePot').textContent = '0';
    $('scoreText').textContent = 'Il tuo punteggio oggi è ' + res.score + ' su 100; con ZirkonIA può arrivare a ' + res.potential + '.';
    $('gapText').innerHTML = res.gap > 0
      ? 'Insieme possiamo recuperare <strong>' + res.gap + ' punti</strong>.'
      : 'Sei già al tuo massimo: parliamone da colleghi.';
    renderHints(res);
    if (!lastPayload) lastPayload = { email: email };
    renderMail();
    $('mailTest').hidden = !!ENDPOINT;
    $('bookBtn').href = bookingUrl(res, nome, azienda);

    var now = $('barNow'), gap = $('barGap'), mkNow = $('mkNow'), mkPot = $('mkPot');
    now.style.width = '0'; gap.style.left = '0'; gap.style.width = '0'; mkNow.style.left = '0'; mkPot.style.left = '0';
    show('result', 'result-title');
    setTimeout(function () {
      now.style.width = res.score + '%';
      gap.style.left = res.score + '%';
      gap.style.width = res.gap + '%';
      separateMarkers(res);
      countUp($('scoreNow'), res.score);
      countUp($('scorePot'), res.potential);
    }, 60);
  }

  /* Se i due numeri sono vicini, li allontana quanto basta perché non si sovrappongano. */
  function separateMarkers(res) {
    var W = document.querySelector('.qz-scale-track').getBoundingClientRect().width || 300;
    var mkNow = $('mkNow'), mkPot = $('mkPot');
    var ha = mkNow.offsetWidth / 2, hb = mkPot.offsetWidth / 2, pad = 10;
    var a = Math.min(Math.max(res.score / 100 * W, ha), W - ha);
    var b = Math.min(Math.max(res.potential / 100 * W, hb), W - hb);
    if (b - a < ha + hb + pad) {
      b = Math.min(W - hb, a + ha + hb + pad);
      a = Math.max(ha, b - ha - hb - pad);
    }
    mkNow.style.left = a + 'px';
    mkPot.style.left = b + 'px';
  }

  function countUp(el, to) {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { el.textContent = String(to); return; }
    var start = null, dur = 900;
    function step(t) {
      if (start === null) start = t;
      var p = Math.min(1, (t - start) / dur);
      el.textContent = String(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
    setTimeout(function () { el.textContent = String(to); }, dur + 200); /* valore finale garantito */
  }

  /* ---------- privacy ---------- */
  var dlg = $('privacyDialog');
  $('privacyOpen').addEventListener('click', function () {
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
  });
  $('privacyClose').addEventListener('click', function () { if (dlg.close) dlg.close(); else dlg.removeAttribute('open'); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg && dlg.close) dlg.close(); });

  /* ---------- avvio ---------- */
  $('startBtn').addEventListener('click', function () { current = 0; renderQuestion(); show('question', 'qText'); });
  $('backBtn').addEventListener('click', back);
  $('formBackBtn').addEventListener('click', function () { current = N - 1; renderQuestion(); show('question', 'qText'); });
  $('leadForm').addEventListener('submit', onSubmit);
  $('mailRetry').addEventListener('click', retrySend);
})();
