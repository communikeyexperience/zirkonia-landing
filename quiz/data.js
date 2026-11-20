/* ZirkonIA Score: dati del quiz (domande, opzioni, pesi, archetipi, asset).
   Fonte: specifica «ZirkonIA Score — Quiz per la fiera», sezioni 3, 4, 6, 7, 8.
   Questo file è copiato identico in Data.gs della Web App: se lo modifichi, ricopialo.
   Le opzioni sono in ordine crescente: indice 0 = 0 punti, indice 3 = 3 punti.
   points: punti delle opzioni quando non coincidono con l'indice (domanda 5, cinque opzioni
   dal 2026-11-15 su richiesta di Cristiano: il second brain con AI vale 3).
   unsure: risposta «non so / non riesco», mostrata per ultima e valutata 0 punti
   (aggiunta su richiesta di Cristiano il 2026-11-15, non presente nella specifica).
   Domande 1, 2, 6, 8 e 11 riscritte e validate da Federico il 2026-11-20. */
var ZK_DATA = {
  dimensions: [
    { key: 'A', name: 'Memoria delle riunioni e delle decisioni', weight: 27, questions: [0, 1, 2] },
    { key: 'B', name: 'Accesso ai dati', weight: 27, questions: [3, 4, 5] },
    { key: 'C', name: 'Processi documentati', weight: 18, questions: [6, 7] },
    { key: 'D', name: 'Qualità delle decisioni', weight: 18, questions: [8, 9] },
    { key: 'E', name: 'Dipendenza dal titolare', weight: 10, questions: [10, 11] }
  ],

  questions: [
    { dim: 'A', text: 'Dopo una riunione con il tuo team, dove restano le informazioni e le decisioni prese?', options: [
      'Solo nella memoria di chi c’era',
      'In qualche appunto personale, su carta o sul telefono',
      'In un verbale o un riepilogo scritto, condiviso con chi c’era',
      'In un archivio con la registrazione trascritta, che posso rileggere o interrogare quando voglio'
    ] },
    { dim: 'A', text: 'Dove ritrovi oggi i documenti e il percorso di una decisione importante presa sei mesi fa?', options: [
      'Da nessuna parte: vado a memoria e ricostruisco a modo mio',
      'Nella memoria di chi c’era: chiedo e mettiamo insieme i pezzi',
      'Sparsi tra email, chat e cartelle: devo cercarli',
      'In un registro delle decisioni, con motivazioni, alternative e chi ha deciso'
    ], unsure: 'Non saprei: non teniamo traccia delle decisioni' },
    { dim: 'A', text: 'Le idee che ti vengono fuori dall’ufficio (in macchina, con un cliente, la sera) che fine fanno?', options: [
      'Per lo più si perdono',
      'Le scrivo in note sparse, poi le ritrovo ogni tanto',
      'Le annoto in un posto unico che riguardo periodicamente',
      'Le registro a voce e finiscono automaticamente nel mio archivio aziendale, collegate al resto'
    ] },
    { dim: 'B', text: 'Quanto ci metti a rispondere a una domanda tipo «quanto abbiamo speso per quel fornitore negli ultimi dodici mesi»?', options: [
      'Giorni, e devo chiedere al commercialista',
      'Qualche ora tra fatture e fogli di calcolo',
      'Pochi minuti, ho un gestionale o un foglio aggiornato',
      'Pochi secondi, lo chiedo al mio sistema e mi risponde'
    ], unsure: 'Non saprei da dove partire per trovarlo' },
    { dim: 'B', text: 'Dove vivono oggi le informazioni della tua azienda?', options: [
      'Nella mia testa e in quella di qualche collaboratore',
      'Sparse tra WhatsApp, email, Excel e cartelle varie',
      'In uno o due strumenti principali, abbastanza ordinati',
      'In un unico archivio collegato, dove tutto è ricercabile',
      'In un second brain con intelligenza artificiale, che collega tutto e risponde alle mie domande'
    ], points: [0, 1, 2, 2, 3], unsure: 'Non saprei dirlo con precisione' },
    { dim: 'B', text: 'Quando devi preparare un report sull’andamento dell’azienda per un socio, una banca o un bando, da dove prendi i dati?', options: [
      'Li ricostruisco ogni volta da zero, ed è sempre un’emergenza',
      'Li raccolgo da fonti diverse: mi costa almeno una giornata',
      'Da report che aggiorno regolarmente',
      'Da un unico sistema che mi dà quello che serve in pochi minuti'
    ], unsure: 'Non saprei: se ne occupa il commercialista' },
    { dim: 'C', text: 'Se domani assumi una persona nuova, come impara a lavorare come volete voi?', options: [
      'Guardando gli altri e facendo domande',
      'Con un affiancamento di qualche settimana',
      'Con un manuale o delle procedure scritte, anche se un po’ datate',
      'Con procedure aggiornate, consultabili e collegate agli esempi reali'
    ] },
    { dim: 'C', text: 'Il modo di lavorare della tua azienda (procedure, regole, standard di qualità) è scritto in un protocollo aziendale?', options: [
      'No, vive nella pratica quotidiana e nella testa delle persone',
      'In parte: qualche procedura scritta, il resto si tramanda a voce',
      'Sì, le procedure principali sono scritte e condivise',
      'Sì, in un protocollo aggiornato: ogni volta che miglioriamo qualcosa lo registriamo'
    ], unsure: 'Non saprei dirlo con certezza' },
    { dim: 'D', text: 'Quando devi prendere una decisione importante, su cosa ti basi soprattutto?', options: [
      'Istinto ed esperienza',
      'Istinto, più qualche numero che recupero al momento',
      'Dati che consulto regolarmente, più l’esperienza',
      'Dati, storico delle decisioni passate simili e confronto con il team'
    ] },
    { dim: 'D', text: 'Dopo una decisione importante, torni a verificare se ha funzionato?', options: [
      'Raramente, si va avanti',
      'Solo se qualcosa va storto',
      'Sì, in modo informale',
      'Sì, con un momento dedicato e con i numeri davanti'
    ] },
    { dim: 'E', text: 'Se per forza dovessi mancare due settimane, senza poter essere raggiunto, cosa succederebbe in azienda?', options: [
      'Si fermerebbe o andrebbe in seria difficoltà',
      'Andrebbe avanti sull’ordinario, ma tutto il resto aspetterebbe',
      'Andrebbe avanti bene, con qualche decisione rimandata',
      'Andrebbe avanti: il team troverebbe da solo le informazioni che servono'
    ], unsure: 'Non saprei: non è mai successo' },
    { dim: 'E', text: 'Quanto del valore della tua azienda è legato a ciò che sai solo tu?', options: [
      'Quasi tutto',
      'Molto',
      'Una parte, il resto è condiviso',
      'Poco: il sapere dell’azienda è dell’azienda, non mio'
    ], unsure: 'Non saprei quantificarlo' }
  ],

  /* Fasce: min e max inclusi. */
  archetypes: [
    { min: 0, max: 20, name: 'Challenge', subtitle: 'Insieme possiamo fare ancora tanto: la tua azienda ha davanti il percorso di crescita più ampio.' },
    { min: 21, max: 40, name: 'Discovery', subtitle: 'Le informazioni ci sono: performerai ancora di più quando saranno collegate tra loro.' },
    { min: 41, max: 60, name: 'Momentum', subtitle: 'Hai costruito ordine: sei nel punto in cui ogni passo in più accelera tutto il resto.' },
    { min: 61, max: 80, name: 'Insight', subtitle: 'Decidi già con i dati: insieme possiamo catturare anche ciò che si dice e si intuisce ogni giorno.' },
    { min: 81, max: 99, name: 'Mastery', subtitle: 'La tua azienda ha moltissimi dati: attendono solo di essere collegati attraverso un second brain.' },
    { min: 100, max: 100, name: 'Livello ZirkonIA', subtitle: 'Hai già un second brain con un registratore AI collegato: parliamo da colleghi.' }
  ],

  /* Asset attivati quando il punteggio della dimensione è sotto ASSET_THRESHOLD.
     low/high: forbice di valore di mercato annuo (specifica, sezione 8: DA VALIDARE).
     Il valore mostrato dipende da dimensione, settore e bisogno (vedi «Profilo» qui sotto e score.js).
     value = valore minimo, usato se il profilo manca. */
  assetThreshold: 60,
  assets: [
    { id: 'riunioni', dim: 'A', name: 'Archivio riunioni trascritto e interrogabile', value: 2000, low: 2000, high: 4000 },
    { id: 'decisioni', dim: 'A', name: 'Registro delle decisioni', value: 2000, low: 2000, high: 5000 },
    { id: 'cruscotto', dim: 'B', name: 'Cruscotto aziendale unico, interrogabile a voce', value: 3000, low: 3000, high: 9000 },
    { id: 'manuale', dim: 'C', name: 'Manuale operativo vivo (procedure collegate agli esempi reali)', value: 2500, low: 2500, high: 8000 },
    { id: 'storico', dim: 'D', name: 'Storico decisioni con verifica dei risultati', value: 2000, low: 2000, high: 5000 },
    { id: 'protocollo', dim: 'E', name: 'Protocollo aziendale: il profilo strutturato di persona e impresa, trasferibile', value: 3000, low: 3000, high: 6000 }
  ],

  /* Profilo (aggiunto il 2026-11-20 su richiesta di Federico): due domande all'inizio,
     non cambiano il punteggio. Valore di ogni asset (score.js):
     forbice low–high secondo la dimensione (t) × correttivo del settore (factor, DA VALIDARE)
     × bisogno della dimensione (più è scoperta, più vale: da ×0,9 a ×1,1),
     arrotondato a 50 € evitando le cifre tonde. Il settore sceglie anche gli esempi. */
  sizes: [
    { key: 'solo', label: 'Solo io', t: 0 },
    { key: '2-5', label: '2–5 persone', t: 0.15 },
    { key: '6-15', label: '6–15 persone', t: 0.35 },
    { key: '16-50', label: '16–50 persone', t: 0.6 },
    { key: '51-250', label: '51–250 persone', t: 0.85 },
    { key: '250+', label: 'Oltre 250 persone', t: 1 }
  ],
  sectors: [
    { key: 'ristorazione', factor: 0.95, label: 'Ristorazione e bar', noun: 'il tuo locale', ex: {
      riunioni: 'briefing di sala e cucina, accordi con i fornitori',
      decisioni: 'perché hai cambiato menu, prezzi o fornitore',
      cruscotto: 'food cost, coperti e spesa per fornitore in pochi secondi',
      manuale: 'ricette, procedure di sala, apertura e chiusura',
      storico: 'promozioni ed eventi: cosa ha funzionato davvero',
      protocollo: 'il locale trasferibile a un socio, a un erede o a una seconda sede' } },
    { key: 'benessere', factor: 0.9, label: 'Parrucchieri, estetica e benessere', noun: 'il tuo salone', ex: {
      riunioni: 'riunioni di staff e appunti sui clienti',
      decisioni: 'scelte su listino, prodotti e orari',
      cruscotto: 'incassi per servizio, prodotti venduti, clienti che tornano',
      manuale: 'protocolli di trattamento, accoglienza, vendita dei prodotti',
      storico: 'campagne e novità: cosa ha riempito l’agenda',
      protocollo: 'il metodo del salone trasferibile a un collaboratore o a un nuovo punto' } },
    { key: 'commercio', factor: 0.95, label: 'Commercio e negozi', noun: 'il tuo negozio', ex: {
      riunioni: 'incontri con fornitori e rappresentanti',
      decisioni: 'perché hai scelto un marchio, un prezzo, una vetrina',
      cruscotto: 'venduto, giacenze e margini per prodotto',
      manuale: 'cassa, ordini, resi e assistenza ai clienti',
      storico: 'saldi e promozioni a confronto, anno su anno',
      protocollo: 'il negozio trasferibile a un erede o a un nuovo responsabile' } },
    { key: 'artigianato', factor: 0.9, label: 'Artigianato e laboratori', noun: 'la tua bottega', ex: {
      riunioni: 'accordi con clienti e fornitori',
      decisioni: 'preventivi, materiali e tempi scelti',
      cruscotto: 'commesse, ore e materiali per lavoro',
      manuale: 'lavorazioni, tolleranze e trucchi del mestiere',
      storico: 'preventivi vinti e persi, e perché',
      protocollo: 'il saper fare della bottega trasferibile a un apprendista' } },
    { key: 'industria', factor: 1.15, label: 'Industria e produzione', noun: 'la tua azienda', ex: {
      riunioni: 'riunioni di produzione, qualità e commerciali',
      decisioni: 'investimenti, fornitori e scelte di processo',
      cruscotto: 'produzione, scarti, ordini e marginalità per commessa',
      manuale: 'istruzioni operative, sicurezza e qualità',
      storico: 'investimenti e cambi di processo misurati sui risultati',
      protocollo: 'il know-how di processo trasferibile, anche nel passaggio generazionale' } },
    { key: 'edilizia', factor: 1.1, label: 'Edilizia e immobiliare', noun: 'la tua impresa', ex: {
      riunioni: 'riunioni di cantiere e con i committenti',
      decisioni: 'varianti, subappalti e scelte tecniche',
      cruscotto: 'costi per cantiere, stati di avanzamento e scadenze',
      manuale: 'procedure di cantiere, sicurezza, consegna dei lavori',
      storico: 'cantieri chiusi: tempi e costi previsti contro reali',
      protocollo: 'il modo di lavorare dell’impresa trasferibile a capocantiere e soci' } },
    { key: 'turismo', factor: 1.05, label: 'Turismo e ospitalità', noun: 'la tua struttura', ex: {
      riunioni: 'briefing di reparto e incontri con i partner',
      decisioni: 'tariffe, canali di vendita e servizi',
      cruscotto: 'occupazione, prezzo medio e recensioni per periodo',
      manuale: 'check-in, pulizie, gestione dei reclami',
      storico: 'stagioni a confronto: tariffe e campagne',
      protocollo: 'la struttura trasferibile a un direttore o a un nuovo gestore' } },
    { key: 'salute', factor: 1.1, label: 'Studi medici e sanità', noun: 'il tuo studio', ex: {
      riunioni: 'riunioni d’équipe e con i fornitori',
      decisioni: 'acquisti di attrezzature e organizzazione delle agende',
      cruscotto: 'prestazioni, agende e incassi per professionista',
      manuale: 'accoglienza, sterilizzazione, protocolli di segreteria',
      storico: 'nuovi servizi e attrezzature: la resa nel tempo',
      protocollo: 'lo studio trasferibile a un socio o a un nuovo direttore' } },
    { key: 'professioni', factor: 1.05, label: 'Studi professionali e consulenza', noun: 'il tuo studio', ex: {
      riunioni: 'call con i clienti e riunioni di studio',
      decisioni: 'pareri, strategie e scelte sui clienti',
      cruscotto: 'pratiche, ore e fatturato per cliente',
      manuale: 'procedure di studio e modelli di lavoro',
      storico: 'strategie proposte e risultati ottenuti',
      protocollo: 'il metodo dello studio trasferibile a collaboratori e soci' } },
    { key: 'servizi', factor: 1.0, label: 'Servizi alle imprese e digitale', noun: 'la tua azienda', ex: {
      riunioni: 'call con clienti e team, anche da remoto',
      decisioni: 'scelte su offerta, prezzi e priorità',
      cruscotto: 'progetti, ore e marginalità per cliente',
      manuale: 'processi di consegna e avvio dei nuovi clienti',
      storico: 'progetti chiusi: stime contro realtà',
      protocollo: 'il metodo dell’azienda trasferibile a nuovi responsabili' } },
    { key: 'altro', factor: 1.0, label: 'Altro', noun: 'la tua azienda', ex: {
      riunioni: 'riunioni e call di lavoro',
      decisioni: 'le scelte importanti e il loro perché',
      cruscotto: 'i numeri chiave della tua attività',
      manuale: 'le procedure che oggi sono nella tua testa',
      storico: 'le decisioni passate misurate sui risultati',
      protocollo: 'la tua azienda trasferibile a un socio o a un erede' } }
  ],

  potential: { add: 45, floor: 85, cap: 90 }
};
