/* ZirkonIA Score: dati del quiz (domande, opzioni, pesi, archetipi, asset).
   Fonte: specifica «ZirkonIA Score — Quiz per la fiera», sezioni 3, 4, 6, 7, 8.
   Questo file è copiato identico in apps-script/Data.gs: se lo modifichi, ricopialo.
   Le opzioni sono in ordine crescente: indice 0 = 0 punti, indice 3 = 3 punti.
   points: punti delle opzioni quando non coincidono con l'indice (domanda 5, cinque opzioni
   dal 2026-11-15 su richiesta di Cristiano: il second brain con AI vale 3).
   unsure: risposta «non so / non riesco», mostrata per ultima e valutata 0 punti
   (aggiunta su richiesta di Cristiano il 2026-11-15, non presente nella specifica). */
var ZK_DATA = {
  dimensions: [
    { key: 'A', name: 'Memoria delle riunioni e delle decisioni', weight: 27, questions: [0, 1, 2] },
    { key: 'B', name: 'Accesso ai dati', weight: 27, questions: [3, 4, 5] },
    { key: 'C', name: 'Processi documentati', weight: 18, questions: [6, 7] },
    { key: 'D', name: 'Qualità delle decisioni', weight: 18, questions: [8, 9] },
    { key: 'E', name: 'Dipendenza dal titolare', weight: 10, questions: [10, 11] }
  ],

  questions: [
    { dim: 'A', text: 'Quando fai una riunione con il tuo team, cosa resta alla fine?', options: [
      'Niente di scritto: ci ricordiamo quello che possiamo',
      'Qualche appunto personale su carta o sul telefono',
      'Un verbale o un riepilogo scritto, condiviso con chi c’era',
      'Una registrazione trascritta e archiviata, che posso rileggere o interrogare quando voglio'
    ] },
    { dim: 'A', text: 'Come ritrovi oggi le motivazioni di una decisione importante presa sei mesi fa?', options: [
      'Vado a memoria, e probabilmente ricostruisco a modo mio',
      'Chiedo a chi c’era e mettiamo insieme i pezzi',
      'Cerco tra email, chat e documenti sparsi',
      'Apro il registro delle decisioni e trovo motivazioni, alternative e chi ha deciso'
    ], unsure: 'Mi viene difficile ricostruire il percorso' },
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
    { dim: 'B', text: 'Quando devi preparare un numero per una banca, un socio o un bando, come va?', options: [
      'È sempre un’emergenza',
      'Ce la faccio ma mi costa una giornata',
      'Ho report pronti che aggiorno',
      'Estraggo quello che serve in pochi minuti, in qualunque momento'
    ], unsure: 'Non saprei: se ne occupa il commercialista' },
    { dim: 'C', text: 'Se domani assumi una persona nuova, come impara a lavorare come volete voi?', options: [
      'Guardando gli altri e facendo domande',
      'Con un affiancamento di qualche settimana',
      'Con un manuale o delle procedure scritte, anche se un po’ datate',
      'Con procedure aggiornate, consultabili e collegate agli esempi reali'
    ] },
    { dim: 'C', text: 'Le cose che funzionano bene nella tua azienda (il modo di servire un cliente, di fare un preventivo, di gestire un reclamo) sono scritte da qualche parte?', options: [
      'No, sono nella pratica quotidiana',
      'Alcune sì, la maggior parte no',
      'Le principali sono scritte e condivise',
      'Sono scritte, aggiornate e ogni volta che miglioriamo qualcosa lo registriamo'
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
    { dim: 'E', text: 'Se stai fuori due settimane senza telefono, cosa succede in azienda?', options: [
      'Si ferma o va in difficoltà seria',
      'Va avanti sull’ordinario, ma tutto il resto aspetta',
      'Va avanti bene, con qualche decisione rimandata',
      'Va avanti e il team trova quello che serve nei nostri archivi'
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
     Valori della sezione 8: DA VALIDARE prima della fiera (si mostra il valore basso). */
  assetThreshold: 60,
  assets: [
    { dim: 'A', name: 'Archivio riunioni trascritto e interrogabile', value: 2000 },
    { dim: 'A', name: 'Registro delle decisioni', value: 2000 },
    { dim: 'B', name: 'Cruscotto aziendale unico, interrogabile a voce', value: 3000 },
    { dim: 'C', name: 'Manuale operativo vivo (procedure collegate agli esempi reali)', value: 2500 },
    { dim: 'D', name: 'Storico decisioni con verifica dei risultati', value: 2000 },
    { dim: 'E', name: 'Protocollo aziendale: il profilo strutturato di persona e impresa, trasferibile', value: 3000 }
  ],

  potential: { add: 45, floor: 85, cap: 90 }
};
