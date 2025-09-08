const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('genshin.db', (err) => {
    if (err) {
        console.error("Errore durante l'apertura del database:", err.message);
    } else {
        console.log("Connessione al database SQLite stabilita.");
    }
});

db.serialize(() => {

    db.run(`
        PRAGMA foreign_keys = ON;
    `, (err) => {
        if (err) console.error("Errore durante la creazione della tabella utenti:", err.message);
    });

    db.run(`
        CREATE TABLE IF NOT EXISTS utenti (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            mail TEXT UNIQUE,
            username TEXT UNIQUE,
            password TEXT NOT NULL,
            ruolo TEXT DEFAULT 'utente',
            avatar INTEGER DEFAULT 1
        );
    `, (err) => {
        if (err) console.error("Errore durante la creazione della tabella utenti:", err.message);
    });

    db.run(`
        CREATE TABLE IF NOT EXISTS avatar (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            immagine TEXT NOT NULL
        );
    `, (err) => {
        if (err) console.error("Errore durante la creazione della tabella avatar:", err.message);
    });

    db.run(`
        CREATE TABLE IF NOT EXISTS personaggi (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            immagine TEXT NOT NULL,
            elemento TEXT NOT NULL,
            tipo TEXT NOT NULL,
            rarità TINYINT NOT NULL,
            descrizione TEXT NOT NULL
        );
    `, (err) => {
        if (err) console.error("Errore durante la creazione della tabella utenti:", err.message);
    });

    db.run(`
        CREATE TABLE IF NOT EXISTS artefatti (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            immagine TEXT NOT NULL,
            categoria TEXT NOT NULL,
            descrizione TEXT NOT NULL,
            effetto_duepezzi TEXT NOT NULL,
            effetto_4pezzi TEXT NOT NULL
        );
    `, (err) => {
        if (err) console.error("Errore durante la creazione della tabella artefatti:", err.message);
    });

    db.run(`
        CREATE TABLE IF NOT EXISTS set_artefatti (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_utente INTEGER,
            nome_set TEXT NOT NULL,
            descrizione TEXT,
            fiore INTEGER,
            piuma INTEGER,
            clessidra INTEGER,
            corona INTEGER,
            coppa INTEGER,
            FOREIGN KEY(fiore) REFERENCES artefatti(id) ON DELETE CASCADE ON UPDATE CASCADE,
            FOREIGN KEY(piuma) REFERENCES artefatti(id) ON DELETE CASCADE ON UPDATE CASCADE,
            FOREIGN KEY(clessidra) REFERENCES artefatti(id) ON DELETE CASCADE ON UPDATE CASCADE,
            FOREIGN KEY(coppa) REFERENCES artefatti(id) ON DELETE CASCADE ON UPDATE CASCADE,
            FOREIGN KEY(corona) REFERENCES artefatti(id) ON DELETE CASCADE ON UPDATE CASCADE,
            FOREIGN KEY(id_utente) REFERENCES utenti(id) ON DELETE CASCADE ON UPDATE CASCADE

        );
    `, (err) => {
        if (err) console.error("Errore durante la creazione della tabella set_artefatti:", err.message);
    });

    db.run(`
        CREATE TABLE IF NOT EXISTS build (

            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_utente INTEGER,
            arma INTEGER NOT NULL,
            personaggio INTEGER NOT NULL,
            id_set INTEGER NOT NULL,
            pubblico INTEGER DEFAULT 0,
            FOREIGN KEY(personaggio) REFERENCES personaggi(id) ON DELETE CASCADE ON UPDATE CASCADE,
            FOREIGN KEY(id_set) REFERENCES set_artefatti(id) ON DELETE CASCADE ON UPDATE CASCADE,
            FOREIGN KEY(arma) REFERENCES armi(id) ON DELETE CASCADE ON UPDATE CASCADE,
            FOREIGN KEY(id_utente) REFERENCES utenti(id) ON DELETE CASCADE ON UPDATE CASCADE
        );
    `, (err) => {
        if (err) console.error("Errore durante la creazione della tabella build:", err.message);
    });

    db.run(`
        CREATE TABLE IF NOT EXISTS armi (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome_arma TEXT NOT NULL,
            immagine TEXT NOT NULL,
            tipo_arma TEXT NOT NULL,
            rarità TINYINT NOT NULL,
            statistica_principale_armi TEXT NOT NULL,
            effetto_armi TEXT NOT NULL
        );
    `, (err) => {
        if (err) console.error("Errore durante la creazione della tabella build:", err.message);
    });

    db.run(`
        CREATE TABLE IF NOT EXISTS statistiche (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            personaggio INTEGER NOT NULL,
            duepezzi TEXT NOT NULL,
            quattropezzi TEXT NOT NULL,
            priorità_fiore TEXT NOT NULL,
            priorità_piuma TEXT NOT NULL,
            priorità_coppa TEXT NOT NULL,
            priorità_calice TEXT NOT NULL,
            priorità_corona TEXT NOT NULL,
            priorità_statistiche TEXT NOT NULL,
            FOREIGN KEY(personaggio) REFERENCES personaggi(id) ON DELETE CASCADE ON UPDATE CASCADE
        );
    `, (err) => {
        if (err) console.error("Errore durante la creazione della tabella statistiche:", err.message);
    });


    db.run(`

        CREATE TABLE IF NOT EXISTS preferiti(
            
            like_utente INTEGER NOT NULL,
            like_build INTEGER NOT NULL,
            FOREIGN KEY(like_utente) REFERENCES utenti(id) ON DELETE CASCADE ON UPDATE CASCADE,
            FOREIGN KEY(like_build) REFERENCES build(id) ON DELETE CASCADE ON UPDATE CASCADE

        );
    `, (err) => {
        if (err) console.error("Errore durante la creazione della tabella preferiti:", err.message);
    });

    db.run('INSERT INTO utenti (username, mail, password) VALUES (?, ?, ?)', ['utente1', 'utente1@mail.com', 'password1']);
    db.run('INSERT INTO utenti (username, mail, password) VALUES (?, ?, ?)', ['utente2', 'utente2@mail.com', 'password2']);
    db.run('INSERT INTO utenti (username, mail, password) VALUES (?, ?, ?)', ['utente3', 'utente3@mail.com', 'password3']);
    db.run('INSERT INTO utenti (username, mail, password) VALUES (?, ?, ?)', ['utente4', 'utente4@mail.com', 'password4']);
    db.run('INSERT INTO utenti (username, mail, password) VALUES (?, ?, ?)', ['utente5', 'utente5@mail.com', 'password5']);

    db.run(`

       INSERT INTO "armi" ("id", "nome_arma", "immagine", "tipo_arma", "rarità", "statistica_principale_armi", "effetto_armi") VALUES
        (1, 'gravestone', '/images/armi/gravestone.png', 'spadone', 5, 'ATK%', 'Aumenta l''ATK del 20%. Quando colpisci un nemico con meno del 50% di HP, aumenta l''ATK del 40% per 12s.'),
        (2, 'great_magic', '/images/armi/great-magic.png', 'arco', 5, 'CRIT Rate', 'Aumenta il CRIT Rate del 15%. I colpi caricati aumentano il DMG del 20% per 10s.'),
        (3, 'alley_flash', '/images/armi/alley-flash.png', 'spada', 4, 'Elemental Mastery', 'Aumenta il DMG inflitto del 12%. Subire danni disattiva l''effetto per 5s.'),
        (4, 'skyward_harp', '/images/armi/skyward-harp.png', 'arco', 5, 'CRIT Rate', 'Aumenta il CRIT DMG del 20%. Gli attacchi hanno una probabilità del 60% di infliggere un piccolo attacco AoE che infligge il 125% di ATK DMG.'),
        (5, 'primordial_jade_cutter', '/images/armi/primordial-jade-cutter.png', 'spada', 5, 'CRIT Rate', 'Aumenta l''HP del 20%. Fornisce un bonus ATK basato sull''1.2% dell''HP massimo del portatore.'),
        (6, 'amos_bow', '/images/armi/amos-bow.png', 'arco', 5, 'ATK%', 'Aumenta il DMG degli attacchi normali e caricati del 12%. Dopo ogni 0.1s, il DMG aumenta di un ulteriore 8%, fino a 5 volte.'),
        (7, 'the_flute', '/images/armi/the-flute.png', 'spada', 4, 'ATK%', 'Gli attacchi normali e caricati accumulano un''armonia. Al raggiungimento di 5 armonie, infligge il 100% di ATK DMG ai nemici vicini.'),
        (8, 'sacrificial_sword', '/images/armi/sacrificial-sword.png', 'spada', 4, 'Energy Recharge', 'Dopo aver colpito un nemico con un''abilità elementale, c''è una probabilità del 40% di azzerare il suo cooldown. Può verificarsi una volta ogni 30s.'),
        (9, 'favonius_lance', '/images/armi/favonius-lance.png', 'lancia', 4, 'Energy Recharge', 'I colpi critici hanno una probabilità del 60% di generare particelle elementali che rigenerano 6 energia. Può verificarsi una volta ogni 12s.'),
        (10, 'the_widsith', '/images/armi/the-widsith.png', 'catalizzatore', 4, 'CRIT DMG', 'Quando il personaggio entra in campo, ottiene un tema casuale che aumenta ATK, Elemental DMG o Elemental Mastery per 10s.'),
        (11, 'rust', '/images/armi/rust.png', 'arco', 4, 'ATK%', 'Aumenta il DMG degli attacchi normali del 40%, ma riduce il DMG degli attacchi caricati del 10%.'),
        (12, 'blackcliff_pole', '/images/armi/blackcliff-pole.png', 'lancia', 4, 'CRIT DMG', 'Dopo aver sconfitto un nemico, aumenta l''ATK del 12% per 30s. Max 3 stack.'),
        (13, 'deathmatch', '/images/armi/deathmatch.png', 'lancia', 4, 'CRIT Rate', 'Se ci sono almeno 2 nemici vicini, aumenta ATK e DEF del 16%. Se ci sono meno di 2 nemici, aumenta l''ATK del 24%.'),
        (14, 'lost_prayer', '/images/armi/lost-prayer-to-the-sacred-winds.png', 'catalizzatore', 5, 'CRIT Rate', 'Aumenta la velocità di movimento del 10%. Durante il combattimento, aumenta il DMG elementale del 8% ogni 4s. Max 4 stack.'),
        (15, 'skyward_blade', '/images/armi/skyward-blade.png', 'spada', 5, 'Energy Recharge', 'Aumenta il CRIT Rate del 4%. Usare uno Scoppio Elementale aumenta la velocità di movimento e di attacco del 10% e aumenta il DMG degli attacchi normali e caricati del 20% per 12s.'),
        (16, 'aquila_favonia', '/images/armi/aquila-favonia.png', 'spada', 5, 'Physical DMG Bonus', 'Aumenta l''ATK del 20%. Quando subisci danni, l''anima del falco si risveglia, rigenerando HP pari al 100% dell''ATK e infliggendo il 200% di ATK DMG ai nemici vicini.'),
        (17, 'mistsplitter_reforged', '/images/armi/mistsplitter-reforged.png', 'spada', 5, 'CRIT DMG', 'Ottieni un bonus DMG elementale del 12% per tutti gli elementi e guadagni il potere del Mistsplitter''s Emblem.'),
        (18, 'staff_of_homa', '/images/armi/staff-of-homa.png', 'lancia', 5, 'CRIT DMG', 'Aumenta l''HP del 20%. Fornisce un bonus ATK basato sullo 0.8% dell''HP massimo del portatore. Quando l''HP è inferiore al 50%, il bonus ATK aumenta di un ulteriore 1%.'),
        (19, 'vortex_vanquisher', '/images/armi/vortex-vanquisher.png', 'lancia', 5, 'ATK%', 'Aumenta la Forza dello Scudo del 20%. Colpire i nemici aumenta l''ATK del 4% per 8s. Max 5 stack.'),
        (20, 'elegy_for_the_end', '/images/armi/elegy-for-the-end.png', 'arco', 5, 'Energy Recharge', 'Aumenta la Maestria Elementale di 60. Quando lanci un''abilità elementale o uno scoppio, ottieni un Sigillo di Ricordo.'),
        (21, 'polar_star', '/images/armi/polar-star.png', 'arco', 5, 'CRIT Rate', 'Aumenta il DMG delle abilità elementali e degli scoppi del 12%.'),
        (22, 'thundering_pulse', '/images/armi/thundering-pulse.png', 'arco', 5, 'CRIT DMG', 'Aumenta l''ATK del 20% e fornisce un bonus DMG agli attacchi normali.'),
        (23, 'aqua_simulacra', '/images/armi/aqua-simulacra.png', 'arco', 5, 'CRIT DMG', 'Aumenta l''HP del 16% e fornisce un bonus DMG quando ci sono nemici vicini.'),
        (24, 'haran_geppaku_futsu', '/images/armi/haran-geppaku-futsu.png', 'spada', 5, 'CRIT Rate', 'Aumenta il DMG degli attacchi normali basato sul numero di membri del party con lo stesso elemento.'),
        (25, 'freedom_sworn', '/images/armi/freedom-sworn.png', 'spada', 5, 'Elemental Mastery', 'Aumenta il DMG del 10%. Attivare una reazione elementale aumenta l''ATK di tutti i membri del party.'),
        (26, 'summit_shaper', '/images/armi/summit-shaper.png', 'spada', 5, 'ATK%', 'Aumenta la Forza dello Scudo del 20%. Colpire i nemici aumenta l''ATK del 4% per 8s. Max 5 stack.'),
        (27, 'the_unforged', '/images/armi/the-unforged.png', 'spadone', 5, 'ATK%', 'Aumenta la Forza dello Scudo del 20%. Colpire i nemici aumenta l''ATK del 4% per 8s. Max 5 stack.'),
        (28, 'redhorn_stonethresher', '/images/armi/redhorn-stonethresher.png', 'spadone', 5, 'CRIT DMG', 'Aumenta la DEF del 28%. Fornisce un bonus DMG agli attacchi normali e caricati basato sulla DEF.'),
        (29, 'engulfing_lightning', '/images/armi/engulfing-lightning.png', 'lancia', 5, 'Energy Recharge', 'Aumenta l''ATK del 28% della Ricarica Energia sopra il 100%.'),
        (30, 'calamity_queller', '/images/armi/calamity-queller.png', 'lancia', 5, 'ATK%', 'Aumenta il DMG elementale del 12%. Dopo aver usato un''abilità elementale, aumenta l''ATK del 3.2% ogni secondo per 12s.'),
        (31, 'everlasting_moonglow', '/images/armi/everlasting-moonglow.png', 'catalizzatore', 5, 'HP%', 'Aumenta la guarigione del 10%. Gli attacchi normali infliggono un bonus DMG basato sul 1% dell''HP massimo.'),
        (32, 'kagura_verity', '/images/armi/kaguras-verity.png', 'catalizzatore', 5, 'CRIT DMG', 'Aumenta il DMG delle abilità elementali del 12%.'),
        (33, 'memory_of_dust', '/images/armi/memory-of-dust.png', 'catalizzatore', 5, 'ATK%', 'Aumenta la Forza dello Scudo del 20%. Colpire i nemici aumenta l''ATK del 4% per 8s. Max 5 stack.'),
        (34, 'favonius_warbow', '/images/armi/favonius-warbow.png', 'arco', 4, 'Energy Recharge', 'I colpi critici hanno una probabilità del 60% di generare particelle elementali che rigenerano 6 energia. Può verificarsi una volta ogni 12s.'),
        (35, 'sacrificial_bow', '/images/armi/sacrificial-bow.png', 'arco', 4, 'Energy Recharge', 'Dopo aver colpito un nemico con un''abilità elementale, c''è una probabilità del 40% di azzerare il suo cooldown. Può verificarsi una volta ogni 30s.'),
        (36, 'the_stringless', '/images/armi/the-stringless.png', 'arco', 4, 'Elemental Mastery', 'Aumenta il DMG delle abilità elementali e degli scoppi del 24%.'),
        (37, 'windblume_ode', '/images/armi/windblume-ode.png', 'arco', 4, 'Elemental Mastery', 'Usare un''abilità elementale aumenta l''ATK del 16% per 6s.'),
        (38, 'prototype_crescent', '/images/armi/prototype-crescent.png', 'arco', 4, 'ATK%', 'Colpire un punto debole aumenta la velocità di movimento del 10% e l''ATK del 36% per 10s.'),
        (39, 'iron_sting', '/images/armi/iron-sting.png', 'spada', 4, 'Elemental Mastery', 'Infliggere DMG elementale aumenta il DMG totale del 6% per 6s. Max 2 stack.'),
        (40, 'blackcliff_long_sword', '/images/armi/blackcliff-longsword.png', 'spada', 4, 'CRIT DMG', 'Dopo aver sconfitto un nemico, aumenta l''ATK del 12% per 30s. Max 3 stack.'),
        (41, 'prototype_rancour', '/images/armi/prototype-rancour.png', 'spada', 4, 'Physical DMG Bonus', 'Colpire i nemici aumenta l''ATK e la DEF del 4% per 6s. Max 4 stack.'),
        (42, 'royal_greatsword', '/images/armi/royal-greatsword.png', 'spadone', 4, 'ATK%', 'Ogni colpo aumenta il CRIT Rate del 8%. Max 5 stack.'),
        (43, 'whiteblind', '/images/armi/whiteblind.png', 'spadone', 4, 'DEF%', 'Colpire i nemici aumenta l''ATK e la DEF del 6% per 6s. Max 4 stack.'),
        (44, 'dragonspine_spear', '/images/armi/dragonspine-spear.png', 'lancia', 4, 'Physical DMG Bonus', 'Colpire i nemici ha una probabilità del 60% di infliggere un AoE Cryo DMG.'),
        (45, 'kitain_cross_spear', '/images/armi/kitain-cross-spear.png', 'lancia', 4, 'Elemental Mastery', 'Aumenta il DMG delle abilità elementali del 6%.'),
        (46, 'wavebreaker_fin', '/images/armi/wavebreakers-fin.png', 'lancia', 4, 'ATK%', 'Aumenta il DMG dello scoppio elementale basato sull''energia totale del party.'),
        (47, 'hakushin_ring', '/images/armi/hakushin-ring.png', 'catalizzatore', 4, 'Energy Recharge', 'Attivare una reazione elementale aumenta il DMG elementale dei membri del party.'),
        (48, 'solar_pearl', '/images/armi/solar-pearl.png', 'catalizzatore', 4, 'CRIT Rate', 'Gli attacchi normali aumentano il DMG delle abilità elementali e degli scoppi del 20% per 6s.'),
        (49, 'dodoco_tales', '/images/armi/dodoco-tales.png', 'catalizzatore', 4, 'ATK%', 'Gli attacchi normali aumentano il DMG degli attacchi caricati del 16% per 6s.');

    `, (err) => {
        if (err) console.error("Errore durante la popolazione della tabella armi:", err.message);
    });

    db.run(`

      INSERT INTO "avatar" ("id", "immagine") VALUES
        (1, 'images/emotes/ayaka_icon.png'),
        (2, 'images/emotes/kokomi_icon.png'),
        (3, 'images/emotes/navia_icon.png'),
        (4, 'images/emotes/nilou_icon.png'),
        (5, 'images/emotes/paimon_icon.png'),
        (6, 'images/emotes/raiden_icon.png'),
        (7, 'images/emotes/arlecchino_icon.png'),
        (8, 'images/emotes/chiori_icon.png'),
        (9, 'images/emotes/albedo_icon.png'),
        (10, 'images/emotes/fishel_icon.png'),
        (11, 'images/emotes/clorinde_icon.png'),
        (12, 'images/emotes/barbara_icon.png'),
        (13, 'images/emotes/xiao_icon.png'),
        (14, 'images/emotes/ganyu_icon.png'),
        (15, 'images/emotes/sucrose_icon.png'),
        (16, 'images/emotes/charlotte_icon.png'),
        (17, 'images/emotes/yae_icon.png'),
        (18, 'images/emotes/kazuha_icon.png'),
        (19, 'images/emotes/xianling_icon.png');
    `, (err) => {
        if (err) console.error("Errore durante la creazione della tabella utenti:", err.message);
    });

    db.run(`
       
        INSERT INTO "personaggi" ("id", "nome", "immagine", "elemento", "tipo", "rarità", "descrizione") VALUES
        (1, 'albedo', '/images/character/character-albedo-card.png', 'Geo', 'spada', 5, 'Geniale alchimista e Capitano delle Indagini dei Cavalieri di Favonius. Usa il potere Geo per creare piattaforme e amplificare i danni di squadra con la sua abilità Transient Blossoms.'),
        (2, 'alhaitham', '/images/character/character-alhaitham-card.png', 'Dendro','spada', 5, 'Erudito di Sumeru dall''intelletto straordinario, combina la sua mente analitica con le abilità Dendro. Utilizza le Lente Chiare per infliggere danni coordinati e potenziare le reazioni elementali.'),
        (3, 'aloy', '/images/character/character-aloy-card.png', 'Cryo','arco', 5, 'Cacciatrice proveniente da un altro mondo, utilizza la sua tecnologia avanzata e il potere Cryo per scatenare tempeste di ghiaccio con il suo arco e creare trappole esplosive congelanti.'),
        (4, 'amber', '/images/character/character-amber-card.png', 'Pyro','arco', 4, 'L''unica Outrider dei Cavalieri di Favonius, sempre allegra e pronta ad aiutare. Utilizza il suo arco e il suo coniglietto esplosivo Baron Bunny per infliggere danni Pyro in area.'),
        (5, 'arataki itto', '/images/character/character-arataki-itto-card.png', 'Geo','spadone', 5, 'Leader della Banda Arataki, combattente esuberante che brandisce una claymore. Durante il suo burst si trasforma evocando il suo alter ego Oni, aumentando drasticamente la sua forza d''attacco e la velocità.'),
        (6, 'ayaka', '/images/character/character-kamisato-ayaka-card.png', 'Cryo','spada', 5, 'Figlia del Clan Kamisato, combatte con grazia ed eleganza utilizzando la sua spada e abilità Cryo. Il suo dash unico le permette di muoversi sui campi ghiacciati e applicare l''elemento Cryo ai nemici.'),
        (7, 'ayato', '/images/character/character-kamisato-ayato-card.png', 'Hydro','spada', 5, 'Capo del Clan Kamisato e Commissario della Yashiro Commission. Il suo stile di combattimento elegante con la spada crea un campo d''acqua che aumenta la velocità d''attacco del team e infligge danni Hydro in area.'),
        (8, 'baizhu', '/images/character/character-baizhu-card.png', 'Dendro','catalizzatore', 5, 'Rispettato medico del Bubu Pharmacy, accompagnato dal serpente parlante Changsheng. Utilizza il potere Dendro per curare i compagni di squadra e fornire scudi protettivi basati sulla sua vitalità massima.'),
        (9, 'barbara', '/images/character/character-barbara-card.png', 'Hydro','catalizzatore', 4, 'Diaconessa della Chiesa di Favonius e idol di Mondstadt. Le sue melodie e abilità Hydro curano costantemente il team, mentre il suo burst può ripristinare una grande quantità di HP a tutti i membri del gruppo istantaneamente.'),
        (10, 'beidou', '/images/character/character-beidou-card.png', 'Electro','spadone', 4, 'Capitana della flotta Crux, maestra nel parare attacchi con il suo perfetto tempismo. La sua abilità di contrattacco trasforma il danno ricevuto in potenti fulmini Electro, mentre il suo burst crea una barriera elettrica che colpisce i nemici.'),
        (11, 'bennett', '/images/character/character-bennett-card.png', 'Pyro','spada', 4, 'Avventuriero sfortunato ma ottimista, le cui abilità Pyro forniscono incredibile supporto. Il suo burst crea un campo che cura e aumenta l''ATK dei personaggi, rendendolo uno dei migliori supporti nel gioco.'),
        (12, 'candace', '/images/character/character-candace-card.png', 'Hydro','lancia', 4, 'Guardiana di Aaru Village del deserto di Sumeru, combatte con una lancia e uno scudo. Le sue abilità Hydro potenziano gli attacchi normali del team e forniscono infusione elementale, creando nuove sinergie di combattimento.'),
        (13, 'charlotte', '/images/character/character-charlotte-card.png', 'Cryo','catalizzatore', 4, 'Reporter del Fontaine Gazette, curiosa e determinata a scoprire la verità. Usa il suo potere Cryo e la sua macchina fotografica per catturare informazioni e curare i compagni di squadra, bilanciando attacco e supporto.'),
        (15, 'chongyun', '/images/character/character-chongyun-card.png', 'Cryo','spadone', 4, 'Esorcista che utilizza il potere Cryo per purificare gli spiriti maligni. La sua abilità elementale crea un campo che infonde gli attacchi normali con l''elemento Cryo, rendendo possibili potenti combinazioni elementali.'),
        (16, 'collei', '/images/character/character-collei-card.png', 'Dendro','arco', 4, 'Giovane ranger di Sumeru con un passato difficile, ora dedicata a proteggere la foresta. Il suo piccolo compagno meccanico Cuilein-Anbar l''aiuta durante la battaglia, infliggendo danni Dendro supplementari.'),
        (17, 'cyno', '/images/character/character-cyno-card.png', 'Electro','lancia', 5, 'Generale Mahamatra di Sumeru, applica le leggi con precisione e velocità. Durante il suo burst entra in uno stato potenziato che accelera i suoi attacchi Electro e aumenta i danni delle reazioni elementali a base di Electro.'),
        (18, 'dehya', '/images/character/character-dehya-card.png', 'Pyro','spadone', 5, 'Mercenaria d''élite degli Eremites, protettrice leale e potente combattente. Utilizza la sua claymore e il potere Pyro per assorbire danni destinati ai compagni di squadra e contrattaccare con fiamme devastanti.'),
        (19, 'diluc', '/images/character/character-diluc-card.png', 'Pyro','spadone', 5, 'Proprietario dell''Angel''s Share e nobile di Mondstadt. Brandisce la sua claymore con maestria, incanalandovi il potere Pyro. Il suo burst avvolge la sua arma in fiamme, aumentando la portata e potenza dei suoi attacchi.'),
        (20, 'diona', '/images/character/character-diona-card.png', 'Cryo','arco', 4, 'Giovane bartender del Cat''s Tail con caratteristiche feline. Nonostante odi l''industria del vino, è incredibilmente abile nel creare cocktail. Le sue frecce Cryo creano scudi potenti e campi di guarigione per il team.'),
        (21, 'dori', '/images/character/character-dori-card.png', 'Electro','spadone', 4, 'Commerciante astuta e mercante di Sumeru, accompagnata dal suo genio magico. Usa la sua claymore e potere Electro per generare energia per il team, risultando un''ottima batteria elementale e supporto tattico.'),
        (22, 'eula', '/images/character/character-eula-card.png', 'Cryo','spadone', 5, 'Capitana dei Reconnaissance dei Cavalieri di Favonius e discendente del clan Lawrence. Il suo stile di combattimento con la claymore le permette di accumulare stack Grimheart che esplodono in devastanti danni fisici con il suo burst.'),
        (23, 'faruzan', '/images/character/character-faruzan-card.png', 'Anemo','arco', 4, 'Accademica di Sumeru specializzata in meccanismi antichi. Le sue abilità Anemo riducono la resistenza nemica agli elementi dello stesso tipo, potenziando notevolmente i personaggi Anemo nel team con i suoi buff tecnici.'),
        (24, 'fischl', '/images/character/character-fischl-card.png', 'Electro','arco', 4, 'Investigatrice dell''Adventurers'' Guild dalla fervida immaginazione. Evoca il suo corvo Oz per infliggere continui danni Electro anche quando non è in campo, rendendola un''eccellente sub-DPS e generatrice di particelle elementali.'),
        (25, 'freminet', '/images/character/character-freminet-card.png', 'Cryo','spadone', 4, 'Sommozzatore professionista di Fontaine, cerca sua sorella scomparsa nelle profondità. Utilizza la sua mole imponente e il suo potere Cryo per sferrare potenti colpi con i suoi guanti da combattimento pressurizzati.'),
        (26, 'furina', '/images/character/character-furina-card.png', 'Hydro','spada', 5, 'Archon Hydro di Fontaine, incarnazione della giustizia e dell''arte. Le sue abilità combinano performance teatrali con poteri acquatici devastanti, cambiando stile di gioco in base alle "Fanfare" e ai "Lamenti" che accumula durante la battaglia.'),
        (27, 'ganyu', '/images/character/character-ganyu-card.png', 'Cryo','arco', 5, 'Segretaria della Liyue Qixing, metà umana e metà adeptus Qilin. Eccelle nei combattimenti a distanza con il suo arco, potendo caricare frecce che esplodono in aree di ghiaccio, infliggendo enormi danni Cryo.'),
        (28, 'gorou', '/images/character/character-gorou-card.png', 'Geo','arco', 4, 'Generale dell''esercito di Watatsumi Island, dalle caratteristiche canine. Fornisce buff basati sul numero di personaggi Geo nel team, aumentando difesa, resistenza all''interruzione e danni Geo per ottimizzare squadre mono-elemento.'),
        (29, 'heizou', '/images/character/character-shikanoin-heizou-card.png', 'Anemo','catalizzatore', 4, 'Detective della Tenryou Commission, risolve i casi usando la sua mente brillante e intuito acuto. In battaglia utilizza arti marziali e potere Anemo, con attacchi caricati che possono stordire i nemici con un singolo pugno concentrato.'),
        (30, 'hu tao', '/images/character/character-hu-tao-card.png', 'Pyro','arco', 5, 'Direttrice della Wangsheng Funeral Parlor, bilancia la vita e la morte. La sua meccanica unica sacrifica HP per entrare in uno stato potenziato che aumenta drasticamente il suo ATK, mentre le sue abilità possono anche curarla durante i combattimenti.'),
        (31, 'jean', '/images/character/character-jean-card.png', 'Anemo','spada', 5, 'Gran Maestra Interiore dei Cavalieri di Favonius, incarnazione di dedizione e servizio. Bilancia abilità di guarigione e attacco, potendo curare l''intero team con il suo burst mentre lancia i nemici in aria con le sue abilità Anemo.'),
        (32, 'kaeya', '/images/character/character-kaeya-card.png', 'Cryo','spada', 4, 'Capitano Cavalry dei Cavalieri di Favonius, enigmatico e misterioso. Usa la sua spada e abilità Cryo per infliggere danni continui ai nemici, mentre il suo burst crea lame orbitanti di ghiaccio che colpiscono più bersagli.'),
        (33, 'kaveh', '/images/character/character-kaveh-card.png', 'Dendro','spadone', 4, 'Architetto rinomato di Sumeru, dalla personalità artistica e passionale. Brandisce una claymore con eleganza e usa il potere Dendro per creare costrutti naturali che amplificano le reazioni elementali del team.'),
        (34, 'kazuha', '/images/character/character-kazuha-card.png', 'Anemo','spada', 5, 'Samurai errante di Inazuma, maestro della spada e della poesia. Manipola gli elementi con il suo potere Anemo, offrendo mobilità aerea unica e la capacità di potenziare i danni elementali del team attraverso la Swirl Reaction.'),
        (35, 'keqing', '/images/character/character-keqing-card.png', 'Electro','spada', 5, 'Yuheng della Liyue Qixing, efficiente e dedicata al suo lavoro. Si muove rapidamente sul campo di battaglia grazie alle sue abilità Electro di teletrasporto, eseguendo rapidi attacchi con la spada e combo elettriche devastanti.'),
        (36, 'kirara', '/images/character/character-kirara-card.png', 'Dendro','spada', 4, 'Corriere di Sumeru dalla natura felina nekomata, può trasformarsi per trasportare oggetti e persone. Le sue abilità Dendro le permettono di creare scudi protettivi e muoversi rapidamente in una forma alternativa più agile.'),
        (37, 'klee', '/images/character/character-klee-card.png', 'Pyro','catalizzatore', 5, 'La "Spark Knight" di Mondstadt, giovane esperta in esplosivi. I suoi attacchi Pyro con il catalizzatore creano esplosioni in area che possono stordire i nemici, mentre le sue bombe possono essere posizionate strategicamente sul campo.'),
        (38, 'kokomi', '/images/character/character-sangonomiya-kokomi-card.png', 'Hydro','catalizzatore', 5, 'Divine Priestess e leader di Watatsumi Island, strategist brillante. Il suo potere Hydro fornisce costante guarigione al team, compensando il suo difetto di non poter infliggere colpi critici con bonus di cura e danni aumentati.'),
        (39, 'kuki shinobu', '/images/character/character-kuki-shinobu-card.png', 'Electro','spada', 4, 'Vice leader della Arataki Gang, ex studentessa di legge. Combatte con una spada e abilità Electro, sacrificando parte della sua vita per fornire guarigione costante al team e applicare l''elemento Electro ai nemici.'),
        (41, 'lisa', '/images/character/character-lisa-card.png', 'Electro','catalizzatore', 4, 'Librarian dei Cavalieri di Favonius e potente maga, tornata a Mondstadt dopo aver studiato a Sumeru. Manipola l''elemento Electro con il suo catalizzatore, lanciando fulmini che possono marcare i nemici per poi scatenare potenti scariche elettriche.'),
        (42, 'lynette', '/images/character/character-lynette-card.png', 'Anemo','spada', 4, 'Artista di strada e prestigiatrice di Fontaine, sempre in coppia con suo fratello Lyney. Usa agilità e ingegnosità con i suoi poteri Anemo, potendo purificare i membri del team da effetti negativi e intrappolare i nemici in illusioni aeree.'),
        (43, 'lyney', '/images/character/character-lyney-card.png', 'Pyro','arco', 5, 'Mago illusionista di Fontaine che si esibisce con sua sorella Lynette. Manipola l''elemento Pyro per creare spettacolari attacchi a distanza con il suo arco, evocando anche un assistente che potenzia i suoi colpi caricati.'),
        (44, 'mika', '/images/character/character-mika-card.png', 'Cryo','lancia', 4, 'Cartografo e surveyor dei Cavalieri di Favonius, preciso e metodico. Usa la sua lancia e abilità Cryo con precisione militare, fornendo buff di velocità d''attacco e cura ai compagni di squadra basati sul suo stile di combattimento ritmico.'),
        (45, 'mona', '/images/character/character-mona-card.png', 'Hydro','catalizzatore', 5, 'Astrolog e scriba, capace di leggere il destino nelle stelle. Usa il suo catalizzatore e poteri Hydro per muoversi rapidamente sull''acqua e intrappolare i nemici in bolle astrali che amplificano i danni ricevuti durante il suo burst.'),
        (48, 'neuvillette', '/images/character/character-neuvillette-card.png', 'Hydro','catalizzatore', 5, 'Giudice Supremo di Fontaine, legato a una misteriosa creatura acquatica. Il suo stile di combattimento elegante con il catalizzatore gli permette di incanalare attacchi caricati più rapidamente, scatenando vortici d''acqua e giudizi supremi sui nemici.'),
        (49, 'nilou', '/images/character/character-nilou-card.png', 'Hydro','spada', 5, 'Danzatrice del Zubayr Theater di Sumeru, specializzata nella danza del loto. I suoi movimenti fluidi e il potere Hydro generano una reazione Bloom unica chiamata "Bountiful Cores" quando nel team sono presenti solo personaggi Hydro e Dendro.'),
        (50, 'ningguang', '/images/character/character-ningguang-card.png', 'Geo','catalizzatore', 4, 'Tianquan della Liyue Qixing e ricca donna d''affari. Usa il potere Geo per lanciare gemme preziose dai suoi attacchi con catalizzatore e costruire barriere di giada che possono sia proteggere che essere sacrificate per infliggere danni.'),
        (51, 'noelle', '/images/character/character-noelle-card.png', 'Geo','spadone', 4, 'Cameriera aspirante Cavaliere di Favonius dall''incredibile forza. Il suo burst trasforma i suoi attacchi in ampi fendenti Geo che guariscono i membri del team, mentre il suo scudo assorbe danni e può contrattaccare automaticamente.'),
        (52, 'qiqi', '/images/character/character-qiqi-card.png', 'Cryo','spada', 5, 'Apprendista erborista del Bubu Pharmacy, zombie immortale preservata dall''adeptus. Usa poteri Cryo principalmente per curare, applicando talismani ai nemici che permettono ai membri della squadra di recuperare salute attaccando i nemici marchiati.'),
        (53, 'raiden shogun', '/images/character/character-raiden-shogun-card.png', 'Electro','lancia', 5, 'L''Electro Archon e governatrice di Inazuma, custode dell''eternità. Usa la sua lancia e potente Energy Recharge per colpire i nemici con fulmini divini, ricaricando le energie del team durante il suo burst quando impugna la spada Musou Isshin.'),
        (54, 'razor', '/images/character/character-razor-card.png', 'Electro','spadone', 4, 'Giovane cresciuto dai lupi di Wolvendom, selvaggio ma leale. Combatte con la sua claymore e il potere Electro in uno stile brutale, evocando lo spirito di un lupo elettrico durante il burst che aumenta velocità e danni dei suoi attacchi.'),
        (55, 'rosaria', '/images/character/character-rosaria-card.png', 'Cryo', 'lancia', 4, 'Suora non convenzionale della Chiesa di Favonius, più simile a un''assassina. Usa la sua lancia e abilità Cryo per teletrasportarsi dietro ai nemici con attacchi veloci e letali, aumentando anche il CRIT Rate della squadra con il suo burst.'),
        (56, 'sara', '/images/character/character-kujou-sara-card.png', 'Electro', 'arco', 4, 'Generale Tengu della Tenryou Commission, devota alla Shogun. Le sue frecce Electro lasciano un marchio che esplode aumentando l''ATK degli alleati colpiti dall''esplosione, rendendo il suo supporto unico ma tecnico da utilizzare.'),
        (57, 'sayu', '/images/character/character-sayu-card.png', 'Anemo', 'claymore', 4, 'Ninja della Shuumatsuban, esperta nel nascondersi e riposare. Nonostante la piccola statura, brandisce un''enorme claymore e può rotolare a forma di pallone con la sua abilità Anemo, guarendo la squadra in base ai danni Swirl che infligge.'),
        (58, 'shenhe', '/images/character/character-shenhe-card.png', 'Cryo', 'lancia', 5, 'Discepola degli adepti con un passato tragico e poteri sigillati. Utilizza la sua lancia per aumentare significativamente i danni Cryo dei membri del team, rendendola una specialista di supporto per i personaggi di questo elemento.'),
        (59, 'sucrose', '/images/character/character-sucrose-card.png', 'Anemo', 'catalizzatore', 4, 'Alchimista di Mondstadt, timida ma brillante nelle sue ricerche. Il suo catalizzatore Anemo le permette di raggruppare i nemici e potenziare la Maestria Elementale del team, amplificando tutte le reazioni elementali della squadra.'),
        (60, 'tartaglia', '/images/character/character-tartaglia-card.png', 'Hydro', 'arco', 5, 'Undicesimo degli Harbingers dei Fatui, conosciuto anche come Childe. Maestro in combattimento con arco e lame, usa il potere Hydro per passare dal combattimento a distanza a quello ravvicinato con la sua abilità di stance change unica.'),
        (61, 'thoma', '/images/character/character-thoma-card.png', 'Pyro', 'lancia', 4, 'Maggiordomo della Yashiro Commission, originario di Mondstadt ma trasferitosi a Inazuma. Usa la sua lancia e abilità Pyro per creare scudi stratificati che si rinforzano ad ogni attacco normale, proteggendo costantemente il team.'),
        (62, 'tighnari', '/images/character/character-tighnari-card.png', 'Dendro', 'arco', 5, 'Ranger forestale di Sumeru con orecchie da volpe, esperto botanico. Usa il suo arco e potere Dendro per attacchi caricati più veloci del normale, lanciando frecce che si dividono in proiettili cercanti dopo aver colpito il bersaglio.'),
        (70, 'venti', '/images/character/character-venti-card.png', 'Anemo', 'arco', 5, 'L''Archon Anemo di Mondstadt, sotto le sembianze di un bardo vagabondo. Usa il suo arco e poteri del vento con incredibile controllo, potendo raggruppare i nemici in potenti vortici e generare correnti ascensionali per il team.'),
        (71, 'wanderer', '/images/character/character-wanderer-card.png', 'Anemo', 'catalizzatore', 5, 'Precedentemente noto come Scaramouche, ora redento e rinato. Usa poteri Anemo con mobilità aerea unica, potendo librarsi in cielo e attaccare dall''alto con il suo catalizzatore, cambiando stile durante il suo stato Windfavored.'),
        (72, 'wriothesley', '/images/character/character-wriothesley-card.png', 'Cryo', 'catalizzatore', 5, 'Direttore del Fortress of Meropide, conosciuto come "Ice Fang". Il suo stile di combattimento unico con guanti criogenici gli permette di sferrare potenti pugni Cryo, bilanciando la sua salute con i danni che infligge attraverso un meccanismo di rinculo.'),
        (73, 'xiangling', '/images/character/character-xiangling-card.png', 'Pyro', 'lancia', 4, 'Chef del Wanmin Restaurant, innovativa e amante dei sapori estremi. Usa la sua lancia e il suo compagno Guoba per infliggere continui danni Pyro in area, mentre il suo burst crea un tornado di fiamme rotante che segue il personaggio attivo.'),
        (74, 'xiao', '/images/character/character-xiao-card.png', 'Anemo', 'lancia', 5, 'Ultimo dei Yaksha, guardiano immortale che combatte i demoni da millenni. Usa la sua lancia e abilità Anemo con mobilità sovrumana, entrando in uno stato di trance durante il burst che aumenta i danni a costo della sua salute.'),
        (75, 'xingqiu', '/images/character/character-xingqiu-card.png', 'Hydro', 'spada', 4, 'Giovane della Feiyun Commerce Guild e aspirante scrittore di romanzi. Usa la sua spada e poteri Hydro per creare lame d''acqua che attaccano insieme al personaggio attivo, fornendo sia danni che riduzione del danno ricevuto.'),
        (76, 'xinyan', '/images/character/character-xinyan-card.png', 'Pyro', 'claymore', 4, 'Musicista rock and roll di Liyue, combatte i pregiudizi con la sua musica. Usa la sua claymore e abilità Pyro per attacchi ritmici, generando scudi e danni in area a seconda del numero di nemici colpiti dalla sua abilità.'),
        (77, 'yae miko', '/images/character/character-yae-miko-card.png', 'Electro', 'catalizzatore', 5, 'Sacerdotessa capo del Grand Narukami Shrine e editrice della Yae Publishing House. Usa astuzia e potere Electro con il suo catalizzatore, posizionando totem di volpe che colpiscono i nemici e convergono in un fulmine devastante.'),
        (78, 'yanfei', '/images/character/character-yanfei-card.png', 'Pyro', 'catalizzatore', 4, 'Consulente legale di Liyue, metà illuminata. Usa il suo catalizzatore e potere Pyro con un sistema di sigilli che potenzia i suoi attacchi, generando scudi che la proteggono durante i combattimenti più intensi.'),
        (79, 'yaoyao', '/images/character/character-yaoyao-card.png', 'Dendro', 'lancia', 4, 'Discepola di Madame Ping e assistente di Ganyu, piccola ma determinata. Usa la sua lancia e abilità Dendro per curare e supportare, evocando una creatura magica chiamata Yuegui che distribuisce cure e applica l''elemento Dendro.'),
        (80, 'yelan', '/images/character/character-yelan-card.png', 'Hydro', 'arco', 5, 'Misteriosa intelligence di Liyue, lavora nell''ombra per mantenere l''equilibrio. Usa il suo arco e abilità Hydro per colpire rapidamente, creando una Dire di dadi che segue e attacca insieme al personaggio attivo, aumentando progressivamente i suoi danni.'),
        (81, 'yoimiya', '/images/character/character-yoimiya-card.png', 'Pyro', 'arco', 5, 'Maestra dei fuochi d''artificio di Inazuma, conosciuta come la "Regina del Summer Festival". Usa il suo arco e abilità Pyro per creare spettacolari combo di attacchi infuocati, con proiettili che possono rimbalzare tra i nemici durante il suo burst.'),
        (82, 'yun jin', '/images/character/character-yun-jin-card.png', 'Geo', 'lancia', 4, 'Opera performer di Liyue, combina arti tradizionali con abilità di combattimento. Usa la sua lancia e potere Geo per potenziare gli attacchi normali del team, con bonus che aumentano in base alla diversità elementale della squadra.'),
        (83, 'zhongli', '/images/character/character-zhongli-card.png', 'Geo', 'lancia', 5, 'Ex Archon Geo ora consulente della Wangsheng Funeral Parlor. Usa la sua lancia e potere Geo per creare scudi impenetrabili e pilastri che risuonano con altre costruzioni Geo, petrificando i nemici con il suo potente burst meteorite.'),
        (84, 'chiori', '/images/character/character-chiori-card.png', 'Geo', 'spada', 5, 'Stilista e guerriera di Inazuma, allieva della Yashiro Commission. La sua abilità unica di manipolare il potere Geo insieme alla sua maestria con ago e spada le permette di creare abiti da battaglia che aumentano le sue capacità offensive e difensive.'),
        (86, 'clorinde', '/images/character/character-clorinde-card.png', 'Electro', 'spada', 5, 'Cavaliere dell''Ordine di Fontaine dall''eleganza letale. Il suo stile di combattimento combina precisione e potenza con la spada, incanalando il potere Electro per movimenti rapidi e fendenti che possono paralizzare più nemici contemporaneamente.'),
        (87, 'sigewinne', '/images/character/character-sigewinne-card.png', 'Hydro', 'arco', 5, 'Falconiera di Fontaine, sempre accompagnata dal suo fedele rapace. Usa il potere Anemo in sinergia con il suo uccello per eseguire attacchi coordinati dall''alto, creando vortici di vento che amplificano i danni e forniscono mobilità aerea al team.'),
        (89, 'sethos', '/images/character/character-sethos-card.png', 'Electro', 'arco', 5, 'Misterioso avventuriero proveniente dalle profondità del deserto di Sumeru. Combina antiche conoscenze con il potere Electro, evocando tempeste di sabbia elettrificate e utilizzando tecniche di combattimento segrete tramandate da una civiltà perduta.');
    `, (err) => {
        if (err) console.error("Errore durante la creazione della tabella personaggi:", err.message);
    });

    db.run(`
        INSERT INTO artefatti (nome, immagine, categoria, descrizione, effetto_duepezzi, effetto_4pezzi) VALUES
        -- Adventurer Set
        ('Adventurer''s Flower', '/images/artifact/adventurer-flower.png', 'Flower of Life', 'Un fiore che non appassisce mai, raccolto da un avventuriero durante i suoi viaggi.', 'Aumenta HP massimo di 1000 punti.', 'Recupera 30% HP quando apri un forziere.'),
        ('Adventurer''s Plume', '/images/artifact/adventurer-plume.png', 'Plume of Death', 'Una piuma che simboleggia le avventure condotte, leggera ma resistente.', 'Aumenta HP massimo di 1000 punti.', 'Recupera 30% HP quando apri un forziere.'),
        ('Adventurer''s Sands', '/images/artifact/adventurer-sands.png', 'Sands of Eon', 'Una clessidra che ha misurato il tempo di molte avventure.', 'Aumenta HP massimo di 1000 punti.', 'Recupera 30% HP quando apri un forziere.'),
        ('Adventurer''s Goblet', '/images/artifact/adventurer-goblet.png', 'Goblet of Eonothem', 'Un calice che ha raccolto l''acqua di molte terre esotiche.', 'Aumenta HP massimo di 1000 punti.', 'Recupera 30% HP quando apri un forziere.'),
        ('Adventurer''s Circlet', '/images/artifact/adventurer-circlet.png', 'Circlet of Logos', 'Un copricapo che ha protetto l''avventuriero durante numerosi viaggi.', 'Aumenta HP massimo di 1000 punti.', 'Recupera 30% HP quando apri un forziere.'),
        
        -- Archaic Petra Set
        ('Archaic Petra Flower', '/images/artifact/archaic-petra-flower.png', 'Flower of Life', 'Un fiore di pietra proveniente da un''antica civiltà.', 'Bonus DMG Geo +15%', 'Quando ottieni un elemento con una Reazione Cristallizzazione, ottieni 35% di Bonus DMG per quell''elemento per 10s. Si può ottenere un solo bonus alla volta.'),
        ('Archaic Petra Plume', '/images/artifact/archaic-petra-plume.png', 'Plume of Death', 'Una piuma pietrificata che conserva la memoria degli antichi.', 'Bonus DMG Geo +15%', 'Quando ottieni un elemento con una Reazione Cristallizzazione, ottieni 35% di Bonus DMG per quell''elemento per 10s. Si può ottenere un solo bonus alla volta.'),
        ('Archaic Petra Sands', '/images/artifact/archaic-petra-sands.png', 'Sands of Eon', 'Una clessidra che contiene sabbia pietrificata dal tempo.', 'Bonus DMG Geo +15%', 'Quando ottieni un elemento con una Reazione Cristallizzazione, ottieni 35% di Bonus DMG per quell''elemento per 10s. Si può ottenere un solo bonus alla volta.'),
        ('Archaic Petra Goblet', '/images/artifact/archaic-petra-goblet.png', 'Goblet of Eonothem', 'Un calice forgiato nella pietra di un''antica civiltà.', 'Bonus DMG Geo +15%', 'Quando ottieni un elemento con una Reazione Cristallizzazione, ottieni 35% di Bonus DMG per quell''elemento per 10s. Si può ottenere un solo bonus alla volta.'),
        ('Archaic Petra Circlet', '/images/artifact/archaic-petra-circlet.png', 'Circlet of Logos', 'Un diadema ricavato da pietre preziose di un regno perduto.', 'Bonus DMG Geo +15%', 'Quando ottieni un elemento con una Reazione Cristallizzazione, ottieni 35% di Bonus DMG per quell''elemento per 10s. Si può ottenere un solo bonus alla volta.'),
        
        -- Berserker Set
        ('Berserker''s Flower', '/images/artifact/berserker-flower.png', 'Flower of Life', 'Un fiore nutristo dal sangue dei guerrieri caduti.', 'CRIT Rate +12%', 'Quando gli HP sono inferiori a 70%, CRIT Rate +24%.'),
        ('Berserker''s Plume', '/images/artifact/berserker-plume.png', 'Plume of Death', 'Una piuma di un guerriero leggendario che combatteva come un demone.', 'CRIT Rate +12%', 'Quando gli HP sono inferiori a 70%, CRIT Rate +24%.'),
        ('Berserker''s Sands', '/images/artifact/berserker-sands.png', 'Sands of Eon', 'Una clessidra che rappresenta il breve ma intenso tempo di vita di un berserker.', 'CRIT Rate +12%', 'Quando gli HP sono inferiori a 70%, CRIT Rate +24%.'),
        ('Berserker''s Goblet', '/images/artifact/berserker-goblet.png', 'Goblet of Eonothem', 'Un calice utilizzato per rituali di battaglia, ornato con simboli di furia.', 'CRIT Rate +12%', 'Quando gli HP sono inferiori a 70%, CRIT Rate +24%.'),
        ('Berserker''s Circlet', '/images/artifact/berserker-circlet.png', 'Circlet of Logos', 'Un elmo che incanalava la follia del guerriero in battaglia.', 'CRIT Rate +12%', 'Quando gli HP sono inferiori a 70%, CRIT Rate +24%.'),
        
        -- Blizzard Strayer Set
        ('Blizzard Strayer Flower', '/images/artifact/blizzard-strayer-flower.png', 'Flower of Life', 'Un fiore conservato perfettamente nel ghiaccio eterno.', 'Bonus DMG Cryo +15%', 'Quando un personaggio attacca un nemico affetto da Cryo, il suo CRIT Rate aumenta del 20%. Se il nemico è Congelato, il CRIT Rate aumenta di un ulteriore 20%.'),
        ('Blizzard Strayer Plume', '/images/artifact/blizzard-strayer-plume.png', 'Plume of Death', 'Una piuma che non si piega al freddo più intenso.', 'Bonus DMG Cryo +15%', 'Quando un personaggio attacca un nemico affetto da Cryo, il suo CRIT Rate aumenta del 20%. Se il nemico è Congelato, il CRIT Rate aumenta di un ulteriore 20%.'),
        ('Blizzard Strayer Sands', '/images/artifact/blizzard-strayer-sands.png', 'Sands of Eon', 'Una clessidra dove il tempo è congelato dall''intenso freddo.', 'Bonus DMG Cryo +15%', 'Quando un personaggio attacca un nemico affetto da Cryo, il suo CRIT Rate aumenta del 20%. Se il nemico è Congelato, il CRIT Rate aumenta di un ulteriore 20%.'),
        ('Blizzard Strayer Goblet', '/images/artifact/blizzard-strayer-goblet.png', 'Goblet of Eonothem', 'Un calice ghiacciato che mantiene qualsiasi liquido a temperature gelide.', 'Bonus DMG Cryo +15%', 'Quando un personaggio attacca un nemico affetto da Cryo, il suo CRIT Rate aumenta del 20%. Se il nemico è Congelato, il CRIT Rate aumenta di un ulteriore 20%.'),
        ('Blizzard Strayer Circlet', '/images/artifact/blizzard-strayer-circlet.png', 'Circlet of Logos', 'Un diadema decorato con cristalli di ghiaccio eterno.', 'Bonus DMG Cryo +15%', 'Quando un personaggio attacca un nemico affetto da Cryo, il suo CRIT Rate aumenta del 20%. Se il nemico è Congelato, il CRIT Rate aumenta di un ulteriore 20%.'),
        
        -- Bloodstained Chivalry Set
        ('Bloodstained Chivalry Flower', '/images/artifact/bloodstained-chivalry-flower.png', 'Flower of Life', 'Un fiore che ha assorbito il sangue versato in nome dell''onore cavalleresco.', 'Bonus DMG Fisico +25%', 'Dopo aver sconfitto un nemico, gli attacchi caricati non consumeranno Stamina per 10s e il DMG degli Attacchi Caricati aumenta del 50%.'),
        ('Bloodstained Chivalry Plume', '/images/artifact/bloodstained-chivalry-plume.png', 'Plume of Death', 'Una piuma macchiata dal sangue di battaglie per la giustizia.', 'Bonus DMG Fisico +25%', 'Dopo aver sconfitto un nemico, gli attacchi caricati non consumeranno Stamina per 10s e il DMG degli Attacchi Caricati aumenta del 50%.'),
        ('Bloodstained Chivalry Sands', '/images/artifact/bloodstained-chivalry-sands.png', 'Sands of Eon', 'Una clessidra che misura il tempo rimanente di un cavaliere morente.', 'Bonus DMG Fisico +25%', 'Dopo aver sconfitto un nemico, gli attacchi caricati non consumeranno Stamina per 10s e il DMG degli Attacchi Caricati aumenta del 50%.'),
        ('Bloodstained Chivalry Goblet', '/images/artifact/bloodstained-chivalry-goblet.png', 'Goblet of Eonothem', 'Un calice che ha contenuto sia il vino che il sangue dei cavalieri caduti.', 'Bonus DMG Fisico +25%', 'Dopo aver sconfitto un nemico, gli attacchi caricati non consumeranno Stamina per 10s e il DMG degli Attacchi Caricati aumenta del 50%.'),
        ('Bloodstained Chivalry Circlet', '/images/artifact/bloodstained-chivalry-circlet.png', 'Circlet of Logos', 'Un elmo che ha visto innumerevoli battaglie e porta le cicatrici dell''onore.', 'Bonus DMG Fisico +25%', 'Dopo aver sconfitto un nemico, gli attacchi caricati non consumeranno Stamina per 10s e il DMG degli Attacchi Caricati aumenta del 50%.'),

        -- Brave Heart Set
        ('Brave Heart Flower', '/images/artifact/brave-heart-flower.png', 'Flower of Life', 'Un fiore che rappresenta il coraggio e la determinazione di un guerriero.', 'ATK +18%', 'Aumenta del 30% il DMG contro nemici con più del 50% di HP.'),
        ('Brave Heart Plume', '/images/artifact/brave-heart-plume.png', 'Plume of Death', 'Una piuma che simboleggia la forza d''animo necessaria per affrontare qualsiasi sfida.', 'ATK +18%', 'Aumenta del 30% il DMG contro nemici con più del 50% di HP.'),
        ('Brave Heart Sands', '/images/artifact/brave-heart-sands.png', 'Sands of Eon', 'Una clessidra che misura il tempo dei coraggiosi in battaglia.', 'ATK +18%', 'Aumenta del 30% il DMG contro nemici con più del 50% di HP.'),
        ('Brave Heart Goblet', '/images/artifact/brave-heart-goblet.png', 'Goblet of Eonothem', 'Un calice che incita i guerrieri a bere alla salute del coraggio.', 'ATK +18%', 'Aumenta del 30% il DMG contro nemici con più del 50% di HP.'),
        ('Brave Heart Circlet', '/images/artifact/brave-heart-circlet.png', 'Circlet of Logos', 'Un diadema che simboleggia il cuore impavido del suo portatore.', 'ATK +18%', 'Aumenta del 30% il DMG contro nemici con più del 50% di HP.'),

        -- Crimson Witch of Flames Set
        ('Crimson Witch of Flames Flower', '/images/artifact/crimson-witch-of-flames-flower.png', 'Flower of Life', 'Un fiore infuso con il potere di una strega che controllava il fuoco.', 'Pyro DMG Bonus +15%', 'Aumenta Overloaded e Burning DMG del 40%. Aumenta Vaporize e Melt DMG del 15%. Usando un''Abilità Elementale aumenta l''effetto 2 pezzi del 50% per 10s. Max 3 stack.'),
        ('Crimson Witch of Flames Plume', '/images/artifact/crimson-witch-of-flames-plume.png', 'Plume of Death', 'Una piuma rossastra che arde al tocco con il fuoco della vendetta.', 'Pyro DMG Bonus +15%', 'Aumenta Overloaded e Burning DMG del 40%. Aumenta Vaporize e Melt DMG del 15%. Usando un''Abilità Elementale aumenta l''effetto 2 pezzi del 50% per 10s. Max 3 stack.'),
        ('Crimson Witch of Flames Sands', '/images/artifact/crimson-witch-of-flames-sands.png', 'Sands of Eon', 'Una clessidra la cui sabbia arde perpetuamente con la fiamma della strega.', 'Pyro DMG Bonus +15%', 'Aumenta Overloaded e Burning DMG del 40%. Aumenta Vaporize e Melt DMG del 15%. Usando un''Abilità Elementale aumenta l''effetto 2 pezzi del 50% per 10s. Max 3 stack.'),
        ('Crimson Witch of Flames Goblet', '/images/artifact/crimson-witch-of-flames-goblet.png', 'Goblet of Eonothem', 'Un calice che contiene fiamme scarlatte che mai si estinguono.', 'Pyro DMG Bonus +15%', 'Aumenta Overloaded e Burning DMG del 40%. Aumenta Vaporize e Melt DMG del 15%. Usando un''Abilità Elementale aumenta l''effetto 2 pezzi del 50% per 10s. Max 3 stack.'),
        ('Crimson Witch of Flames Circlet', '/images/artifact/crimson-witch-of-flames-circlet.png', 'Circlet of Logos', 'Un diadema che emanava il calore infernale della strega.', 'Pyro DMG Bonus +15%', 'Aumenta Overloaded e Burning DMG del 40%. Aumenta Vaporize e Melt DMG del 15%. Usando un''Abilità Elementale aumenta l''effetto 2 pezzi del 50% per 10s. Max 3 stack.'),

        -- Deepwood Memories Set
        ('Deepwood Memories Flower', '/images/artifact/deepwood-memories-flower.png', 'Flower of Life', 'Un fiore che racchiude le memorie degli antichi boschi.', 'Dendro DMG Bonus +15%', 'Dopo aver colpito un nemico con un''Abilità Elementale o Scoppio, diminuisce la resistenza Dendro del nemico del 30% per 8s.'),
        ('Deepwood Memories Plume', '/images/artifact/deepwood-memories-plume.png', 'Plume of Death', 'Una piuma che conserva l''essenza della foresta profonda.', 'Dendro DMG Bonus +15%', 'Dopo aver colpito un nemico con un''Abilità Elementale o Scoppio, diminuisce la resistenza Dendro del nemico del 30% per 8s.'),
        ('Deepwood Memories Sands', '/images/artifact/deepwood-memories-sands.png', 'Sands of Eon', 'Una clessidra che misura il tempo secondo il ciclo della natura.', 'Dendro DMG Bonus +15%', 'Dopo aver colpito un nemico con un''Abilità Elementale o Scoppio, diminuisce la resistenza Dendro del nemico del 30% per 8s.'),
        ('Deepwood Memories Goblet', '/images/artifact/deepwood-memories-goblet.png', 'Goblet of Eonothem', 'Un calice intagliato nel legno antico della foresta primordiale.', 'Dendro DMG Bonus +15%', 'Dopo aver colpito un nemico con un''Abilità Elementale o Scoppio, diminuisce la resistenza Dendro del nemico del 30% per 8s.'),
        ('Deepwood Memories Circlet', '/images/artifact/deepwood-memories-circlet.png', 'Circlet of Logos', 'Una corona tessuta dalle foglie e dai fiori del bosco profondo.', 'Dendro DMG Bonus +15%', 'Dopo aver colpito un nemico con un''Abilità Elementale o Scoppio, diminuisce la resistenza Dendro del nemico del 30% per 8s.'),

        -- Desert Pavilion Chronicle Set
        ('Desert Pavilion Chronicle Flower', '/images/artifact/desert-pavilion-chronicle-flower.png', 'Flower of Life', 'Un fiore che è sopravvissuto alle dure condizioni del deserto.', 'Anemo DMG Bonus +15%', 'Dopo aver colpito un nemico con un Attacco Caricato, i normali attacchi infliggono un 40% di DMG aggiuntivo dell''ATK per 15s.'),
        ('Desert Pavilion Chronicle Plume', '/images/artifact/desert-pavilion-chronicle-plume.png', 'Plume of Death', 'Una piuma che ha viaggiato sui venti del deserto per molte ere.', 'Anemo DMG Bonus +15%', 'Dopo aver colpito un nemico con un Attacco Caricato, i normali attacchi infliggono un 40% di DMG aggiuntivo dell''ATK per 15s.'),
        ('Desert Pavilion Chronicle Sands', '/images/artifact/desert-pavilion-chronicle-sands.png', 'Sands of Eon', 'Una clessidra che contiene la sabbia di un antico deserto.', 'Anemo DMG Bonus +15%', 'Dopo aver colpito un nemico con un Attacco Caricato, i normali attacchi infliggono un 40% di DMG aggiuntivo dell''ATK per 15s.'),
        ('Desert Pavilion Chronicle Goblet', '/images/artifact/desert-pavilion-chronicle-goblet.png', 'Goblet of Eonothem', 'Un calice intagliato nella pietra modellata dai venti del deserto.', 'Anemo DMG Bonus +15%', 'Dopo aver colpito un nemico con un Attacco Caricato, i normali attacchi infliggono un 40% di DMG aggiuntivo dell''ATK per 15s.'),
        ('Desert Pavilion Chronicle Circlet', '/images/artifact/desert-pavilion-chronicle-circlet.png', 'Circlet of Logos', 'Un copricapo degno di un sovrano del deserto, elegante e regale.', 'Anemo DMG Bonus +15%', 'Dopo aver colpito un nemico con un Attacco Caricato, i normali attacchi infliggono un 40% di DMG aggiuntivo dell''ATK per 15s.'),

        -- Echoes of an Offering Set
        ('Echoes of an Offering Flower', '/images/artifact/echoes-of-an-offering-flower.png', 'Flower of Life', 'Un fiore che risuona con gli echi di antiche preghiere.', 'ATK +18%', 'Attacco normale ha il 36% di possibilità di attivare Valley Rite, aumentando il DMG dell''attacco normale del 70% dell''ATK. Questo effetto si disattiva quando attiva e ha una possibilità di reset ogni 0.2s.'),
        ('Echoes of an Offering Plume', '/images/artifact/echoes-of-an-offering-plume.png', 'Plume of Death', 'Una piuma che porta gli echi di canti e preghiere attraverso i secoli.', 'ATK +18%', 'Attacco normale ha il 36% di possibilità di attivare Valley Rite, aumentando il DMG dell''attacco normale del 70% dell''ATK. Questo effetto si disattiva quando attiva e ha una possibilità di reset ogni 0.2s.'),
        ('Echoes of an Offering Sands', '/images/artifact/echoes-of-an-offering-sands.png', 'Sands of Eon', 'Una clessidra che cattura i momenti di offerte e supplicazioni.', 'ATK +18%', 'Attacco normale ha il 36% di possibilità di attivare Valley Rite, aumentando il DMG dell''attacco normale del 70% dell''ATK. Questo effetto si disattiva quando attiva e ha una possibilità di reset ogni 0.2s.'),
        ('Echoes of an Offering Goblet', '/images/artifact/echoes-of-an-offering-goblet.png', 'Goblet of Eonothem', 'Un calice usato in antichi rituali di offerta agli dei.', 'ATK +18%', 'Attacco normale ha il 36% di possibilità di attivare Valley Rite, aumentando il DMG dell''attacco normale del 70% dell''ATK. Questo effetto si disattiva quando attiva e ha una possibilità di reset ogni 0.2s.'),
        ('Echoes of an Offering Circlet', '/images/artifact/echoes-of-an-offering-circlet.png', 'Circlet of Logos', 'Un diadema che risuona con le memorie di preghiere devote.', 'ATK +18%', 'Attacco normale ha il 36% di possibilità di attivare Valley Rite, aumentando il DMG dell''attacco normale del 70% dell''ATK. Questo effetto si disattiva quando attiva e ha una possibilità di reset ogni 0.2s.'),

        -- Emblem of Severed Fate Set
        ('Emblem of Severed Fate Flower', '/images/artifact/emblem-of-severed-fate-flower.png', 'Flower of Life', 'Un fiore che rappresenta un destino diviso e ricomposto.', 'Ricarica Energia +20%', 'Aumenta Scoppio Elementale DMG di un ammontare pari al 25% della Ricarica Energia. Max 75% di bonus può essere ottenuto in questo modo.'),
        ('Emblem of Severed Fate Plume', '/images/artifact/emblem-of-severed-fate-plume.png', 'Plume of Death', 'Una piuma che segna la connessione tra diversi destini.', 'Ricarica Energia +20%', 'Aumenta Scoppio Elementale DMG di un ammontare pari al 25% della Ricarica Energia. Max 75% di bonus può essere ottenuto in questo modo.'),
        ('Emblem of Severed Fate Sands', '/images/artifact/emblem-of-severed-fate-sands.png', 'Sands of Eon', 'Una clessidra che controlla il flusso del destino stesso.', 'Ricarica Energia +20%', 'Aumenta Scoppio Elementale DMG di un ammontare pari al 25% della Ricarica Energia. Max 75% di bonus può essere ottenuto in questo modo.'),
        ('Emblem of Severed Fate Goblet', '/images/artifact/emblem-of-severed-fate-goblet.png', 'Goblet of Eonothem', 'Un calice che contiene il potere di alterare il destino.', 'Ricarica Energia +20%', 'Aumenta Scoppio Elementale DMG di un ammontare pari al 25% della Ricarica Energia. Max 75% di bonus può essere ottenuto in questo modo.'),
        ('Emblem of Severed Fate Circlet', '/images/artifact/emblem-of-severed-fate-circlet.png', 'Circlet of Logos', 'Un diadema che permette al portatore di vedere oltre le porte del destino.', 'Ricarica Energia +20%', 'Aumenta Scoppio Elementale DMG di un ammontare pari al 25% della Ricarica Energia. Max 75% di bonus può essere ottenuto in questo modo.'),

        -- Flower of Paradise Lost Set
        ('Flower of Paradise Lost Flower', '/images/artifact/flower-of-paradise-lost-flower.png', 'Flower of Life', 'Un fiore che simboleggia il paradiso perduto e le sue meraviglie.', 'Aumenta Maestria Elementale di 80 punti.', 'Il portatore avrà i seguenti effetti basati sul tipo di elemento: Fioritura, Iperfioritura, o Fioritura Bruciante: DMG aumentato del 40%. Aggravata o Diffusione: DMG aumentato del 20%.'),
        ('Flower of Paradise Lost Plume', '/images/artifact/flower-of-paradise-lost-plume.png', 'Plume of Death', 'Una piuma caduta dal paradiso, conservando la sua bellezza eterea.', 'Aumenta Maestria Elementale di 80 punti.', 'Il portatore avrà i seguenti effetti basati sul tipo di elemento: Fioritura, Iperfioritura, o Fioritura Bruciante: DMG aumentato del 40%. Aggravata o Diffusione: DMG aumentato del 20%.'),
        ('Flower of Paradise Lost Sands', '/images/artifact/flower-of-paradise-lost-sands.png', 'Sands of Eon', 'Una clessidra che contiene la sabbia di un giardino paradisiaco perduto.', 'Aumenta Maestria Elementale di 80 punti.', 'Il portatore avrà i seguenti effetti basati sul tipo di elemento: Fioritura, Iperfioritura, o Fioritura Bruciante: DMG aumentato del 40%. Aggravata o Diffusione: DMG aumentato del 20%.'),
        ('Flower of Paradise Lost Goblet', '/images/artifact/flower-of-paradise-lost-goblet.png', 'Goblet of Eonothem', 'Un calice decorato con motivi floreali del paradiso perduto.', 'Aumenta Maestria Elementale di 80 punti.', 'Il portatore avrà i seguenti effetti basati sul tipo di elemento: Fioritura, Iperfioritura, o Fioritura Bruciante: DMG aumentato del 40%. Aggravata o Diffusione: DMG aumentato del 20%.'),
        ('Flower of Paradise Lost Circlet', '/images/artifact/flower-of-paradise-lost-circlet.png', 'Circlet of Logos', 'Un diadema adornato con i fiori più rari del paradiso scomparso.', 'Aumenta Maestria Elementale di 80 punti.', 'Il portatore avrà i seguenti effetti basati sul tipo di elemento: Fioritura, Iperfioritura, o Fioritura Bruciante: DMG aumentato del 40%. Aggravata o Diffusione: DMG aumentato del 20%.'),

        -- Gambler Set
        ('Gambler''s Flower', '/images/artifact/gambler-flower.png', 'Flower of Life', 'Un fiore fortunato che ha assistito a molti successi sui tavoli da gioco.', 'Skill Elementale DMG +20%', 'Dopo aver sconfitto un nemico, c''è una probabilità del 100% di resettare il tempo di ricarica dell''Abilità Elementale. Può verificarsi una volta ogni 15s.'),
        ('Gambler''s Plume', '/images/artifact/gambler-plume.png', 'Plume of Death', 'Una piuma che porta fortuna al suo possessore durante le scommesse.', 'Skill Elementale DMG +20%', 'Dopo aver sconfitto un nemico, c''è una probabilità del 100% di resettare il tempo di ricarica dell''Abilità Elementale. Può verificarsi una volta ogni 15s.'),
        ('Gambler''s Sands', '/images/artifact/gambler-sands.png', 'Sands of Eon', 'Una clessidra che sembra rallentare nei momenti cruciali di un gioco d''azzardo.', 'Skill Elementale DMG +20%', 'Dopo aver sconfitto un nemico, c''è una probabilità del 100% di resettare il tempo di ricarica dell''Abilità Elementale. Può verificarsi una volta ogni 15s.'),
        ('Gambler''s Goblet', '/images/artifact/gambler-goblet.png', 'Goblet of Eonothem', 'Un calice che porta fortuna al suo possessore durante le scommesse rischiose.', 'Skill Elementale DMG +20%', 'Dopo aver sconfitto un nemico, c''è una probabilità del 100% di resettare il tempo di ricarica dell''Abilità Elementale. Può verificarsi una volta ogni 15s.'),
        ('Gambler''s Circlet', '/images/artifact/gambler-circlet.png', 'Circlet of Logos', 'Un copricapo che nasconde le espressioni del volto durante le partite.', 'Skill Elementale DMG +20%', 'Dopo aver sconfitto un nemico, c''è una probabilità del 100% di resettare il tempo di ricarica dell''Abilità Elementale. Può verificarsi una volta ogni 15s.'),

        -- Gilded Dreams Set
        ('Gilded Dreams Flower', '/images/artifact/gilded-dreams-flower.png', 'Flower of Life', 'Un fiore dorato che emerge dalle profondità dei sogni più luminosi.', 'Maestria Elementale +80', 'Quando attivi una reazione elementale, ottieni un bonus per 8s in base all''elemento dei membri del party. Per ogni stesso elemento: ATK +14%. Per ogni elemento diverso: Maestria Elementale +50. Max 3 bonus per tipo.'),
        ('Gilded Dreams Plume', '/images/artifact/gilded-dreams-plume.png', 'Plume of Death', 'Una piuma che fluttua nei sogni dorati di chi la possiede.', 'Maestria Elementale +80', 'Quando attivi una reazione elementale, ottieni un bonus per 8s in base all''elemento dei membri del party. Per ogni stesso elemento: ATK +14%. Per ogni elemento diverso: Maestria Elementale +50. Max 3 bonus per tipo.'),
        ('Gilded Dreams Sands', '/images/artifact/gilded-dreams-sands.png', 'Sands of Eon', 'Una clessidra che cattura il tempo tra sogno e realtà.', 'Maestria Elementale +80', 'Quando attivi una reazione elementale, ottieni un bonus per 8s in base all''elemento dei membri del party. Per ogni stesso elemento: ATK +14%. Per ogni elemento diverso: Maestria Elementale +50. Max 3 bonus per tipo.'),
        ('Gilded Dreams Goblet', '/images/artifact/gilded-dreams-goblet.png', 'Goblet of Eonothem', 'Un calice dorato traboccante di liquido onirico.', 'Maestria Elementale +80', 'Quando attivi una reazione elementale, ottieni un bonus per 8s in base all''elemento dei membri del party. Per ogni stesso elemento: ATK +14%. Per ogni elemento diverso: Maestria Elementale +50. Max 3 bonus per tipo.'),
        ('Gilded Dreams Circlet', '/images/artifact/gilded-dreams-circlet.png', 'Circlet of Logos', 'Un diadema che porta chi lo indossa nei reami dei sogni dorati.', 'Maestria Elementale +80', 'Quando attivi una reazione elementale, ottieni un bonus per 8s in base all''elemento dei membri del party. Per ogni stesso elemento: ATK +14%. Per ogni elemento diverso: Maestria Elementale +50. Max 3 bonus per tipo.'),

        -- Gladiator's Finale Set
        ('Gladiator''s Finale Flower', '/images/artifact/gladiators-finale-flower.png', 'Flower of Life', 'Un fiore che ha adornato i più grandi combattenti dell''arena.', 'ATK +18%', 'Se il portatore usa Armi a Una Mano, Armi a Due Mani, o Aste, aumenta il DMG dell''Attacco Normale del 35%.'),
        ('Gladiator''s Finale Plume', '/images/artifact/gladiators-finale-plume.png', 'Plume of Death', 'Una piuma di un elmo gladiatorio, simbolo di vittoria e conquista.', 'ATK +18%', 'Se il portatore usa Armi a Una Mano, Armi a Due Mani, o Aste, aumenta il DMG dell''Attacco Normale del 35%.'),
        ('Gladiator''s Finale Sands', '/images/artifact/gladiators-finale-sands.png', 'Sands of Eon', 'Una clessidra che misurava il tempo dei duelli mortali nell''arena.', 'ATK +18%', 'Se il portatore usa Armi a Una Mano, Armi a Due Mani, o Aste, aumenta il DMG dell''Attacco Normale del 35%.'),
        ('Gladiator''s Finale Goblet', '/images/artifact/gladiators-finale-goblet.png', 'Goblet of Eonothem', 'Un calice usato per brindare alle vittorie degli invitti campioni dell''arena.', 'ATK +18%', 'Se il portatore usa Armi a Una Mano, Armi a Due Mani, o Aste, aumenta il DMG dell''Attacco Normale del 35%.'),
        ('Gladiator''s Finale Circlet', '/images/artifact/gladiators-finale-circlet.png', 'Circlet of Logos', 'Una corona donata al più grande gladiatore dell''arena.', 'ATK +18%', 'Se il portatore usa Armi a Una Mano, Armi a Due Mani, o Aste, aumenta il DMG dell''Attacco Normale del 35%.'),

        -- Heart of Depth Set
        ('Heart of Depth Flower', '/images/artifact/heart-of-depth-flower.png', 'Flower of Life', 'Un fiore che prospera nelle profondità abissali dell''oceano.', 'Hydro DMG Bonus +15%', 'Dopo aver usato un''Abilità Elementale, aumenta DMG Attacco Normale e Attacco Caricato del 30% per 15s.'),
        ('Heart of Depth Plume', '/images/artifact/heart-of-depth-plume.png', 'Plume of Death', 'Una piuma di una creatura che vive negli abissi oceanici.', 'Hydro DMG Bonus +15%', 'Dopo aver usato un''Abilità Elementale, aumenta DMG Attacco Normale e Attacco Caricato del 30% per 15s.'),
        ('Heart of Depth Sands', '/images/artifact/heart-of-depth-sands.png', 'Sands of Eon', 'Una clessidra contenente la sabbia delle spiagge più profonde del mare.', 'Hydro DMG Bonus +15%', 'Dopo aver usato un''Abilità Elementale, aumenta DMG Attacco Normale e Attacco Caricato del 30% per 15s.'),
        ('Heart of Depth Goblet', '/images/artifact/heart-of-depth-goblet.png', 'Goblet of Eonothem', 'Un calice recuperato dalle profondità marine, ancora ricolmo di acqua abissale.', 'Hydro DMG Bonus +15%', 'Dopo aver usato un''Abilità Elementale, aumenta DMG Attacco Normale e Attacco Caricato del 30% per 15s.'),
        ('Heart of Depth Circlet', '/images/artifact/heart-of-depth-circlet.png', 'Circlet of Logos', 'Una corona marina creata per il sovrano degli abissi oceanici.', 'Hydro DMG Bonus +15%', 'Dopo aver usato un''Abilità Elementale, aumenta DMG Attacco Normale e Attacco Caricato del 30% per 15s.'),

        
        -- Husk of Opulent Dreams Set
        ('Husk of Opulent Dreams Flower', '/images/artifact/husk-of-opulent-dreams-flower.png', 'Flower of Life', 'Un fiore che porta con sé la memoria di sogni opulenti di ere passate.', 'DEF +30%', 'Un personaggio in campo ottiene 1 stack di Curiosità dopo aver colpito un nemico con un attacco Geo, max 4 stacks. Quando non in campo: guadagna 1 stack ogni 3s, max 4 stacks. Ogni stack fornisce +6% DEF e +6% Geo DMG.'),
        ('Husk of Opulent Dreams Plume', '/images/artifact/husk-of-opulent-dreams-plume.png', 'Plume of Death', 'Una piuma che porta con sé i ricordi di sontuose feste e sogni di grandezza.', 'DEF +30%', 'Un personaggio in campo ottiene 1 stack di Curiosità dopo aver colpito un nemico con un attacco Geo, max 4 stacks. Quando non in campo: guadagna 1 stack ogni 3s, max 4 stacks. Ogni stack fornisce +6% DEF e +6% Geo DMG.'),
        ('Husk of Opulent Dreams Sands', '/images/artifact/husk-of-opulent-dreams-sands.png', 'Sands of Eon', 'Una clessidra che misura i sogni grandiosi del passato che scorrono come sabbia.', 'DEF +30%', 'Un personaggio in campo ottiene 1 stack di Curiosità dopo aver colpito un nemico con un attacco Geo, max 4 stacks. Quando non in campo: guadagna 1 stack ogni 3s, max 4 stacks. Ogni stack fornisce +6% DEF e +6% Geo DMG.'),
        ('Husk of Opulent Dreams Goblet', '/images/artifact/husk-of-opulent-dreams-goblet.png', 'Goblet of Eonothem', 'Un calice ornato che un tempo conteneva i vini più pregiati di feste sontuose.', 'DEF +30%', 'Un personaggio in campo ottiene 1 stack di Curiosità dopo aver colpito un nemico con un attacco Geo, max 4 stacks. Quando non in campo: guadagna 1 stack ogni 3s, max 4 stacks. Ogni stack fornisce +6% DEF e +6% Geo DMG.'),
        ('Husk of Opulent Dreams Circlet', '/images/artifact/husk-of-opulent-dreams-circlet.png', 'Circlet of Logos', 'Una corona che porta con sé la memoria di sogni di opulenza e grandiosità.', 'DEF +30%', 'Un personaggio in campo ottiene 1 stack di Curiosità dopo aver colpito un nemico con un attacco Geo, max 4 stacks. Quando non in campo: guadagna 1 stack ogni 3s, max 4 stacks. Ogni stack fornisce +6% DEF e +6% Geo DMG.'),

        -- Instructor Set
        ('Instructor''s Flower', '/images/artifact/instructor-flower.png', 'Flower of Life', 'Un fiore conservato da un istruttore che ha educato molti studenti alle arti elementali.', 'Maestria Elementale +80', 'Dopo aver innescato una Reazione Elementale, tutti i membri del party guadagnano 120 di Maestria Elementale per 8s.'),
        ('Instructor''s Plume', '/images/artifact/instructor-plume.png', 'Plume of Death', 'Una piuma appartenuta a un maestro delle arti elementali.', 'Maestria Elementale +80', 'Dopo aver innescato una Reazione Elementale, tutti i membri del party guadagnano 120 di Maestria Elementale per 8s.'),
        ('Instructor''s Sands', '/images/artifact/instructor-sands.png', 'Sands of Eon', 'Una clessidra usata da un istruttore per misurare il tempo di allenamento.', 'Maestria Elementale +80', 'Dopo aver innescato una Reazione Elementale, tutti i membri del party guadagnano 120 di Maestria Elementale per 8s.'),
        ('Instructor''s Goblet', '/images/artifact/instructor-goblet.png', 'Goblet of Eonothem', 'Un calice dal quale un maestro versava conoscenza ai suoi allievi.', 'Maestria Elementale +80', 'Dopo aver innescato una Reazione Elementale, tutti i membri del party guadagnano 120 di Maestria Elementale per 8s.'),
        ('Instructor''s Circlet', '/images/artifact/instructor-circlet.png', 'Circlet of Logos', 'Un cappello indossato da saggi istruttori delle arti elementali.', 'Maestria Elementale +80', 'Dopo aver innescato una Reazione Elementale, tutti i membri del party guadagnano 120 di Maestria Elementale per 8s.'),

        -- Lavawalker Set
        ('Lavawalker''s Flower', '/images/artifact/lavawalker-flower.png', 'Flower of Life', 'Un fiore incantato che permette al portatore di camminare sulla lava senza bruciare.', 'Resistenza Pyro +40%', 'Aumenta del 35% il danno inflitto ai nemici affetti da Pyro.'),
        ('Lavawalker''s Plume', '/images/artifact/lavawalker-plume.png', 'Plume of Death', 'Una piuma che non brucia mai, anche quando è immersa nel fuoco più ardente.', 'Resistenza Pyro +40%', 'Aumenta del 35% il danno inflitto ai nemici affetti da Pyro.'),
        ('Lavawalker''s Sands', '/images/artifact/lavawalker-sands.png', 'Sands of Eon', 'Una clessidra contenente sabbie vulcaniche che proteggono dal calore intenso.', 'Resistenza Pyro +40%', 'Aumenta del 35% il danno inflitto ai nemici affetti da Pyro.'),
        ('Lavawalker''s Goblet', '/images/artifact/lavawalker-goblet.png', 'Goblet of Eonothem', 'Un calice che mantiene fresca l''acqua anche nelle fornaci più ardenti.', 'Resistenza Pyro +40%', 'Aumenta del 35% il danno inflitto ai nemici affetti da Pyro.'),
        ('Lavawalker''s Circlet', '/images/artifact/lavawalker-circlet.png', 'Circlet of Logos', 'Un copricapo che protegge chi lo indossa dalle esplosioni di lava più violente.', 'Resistenza Pyro +40%', 'Aumenta del 35% il danno inflitto ai nemici affetti da Pyro.'),

        -- Lucky Dog Set
        ('Lucky Dog''s Flower', '/images/artifact/lucky-dog-flower.png', 'Flower of Life', 'Un fiore portafortuna che ha portato grande fortuna al suo possessore.', 'DEF +100', 'Raccogliendo Mora recupera 300 HP.'),
        ('Lucky Dog''s Plume', '/images/artifact/lucky-dog-plume.png', 'Plume of Death', 'Una piuma portafortuna che ha aiutato il suo possessore in molte situazioni difficili.', 'DEF +100', 'Raccogliendo Mora recupera 300 HP.'),
        ('Lucky Dog''s Sands', '/images/artifact/lucky-dog-sands.png', 'Sands of Eon', 'Una clessidra portafortuna che sembra rallentare il tempo nei momenti difficili.', 'DEF +100', 'Raccogliendo Mora recupera 300 HP.'),
        ('Lucky Dog''s Goblet', '/images/artifact/lucky-dog-goblet.png', 'Goblet of Eonothem', 'Un calice fortunato che spesso si riempie misteriosamente nei momenti di bisogno.', 'DEF +100', 'Raccogliendo Mora recupera 300 HP.'),
        ('Lucky Dog''s Circlet', '/images/artifact/lucky-dog-circlet.png', 'Circlet of Logos', 'Un copricapo che dona al portatore un''incredibile fortuna.', 'DEF +100', 'Raccogliendo Mora recupera 300 HP.'),

        -- Maiden Beloved Set
        ('Maiden Beloved Flower', '/images/artifact/maiden-beloved-flower.png', 'Flower of Life', 'Un fiore che simboleggia la purezza e la devozione di una fanciulla amata.', 'Efficacia di Healing +15%', 'Quando il personaggio usa un''Abilità Elementale o Scoppio, aumenta la Healing ricevuta da tutti i membri del party del 20% per 10s.'),
        ('Maiden Beloved Plume', '/images/artifact/maiden-beloved-plume.png', 'Plume of Death', 'Una piuma che ha catturato la grazia e l''amore di una fanciulla adorata.', 'Efficacia di Healing +15%', 'Quando il personaggio usa un''Abilità Elementale o Scoppio, aumenta la Healing ricevuta da tutti i membri del party del 20% per 10s.'),
        ('Maiden Beloved Sands', '/images/artifact/maiden-beloved-sands.png', 'Sands of Eon', 'Una clessidra che conserva i momenti di amore eterno di una fanciulla pura.', 'Efficacia di Healing +15%', 'Quando il personaggio usa un''Abilità Elementale o Scoppio, aumenta la Healing ricevuta da tutti i membri del party del 20% per 10s.'),
        ('Maiden Beloved Goblet', '/images/artifact/maiden-beloved-goblet.png', 'Goblet of Eonothem', 'Un calice che contiene le lacrime di una fanciulla devota, in grado di curare le ferite.', 'Efficacia di Healing +15%', 'Quando il personaggio usa un''Abilità Elementale o Scoppio, aumenta la Healing ricevuta da tutti i membri del party del 20% per 10s.'),
        ('Maiden Beloved Circlet', '/images/artifact/maiden-beloved-circlet.png', 'Circlet of Logos', 'Una tiara decorata con fiori freschi, simbolo della purezza di una fanciulla.', 'Efficacia di Healing +15%', 'Quando il personaggio usa un''Abilità Elementale o Scoppio, aumenta la Healing ricevuta da tutti i membri del party del 20% per 10s.'),

        -- Martial Artist Set
        ('Martial Artist''s Flower', '/images/artifact/martial-artist-flower.png', 'Flower of Life', 'Un fiore custodito da un artista marziale per ricordare la bellezza nel mezzo delle arti di combattimento.', 'Aumenta il danno da attacco normale e caricato del 15%', 'Dopo aver usato un''Abilità Elementale, aumenta il DMG degli Attacchi Normali e Caricati del 25% per 8s.'),
        ('Martial Artist''s Plume', '/images/artifact/martial-artist-plume.png', 'Plume of Death', 'Una piuma appartenuta a un maestro delle arti marziali, simbolo della leggerezza nei movimenti.', 'Aumenta il danno da attacco normale e caricato del 15%', 'Dopo aver usato un''Abilità Elementale, aumenta il DMG degli Attacchi Normali e Caricati del 25% per 8s.'),
        ('Martial Artist''s Sands', '/images/artifact/martial-artist-sands.png', 'Sands of Eon', 'Una clessidra usata per cronometrare gli allenamenti di un artista marziale.', 'Aumenta il danno da attacco normale e caricato del 15%', 'Dopo aver usato un''Abilità Elementale, aumenta il DMG degli Attacchi Normali e Caricati del 25% per 8s.'),
        ('Martial Artist''s Goblet', '/images/artifact/martial-artist-goblet.png', 'Goblet of Eonothem', 'Un calice dal quale un maestro di arti marziali beveva per recuperare la forza.', 'Aumenta il danno da attacco normale e caricato del 15%', 'Dopo aver usato un''Abilità Elementale, aumenta il DMG degli Attacchi Normali e Caricati del 25% per 8s.'),
        ('Martial Artist''s Circlet', '/images/artifact/martial-artist-circlet.png', 'Circlet of Logos', 'Un copricapo indossato dai maestri delle arti marziali durante i tornei.', 'Aumenta il danno da attacco normale e caricato del 15%', 'Dopo aver usato un''Abilità Elementale, aumenta il DMG degli Attacchi Normali e Caricati del 25% per 8s.'),

        -- Noblesse Oblige Set
        ('Noblesse Oblige Flower', '/images/artifact/noblesse-oblige-flower.png', 'Flower of Life', 'Un fiore che simboleggia lo status e il dovere della nobiltà.', 'Burst DMG +20%', 'Dopo aver utilizzato uno Scoppio Elementale, aumenta l''ATK di tutti i membri del party del 20% per 12s. Questo effetto non è cumulabile.'),
        ('Noblesse Oblige Plume', '/images/artifact/noblesse-oblige-plume.png', 'Plume of Death', 'Una piuma che adornava i copricapi dell''antica nobiltà durante le cerimonie.', 'Burst DMG +20%', 'Dopo aver utilizzato uno Scoppio Elementale, aumenta l''ATK di tutti i membri del party del 20% per 12s. Questo effetto non è cumulabile.'),
        ('Noblesse Oblige Sands', '/images/artifact/noblesse-oblige-sands.png', 'Sands of Eon', 'Una clessidra che ricorda alla nobiltà il loro dovere eterno verso il regno.', 'Burst DMG +20%', 'Dopo aver utilizzato uno Scoppio Elementale, aumenta l''ATK di tutti i membri del party del 20% per 12s. Questo effetto non è cumulabile.'),
        ('Noblesse Oblige Goblet', '/images/artifact/noblesse-oblige-goblet.png', 'Goblet of Eonothem', 'Un calice usato per i brindisi della nobiltà durante le cerimonie più importanti.', 'Burst DMG +20%', 'Dopo aver utilizzato uno Scoppio Elementale, aumenta l''ATK di tutti i membri del party del 20% per 12s. Questo effetto non è cumulabile.'),
        ('Noblesse Oblige Circlet', '/images/artifact/noblesse-oblige-circlet.png', 'Circlet of Logos', 'Una corona che rappresenta il potere e il privilegio della nobiltà antica.', 'Burst DMG +20%', 'Dopo aver utilizzato uno Scoppio Elementale, aumenta l''ATK di tutti i membri del party del 20% per 12s. Questo effetto non è cumulabile.'),

        -- Ocean-Hued Clam Set
        ('Ocean-Hued Clam Flower', '/images/artifact/ocean-hued-clam-flower.png', 'Flower of Life', 'Un fiore che ricorda il colore dell''oceano profondo nelle sue sfumature di turchese.', 'Healing Bonus +15%', 'Quando il personaggio cura, crea una Sea-Dyed Foam che registra la quantità di HP ripristinati (max 30k). Dopo 3 secondi, scoppia infliggendo ai nemici vicini un DMG pari al 90% della quantità registrata.'),
        ('Ocean-Hued Clam Plume', '/images/artifact/ocean-hued-clam-plume.png', 'Plume of Death', 'Una piuma con il colore delle onde dell''oceano, che sembra fluire con grazia.', 'Healing Bonus +15%', 'Quando il personaggio cura, crea una Sea-Dyed Foam che registra la quantità di HP ripristinati (max 30k). Dopo 3 secondi, scoppia infliggendo ai nemici vicini un DMG pari al 90% della quantità registrata.'),
        ('Ocean-Hued Clam Sands', '/images/artifact/ocean-hued-clam-sands.png', 'Sands of Eon', 'Una clessidra che contiene la sabbia degli abissi oceanici, incredibilmente blu e luminosa.', 'Healing Bonus +15%', 'Quando il personaggio cura, crea una Sea-Dyed Foam che registra la quantità di HP ripristinati (max 30k). Dopo 3 secondi, scoppia infliggendo ai nemici vicini un DMG pari al 90% della quantità registrata.'),
        ('Ocean-Hued Clam Goblet', '/images/artifact/ocean-hued-clam-goblet.png', 'Goblet of Eonothem', 'Un calice che sembra contenere l''essenza dell''oceano stesso, cristallino e curativo.', 'Healing Bonus +15%', 'Quando il personaggio cura, crea una Sea-Dyed Foam che registra la quantità di HP ripristinati (max 30k). Dopo 3 secondi, scoppia infliggendo ai nemici vicini un DMG pari al 90% della quantità registrata.'),
        ('Ocean-Hued Clam Circlet', '/images/artifact/ocean-hued-clam-circlet.png', 'Circlet of Logos', 'Una corona fatta di conchiglie e coralli, che porta il potere curativo del mare.', 'Healing Bonus +15%', 'Quando il personaggio cura, crea una Sea-Dyed Foam che registra la quantità di HP ripristinati (max 30k). Dopo 3 secondi, scoppia infliggendo ai nemici vicini un DMG pari al 90% della quantità registrata.'),

        -- Pale Flame Set
        ('Pale Flame Flower', '/images/artifact/pale-flame-flower.png', 'Flower of Life', 'Un fiore che arde con una fiamma pallida, reminiscenza di una volontà indomabile.', 'Physical DMG +25%', 'Quando un''Abilità Elementale colpisce un nemico, l''ATK aumenta del 9% per 7s. Questo effetto può essere impilato fino a 2 volte e può essere attivato una volta ogni 0.3s. Con 2 stacks, il bonus 2 pezzi viene aumentato del 100%.'),
        ('Pale Flame Plume', '/images/artifact/pale-flame-plume.png', 'Plume of Death', 'Una piuma bianca che sembra brillare con una luce eterea, simbolo di grande determinazione.', 'Physical DMG +25%', 'Quando un''Abilità Elementale colpisce un nemico, l''ATK aumenta del 9% per 7s. Questo effetto può essere impilato fino a 2 volte e può essere attivato una volta ogni 0.3s. Con 2 stacks, il bonus 2 pezzi viene aumentato del 100%.'),
        ('Pale Flame Sands', '/images/artifact/pale-flame-sands.png', 'Sands of Eon', 'Una clessidra che contiene sabbia luminosa, come ceneri di una fiamma pallida.', 'Physical DMG +25%', 'Quando un''Abilità Elementale colpisce un nemico, l''ATK aumenta del 9% per 7s. Questo effetto può essere impilato fino a 2 volte e può essere attivato una volta ogni 0.3s. Con 2 stacks, il bonus 2 pezzi viene aumentato del 100%.'),
        ('Pale Flame Goblet', '/images/artifact/pale-flame-goblet.png', 'Goblet of Eonothem', 'Un calice che sembra contenere fuoco bianco, simbolo di una passione che trascende il tempo.', 'Physical DMG +25%', 'Quando un''Abilità Elementale colpisce un nemico, l''ATK aumenta del 9% per 7s. Questo effetto può essere impilato fino a 2 volte e può essere attivato una volta ogni 0.3s. Con 2 stacks, il bonus 2 pezzi viene aumentato del 100%.'),
        ('Pale Flame Circlet', '/images/artifact/pale-flame-circlet.png', 'Circlet of Logos', 'Una corona che emana una luce candida, simbolo di autorità e potere assoluto.', 'Physical DMG +25%', 'Quando un''Abilità Elementale colpisce un nemico, l''ATK aumenta del 9% per 7s. Questo effetto può essere impilato fino a 2 volte e può essere attivato una volta ogni 0.3s. Con 2 stacks, il bonus 2 pezzi viene aumentato del 100%.'),

        -- Resolution of Sojourner Set
        ('Resolution of Sojourner Flower', '/images/artifact/resolution-of-sojourner-flower.png', 'Flower of Life', 'Un fiore raccolto da un viaggiatore durante il suo lungo pellegrinaggio.', 'ATK +18%', 'Aumenta il DMG degli Attacchi Caricati del 30%.'),
        ('Resolution of Sojourner Plume', '/images/artifact/resolution-of-sojourner-plume.png', 'Plume of Death', 'Una piuma che ha accompagnato un viaggiatore attraverso terre sconosciute.', 'ATK +18%', 'Aumenta il DMG degli Attacchi Caricati del 30%.'),
        ('Resolution of Sojourner Sands', '/images/artifact/resolution-of-sojourner-sands.png', 'Sands of Eon', 'Una clessidra che ha misurato i giorni e le notti di un lungo viaggio.', 'ATK +18%', 'Aumenta il DMG degli Attacchi Caricati del 30%.'),
        ('Resolution of Sojourner Goblet', '/images/artifact/resolution-of-sojourner-goblet.png', 'Goblet of Eonothem', 'Un calice usato da un viaggiatore per raccogliere l''acqua da fonti in terre straniere.', 'ATK +18%', 'Aumenta il DMG degli Attacchi Caricati del 30%.'),
        ('Resolution of Sojourner Circlet', '/images/artifact/resolution-of-sojourner-circlet.png', 'Circlet of Logos', 'Un copricapo che ha protetto un viaggiatore dai soli di molti mondi diversi.', 'ATK +18%', 'Aumenta il DMG degli Attacchi Caricati del 30%.'),

        -- Retracing Bolide Set
        ('Retracing Bolide Flower', '/images/artifact/retracing-bolide-flower.png', 'Flower of Life', 'Un fiore che rappresenta la capacità di risorgere dalle ceneri come una meteora.', 'Forza dello Scudo +35%', 'Quando protetto da uno scudo, ottieni un bonus del 40% al DMG degli Attacchi Normali e Caricati.'),
        ('Retracing Bolide Plume', '/images/artifact/retracing-bolide-plume.png', 'Plume of Death', 'Una piuma che ricorda la scia lasciata da un bolide nel cielo notturno.', 'Forza dello Scudo +35%', 'Quando protetto da uno scudo, ottieni un bonus del 40% al DMG degli Attacchi Normali e Caricati.'),
        ('Retracing Bolide Sands', '/images/artifact/retracing-bolide-sands.png', 'Sands of Eon', 'Una clessidra contenente polvere di stelle, reminiscenza della traiettoria di un meteorite.', 'Forza dello Scudo +35%', 'Quando protetto da uno scudo, ottieni un bonus del 40% al DMG degli Attacchi Normali e Caricati.'),
        ('Retracing Bolide Goblet', '/images/artifact/retracing-bolide-goblet.png', 'Goblet of Eonothem', 'Un calice che sembra catturare la luce delle stelle cadenti nel cielo notturno.', 'Forza dello Scudo +35%', 'Quando protetto da uno scudo, ottieni un bonus del 40% al DMG degli Attacchi Normali e Caricati.'),
        ('Retracing Bolide Circlet', '/images/artifact/retracing-bolide-circlet.png', 'Circlet of Logos', 'Una corona modellata come una meteora che attraversa il cielo.', 'Forza dello Scudo +35%', 'Quando protetto da uno scudo, ottieni un bonus del 40% al DMG degli Attacchi Normali e Caricati.'),

        -- Scholar Set
        ('Scholar''s Flower', '/images/artifact/scholar-flower.png', 'Flower of Life', 'Un fiore conservato tra le pagine di un libro antico, simbolo di conoscenza duratura.', 'Ricarica Energia +20%', 'Quando si ottiene una particella elementale, c''è il 50% di possibilità di generare una particella elementale extra per il personaggio. Può verificarsi una volta ogni 3s.'),
        ('Scholar''s Plume', '/images/artifact/scholar-plume.png', 'Plume of Death', 'Una piuma usata come segnalibro da studiosi, impregnata di saggezza.', 'Ricarica Energia +20%', 'Quando si ottiene una particella elementale, c''è il 50% di possibilità di generare una particella elementale extra per il personaggio. Può verificarsi una volta ogni 3s.'),
        ('Scholar''s Sands', '/images/artifact/scholar-sands.png', 'Sands of Eon', 'Una clessidra che ha misurato innumerevoli ore di studio e ricerca.', 'Ricarica Energia +20%', 'Quando si ottiene una particella elementale, c''è il 50% di possibilità di generare una particella elementale extra per il personaggio. Può verificarsi una volta ogni 3s.'),
        ('Scholar''s Goblet', '/images/artifact/scholar-goblet.png', 'Goblet of Eonothem', 'Un calice usato da studiosi durante lunghe notti di studio, spesso riempito di tè o vino.', 'Ricarica Energia +20%', 'Quando si ottiene una particella elementale, c''è il 50% di possibilità di generare una particella elementale extra per il personaggio. Può verificarsi una volta ogni 3s.'),
        ('Scholar''s Circlet', '/images/artifact/scholar-circlet.png', 'Circlet of Logos', 'Un copricapo indossato dagli studiosi più illustri durante le letture pubbliche.', 'Ricarica Energia +20%', 'Quando si ottiene una particella elementale, c''è il 50% di possibilità di generare una particella elementale extra per il personaggio. Può verificarsi una volta ogni 3s.'),

        -- Shimenawa's Reminiscence Set
        ('Shimenawa''s Reminiscence Flower', '/images/artifact/shimenawas-reminiscence-flower.png', 'Flower of Life', 'Un fiore legato con una corda sacra, custode di memorie passate.', 'ATK +18%', 'Quando lanci un''Abilità Elementale, se hai 15 o più Energia, perdi 15 Energia e il DMG degli Attacchi Normali, Caricati e Precipitanti aumenta del 50% per 10s.'),
        ('Shimenawa''s Reminiscence Plume', '/images/artifact/shimenawas-reminiscence-plume.png', 'Plume of Death', 'Una piuma legata con nastri shimenawa, che porta con sé ricordi di cerimonie antiche.', 'ATK +18%', 'Quando lanci un''Abilità Elementale, se hai 15 o più Energia, perdi 15 Energia e il DMG degli Attacchi Normali, Caricati e Precipitanti aumenta del 50% per 10s.'),
        ('Shimenawa''s Reminiscence Sands', '/images/artifact/shimenawas-reminiscence-sands.png', 'Sands of Eon', 'Una clessidra adornata con corde sacre, capace di preservare frammenti di tempo passato.', 'ATK +18%', 'Quando lanci un''Abilità Elementale, se hai 15 o più Energia, perdi 15 Energia e il DMG degli Attacchi Normali, Caricati e Precipitanti aumenta del 50% per 10s.'),
        ('Shimenawa''s Reminiscence Goblet', '/images/artifact/shimenawas-reminiscence-goblet.png', 'Goblet of Eonothem', 'Un calice rituale legato con corde shimenawa, usato per offerte agli dei.', 'ATK +18%', 'Quando lanci un''Abilità Elementale, se hai 15 o più Energia, perdi 15 Energia e il DMG degli Attacchi Normali, Caricati e Precipitanti aumenta del 50% per 10s.'),
        ('Shimenawa''s Reminiscence Circlet', '/images/artifact/shimenawas-reminiscence-circlet.png', 'Circlet of Logos', 'Un diadema cerimoniale decorato con corde shimenawa, indossato durante rituali importanti.', 'ATK +18%', 'Quando lanci un''Abilità Elementale, se hai 15 o più Energia, perdi 15 Energia e il DMG degli Attacchi Normali, Caricati e Precipitanti aumenta del 50% per 10s.'),
        
       -- Tenacity of the Millelith Set
        ('Tenacity of the Millelith Flower', '/images/artifact/tenacity-of-the-millelith-flower.png', 'Flower of Life', 'Un fiore conservato da generazioni di soldati Millelith, simbolo di lealtà e persistenza.', 'HP +20%', 'Quando un''Abilità Elementale colpisce un nemico, l''ATK di tutti i personaggi del party aumenta del 20% e la Forza dello Scudo aumenta del 30% per 3s. Questo effetto può essere attivato ogni 0.5s, anche quando il personaggio non è in campo.'),
        ('Tenacity of the Millelith Plume', '/images/artifact/tenacity-of-the-millelith-plume.png', 'Plume of Death', 'Una piuma dall''elmo di un capitano dei Millelith, simbolo di coraggio e fedeltà.', 'HP +20%', 'Quando un''Abilità Elementale colpisce un nemico, l''ATK di tutti i personaggi del party aumenta del 20% e la Forza dello Scudo aumenta del 30% per 3s. Questo effetto può essere attivato ogni 0.5s, anche quando il personaggio non è in campo.'),
        ('Tenacity of the Millelith Sands', '/images/artifact/tenacity-of-the-millelith-sands.png', 'Sands of Eon', 'Una clessidra che ha misurato secoli di servizio devoto dei Millelith.', 'HP +20%', 'Quando un''Abilità Elementale colpisce un nemico, l''ATK di tutti i personaggi del party aumenta del 20% e la Forza dello Scudo aumenta del 30% per 3s. Questo effetto può essere attivato ogni 0.5s, anche quando il personaggio non è in campo.'),
        ('Tenacity of the Millelith Goblet', '/images/artifact/tenacity-of-the-millelith-goblet.png', 'Goblet of Eonothem', 'Un calice usato nei giuramenti solenni dei Millelith a difesa di Liyue.', 'HP +20%', 'Quando un''Abilità Elementale colpisce un nemico, l''ATK di tutti i personaggi del party aumenta del 20% e la Forza dello Scudo aumenta del 30% per 3s. Questo effetto può essere attivato ogni 0.5s, anche quando il personaggio non è in campo.'),
        ('Tenacity of the Millelith Circlet', '/images/artifact/tenacity-of-the-millelith-circlet.png', 'Circlet of Logos', 'Un elmo indossato dai valorosi Millelith per proteggere Liyue da ogni minaccia.', 'HP +20%', 'Quando un''Abilità Elementale colpisce un nemico, l''ATK di tutti i personaggi del party aumenta del 20% e la Forza dello Scudo aumenta del 30% per 3s. Questo effetto può essere attivato ogni 0.5s, anche quando il personaggio non è in campo.'),

        -- The Exile Set
        ('The Exile Flower', '/images/artifact/the-exile-flower.png', 'Flower of Life', 'Un fiore conservato da un nobile esiliato dalla sua terra natale.', 'Ricarica Energia +20%', 'Quando usi uno Scoppio Elementale, rigenera 2 punti di Energia per tutti i membri del party (eccetto chi indossa il set) ogni 2s per 6s. Questo effetto non può essere impilato.'),
        ('The Exile Plume', '/images/artifact/the-exile-plume.png', 'Plume of Death', 'Una piuma appartenuta a un esule che ha vagato a lungo cercando un nuovo scopo.', 'Ricarica Energia +20%', 'Quando usi uno Scoppio Elementale, rigenera 2 punti di Energia per tutti i membri del party (eccetto chi indossa il set) ogni 2s per 6s. Questo effetto non può essere impilato.'),
        ('The Exile Sands', '/images/artifact/the-exile-sands.png', 'Sands of Eon', 'Una clessidra che ha misurato i giorni solitari di un esule.', 'Ricarica Energia +20%', 'Quando usi uno Scoppio Elementale, rigenera 2 punti di Energia per tutti i membri del party (eccetto chi indossa il set) ogni 2s per 6s. Questo effetto non può essere impilato.'),
        ('The Exile Goblet', '/images/artifact/the-exile-goblet.png', 'Goblet of Eonothem', 'Un calice che ha contenuto sia lacrime che speranze di un nobile bandito.', 'Ricarica Energia +20%', 'Quando usi uno Scoppio Elementale, rigenera 2 punti di Energia per tutti i membri del party (eccetto chi indossa il set) ogni 2s per 6s. Questo effetto non può essere impilato.'),
        ('The Exile Circlet', '/images/artifact/the-exile-circlet.png', 'Circlet of Logos', 'Una corona non più riconosciuta, indossata da chi ha perso il proprio regno.', 'Ricarica Energia +20%', 'Quando usi uno Scoppio Elementale, rigenera 2 punti di Energia per tutti i membri del party (eccetto chi indossa il set) ogni 2s per 6s. Questo effetto non può essere impilato.'),

        -- Thundering Fury Set
        ('Thundering Fury Flower', '/images/artifact/thundering-fury-flower.png', 'Flower of Life', 'Un fiore che pulsa con elettricità, raccolto durante una tempesta violenta.', 'Electro DMG Bonus +15%', 'Aumenta DMG delle reazioni Superconduct, Electro-Charged e Overloaded del 40%. Scatenando queste reazioni elementali, il CD dell''Abilità Elementale si riduce di 1s. Può verificarsi una volta ogni 0.8s.'),
        ('Thundering Fury Plume', '/images/artifact/thundering-fury-plume.png', 'Plume of Death', 'Una piuma carica di elettricità statica, in grado di generare scintille al tocco.', 'Electro DMG Bonus +15%', 'Aumenta DMG delle reazioni Superconduct, Electro-Charged e Overloaded del 40%. Scatenando queste reazioni elementali, il CD dell''Abilità Elementale si riduce di 1s. Può verificarsi una volta ogni 0.8s.'),
        ('Thundering Fury Sands', '/images/artifact/thundering-fury-sands.png', 'Sands of Eon', 'Una clessidra che sembra contenere una tempesta perpetua, sabbia danzante come fulmini.', 'Electro DMG Bonus +15%', 'Aumenta DMG delle reazioni Superconduct, Electro-Charged e Overloaded del 40%. Scatenando queste reazioni elementali, il CD dell''Abilità Elementale si riduce di 1s. Può verificarsi una volta ogni 0.8s.'),
        ('Thundering Fury Goblet', '/images/artifact/thundering-fury-goblet.png', 'Goblet of Eonothem', 'Un calice che sembra catturare e contenere l''energia dei fulmini stessi.', 'Electro DMG Bonus +15%', 'Aumenta DMG delle reazioni Superconduct, Electro-Charged e Overloaded del 40%. Scatenando queste reazioni elementali, il CD dell''Abilità Elementale si riduce di 1s. Può verificarsi una volta ogni 0.8s.'),
        ('Thundering Fury Circlet', '/images/artifact/thundering-fury-circlet.png', 'Circlet of Logos', 'Una corona che scintilla con l''intensità dell''ira celeste, temuta e venerata.', 'Electro DMG Bonus +15%', 'Aumenta DMG delle reazioni Superconduct, Electro-Charged e Overloaded del 40%. Scatenando queste reazioni elementali, il CD dell''Abilità Elementale si riduce di 1s. Può verificarsi una volta ogni 0.8s.'),

        -- Thundersoother Set
        ('Thundersoother''s Flower', '/images/artifact/thundersoother-flower.png', 'Flower of Life', 'Un fiore immune ai fulmini, portato da un leggendario domatore di tempeste.', 'Resistenza Electro +40%', 'Aumenta il DMG contro nemici affetti da Electro del 35%.'),
        ('Thundersoother''s Plume', '/images/artifact/thundersoother-plume.png', 'Plume of Death', 'Una piuma che devia i fulmini, legata al potere di un cacciatore di tempeste.', 'Resistenza Electro +40%', 'Aumenta il DMG contro nemici affetti da Electro del 35%.'),
        ('Thundersoother''s Sands', '/images/artifact/thundersoother-sands.png', 'Sands of Eon', 'Una clessidra che può prevedere l''arrivo delle tempeste, contenente sabbia caricata di elettricità.', 'Resistenza Electro +40%', 'Aumenta il DMG contro nemici affetti da Electro del 35%.'),
        ('Thundersoother''s Goblet', '/images/artifact/thundersoother-goblet.png', 'Goblet of Eonothem', 'Un calice in grado di assorbire l''energia elettrica, usato da chi domava le tempeste.', 'Resistenza Electro +40%', 'Aumenta il DMG contro nemici affetti da Electro del 35%.'),
        ('Thundersoother''s Circlet', '/images/artifact/thundersoother-circlet.png', 'Circlet of Logos', 'Un copricapo appartenuto a chi controllava i fulmini e calmava le tempeste più violente.', 'Resistenza Electro +40%', 'Aumenta il DMG contro nemici affetti da Electro del 35%.'),

        -- Tiny Miracle Set
        ('Tiny Miracle''s Flower', '/images/artifact/tiny-miracle-flower.png', 'Flower of Life', 'Un fiore con proprietà protettive, considerato un portafortuna contro i danni elementali.', 'Tutte le Resistenze Elementali +20%', 'In seguito a un attacco elementale, aumenta la resistenza a quell''elemento del 30% per 10s.'),
        ('Tiny Miracle''s Plume', '/images/artifact/tiny-miracle-plume.png', 'Plume of Death', 'Una piuma che sembra respingere gli attacchi elementali, proteggendo chi la porta.', 'Tutte le Resistenze Elementali +20%', 'In seguito a un attacco elementale, aumenta la resistenza a quell''elemento del 30% per 10s.'),
        ('Tiny Miracle''s Sands', '/images/artifact/tiny-miracle-sands.png', 'Sands of Eon', 'Una clessidra che cambia colore per avvertire della presenza di energia elementale pericolosa.', 'Tutte le Resistenze Elementali +20%', 'In seguito a un attacco elementale, aumenta la resistenza a quell''elemento del 30% per 10s.'),
        ('Tiny Miracle''s Goblet', '/images/artifact/tiny-miracle-goblet.png', 'Goblet of Eonothem', 'Un calice che neutralizza qualsiasi energia elementale nel liquido che contiene.', 'Tutte le Resistenze Elementali +20%', 'In seguito a un attacco elementale, aumenta la resistenza a quell''elemento del 30% per 10s.'),
        ('Tiny Miracle''s Circlet', '/images/artifact/tiny-miracle-circlet.png', 'Circlet of Logos', 'Un copricapo che protegge la mente dagli attacchi elementali più insidiosi.', 'Tutte le Resistenze Elementali +20%', 'In seguito a un attacco elementale, aumenta la resistenza a quell''elemento del 30% per 10s.'),

        -- Traveling Doctor Set
        ('Traveling Doctor''s Flower', '/images/artifact/traveling-doctor-flower.png', 'Flower of Life', 'Un fiore medicinale conservato da un medico itinerante per le sue proprietà curative.', 'Healing ricevuta +20%', 'Quando usi uno Scoppio Elementale, recuperi il 20% degli HP.'),
        ('Traveling Doctor''s Plume', '/images/artifact/traveling-doctor-plume.png', 'Plume of Death', 'Una piuma usata da un medico viaggiatore per scrivere le sue ricette curative.', 'Healing ricevuta +20%', 'Quando usi uno Scoppio Elementale, recuperi il 20% degli HP.'),
        ('Traveling Doctor''s Sands', '/images/artifact/traveling-doctor-sands.png', 'Sands of Eon', 'Una clessidra usata da un dottore per misurare il tempo di assunzione dei medicinali.', 'Healing ricevuta +20%', 'Quando usi uno Scoppio Elementale, recuperi il 20% degli HP.'),
        ('Traveling Doctor''s Goblet', '/images/artifact/traveling-doctor-goblet.png', 'Goblet of Eonothem', 'Un calice usato per mescolare erbe medicinali e pozioni curative.', 'Healing ricevuta +20%', 'Quando usi uno Scoppio Elementale, recuperi il 20% degli HP.'),
        ('Traveling Doctor''s Circlet', '/images/artifact/traveling-doctor-circlet.png', 'Circlet of Logos', 'Un cappello usato da un medico durante i suoi viaggi per portare cure in terre lontane.', 'Healing ricevuta +20%', 'Quando usi uno Scoppio Elementale, recuperi il 20% degli HP.'),

        -- Defender's Will Set
        ('Defender''s Will Flower', '/images/artifact/defenders-will-flower.png', 'Flower of Life', 'Un fiore che simboleggia la determinazione di chi difende i più deboli.', 'DEF +30%', 'Per ogni elemento diverso dal portatore nel party, aumenta la RES Elementale corrispondente del 30%.'),
        ('Defender''s Will Plume', '/images/artifact/defenders-will-plume.png', 'Plume of Death', 'Una piuma simbolo del volo di coloro che sorvegliano e proteggono.', 'DEF +30%', 'Per ogni elemento diverso dal portatore nel party, aumenta la RES Elementale corrispondente del 30%.'),
        ('Defender''s Will Sands', '/images/artifact/defenders-will-sands.png', 'Sands of Eon', 'Una clessidra che misura il tempo che un guardiano è disposto a dedicare alla protezione.', 'DEF +30%', 'Per ogni elemento diverso dal portatore nel party, aumenta la RES Elementale corrispondente del 30%.'),
        ('Defender''s Will Goblet', '/images/artifact/defenders-will-goblet.png', 'Goblet of Eonothem', 'Un calice simbolo del giuramento di difesa di un guardiano.', 'DEF +30%', 'Per ogni elemento diverso dal portatore nel party, aumenta la RES Elementale corrispondente del 30%.'),
        ('Defender''s Will Circlet', '/images/artifact/defenders-will-circlet.png', 'Circlet of Logos', 'Un elmo che ha protetto molti difensori durante le battaglie più dure.', 'DEF +30%', 'Per ogni elemento diverso dal portatore nel party, aumenta la RES Elementale corrispondente del 30%.'),

        -- Vermillion Hereafter Set
        ('Vermillion Hereafter Flower', '/images/artifact/vermillion-hereafter-flower.png', 'Flower of Life', 'Un fiore cremisi che sembra pulsare con l''energia vitale sottratta da altri.', 'ATK +18%', 'Dopo aver usato uno Scoppio Elementale, questo personaggio perde il 10% di HP e poi ottiene l''effetto Vermillion Hereafter: aumenta ATK del 8% per 16s. Quando i suoi HP diminuiscono, ATK aumenta di un ulteriore 10%. Questo aumento può verificarsi al massimo 4 volte. L''effetto termina quando il personaggio esce dal campo.'),
        ('Vermillion Hereafter Plume', '/images/artifact/vermillion-hereafter-plume.png', 'Plume of Death', 'Una piuma rosso sangue, simbolo del sacrificio necessario per ottenere potere.', 'ATK +18%', 'Dopo aver usato uno Scoppio Elementale, questo personaggio perde il 10% di HP e poi ottiene l''effetto Vermillion Hereafter: aumenta ATK del 8% per 16s. Quando i suoi HP diminuiscono, ATK aumenta di un ulteriore 10%. Questo aumento può verificarsi al massimo 4 volte. L''effetto termina quando il personaggio esce dal campo.'),
        ('Vermillion Hereafter Sands', '/images/artifact/vermillion-hereafter-sands.png', 'Sands of Eon', 'Una clessidra che scorre con sabbia rosso cremisi, simbolo di vita che scorre via.', 'ATK +18%', 'Dopo aver usato uno Scoppio Elementale, questo personaggio perde il 10% di HP e poi ottiene l''effetto Vermillion Hereafter: aumenta ATK del 8% per 16s. Quando i suoi HP diminuiscono, ATK aumenta di un ulteriore 10%. Questo aumento può verificarsi al massimo 4 volte. L''effetto termina quando il personaggio esce dal campo.'),
        ('Vermillion Hereafter Goblet', '/images/artifact/vermillion-hereafter-goblet.png', 'Goblet of Eonothem', 'Un calice che sembra contenere sangue vitale, fonte di tremenda potenza.', 'ATK +18%', 'Dopo aver usato uno Scoppio Elementale, questo personaggio perde il 10% di HP e poi ottiene l''effetto Vermillion Hereafter: aumenta ATK del 8% per 16s. Quando i suoi HP diminuiscono, ATK aumenta di un ulteriore 10%. Questo aumento può verificarsi al massimo 4 volte. L''effetto termina quando il personaggio esce dal campo.'),
        ('Vermillion Hereafter Circlet', '/images/artifact/vermillion-hereafter-circlet.png', 'Circlet of Logos', 'Una corona tinta del vermiglio sacrificale, simbolo di potere ottenuto a caro prezzo.', 'ATK +18%', 'Dopo aver usato uno Scoppio Elementale, questo personaggio perde il 10% di HP e poi ottiene l''effetto Vermillion Hereafter: aumenta ATK del 8% per 16s. Quando i suoi HP diminuiscono, ATK aumenta di un ulteriore 10%. Questo aumento può verificarsi al massimo 4 volte. L''effetto termina quando il personaggio esce dal campo.'),

        -- Viridescent Venerer Set
        ('Viridescent Venerer Flower', '/images/artifact/viridescent-venerer-flower.png', 'Flower of Life', 'Un fiore sempre verde raccolto da un cacciatore che venerava la foresta.', 'Anemo DMG Bonus +15%', 'Aumenta Swirl DMG del 60%. Riduce la RES dell''elemento coinvolto nello Swirl del 40% per 10s.'),
        ('Viridescent Venerer Plume', '/images/artifact/viridescent-venerer-plume.png', 'Plume of Death', 'Una piuma verde che fluttua gentilmente con il vento, simbolo di libertà naturale.', 'Anemo DMG Bonus +15%', 'Aumenta Swirl DMG del 60%. Riduce la RES dell''elemento coinvolto nello Swirl del 40% per 10s.'),
        ('Viridescent Venerer Sands', '/images/artifact/viridescent-venerer-sands.png', 'Sands of Eon', 'Una clessidra che misura il tempo eterno della foresta, piena di sabbia verde vivace.', 'Anemo DMG Bonus +15%', 'Aumenta Swirl DMG del 60%. Riduce la RES dell''elemento coinvolto nello Swirl del 40% per 10s.'),
        ('Viridescent Venerer Goblet', '/images/artifact/viridescent-venerer-goblet.png', 'Goblet of Eonothem', 'Un calice che sembra contenere l''essenza dell''aria pura della foresta profonda.', 'Anemo DMG Bonus +15%', 'Aumenta Swirl DMG del 60%. Riduce la RES dell''elemento coinvolto nello Swirl del 40% per 10s.'),
        ('Viridescent Venerer Circlet', '/images/artifact/viridescent-venerer-circlet.png', 'Circlet of Logos', 'Un copricapo intrecciato con foglie fresche, indossato da cacciatori che venerano la natura.', 'Anemo DMG Bonus +15%', 'Aumenta Swirl DMG del 60%. Riduce la RES dell''elemento coinvolto nello Swirl del 40% per 10s.'),

        -- Wanderer's Troupe Set
        ('Wanderer''s Troupe Flower', '/images/artifact/wanderers-troupe-flower.png', 'Flower of Life', 'Un fiore preservato da un musicista itinerante come ricordo dei suoi viaggi.', 'Maestria Elementale +80', 'Aumenta il DMG degli Attacchi Caricati con Arco o Catalizzatore del 35%.'),
        ('Wanderer''s Troupe Plume', '/images/artifact/wanderers-troupe-plume.png', 'Plume of Death', 'Una piuma usata per decorare gli strumenti musicali di un gruppo di trovatori erranti.', 'Maestria Elementale +80', 'Aumenta il DMG degli Attacchi Caricati con Arco o Catalizzatore del 35%.'),
        ('Wanderer''s Troupe Sands', '/images/artifact/wanderers-troupe-sands.png', 'Sands of Eon', 'Una clessidra che ha misurato il tempo di innumerevoli spettacoli di una compagnia di artisti girovaghi.', 'Maestria Elementale +80', 'Aumenta il DMG degli Attacchi Caricati con Arco o Catalizzatore del 35%.'),
        ('Wanderer''s Troupe Goblet', '/images/artifact/wanderers-troupe-goblet.png', 'Goblet of Eonothem', 'Un calice usato per brindisi dopo le performance di successo di una troupe errante.', 'Maestria Elementale +80', 'Aumenta il DMG degli Attacchi Caricati con Arco o Catalizzatore del 35%.'),
        ('Wanderer''s Troupe Circlet', '/images/artifact/wanderers-troupe-circlet.png', 'Circlet of Logos', 'Un cappello ornato usato durante le esibizioni più prestigiose di artisti viaggianti.', 'Maestria Elementale +80', 'Aumenta il DMG degli Attacchi Caricati con Arco o Catalizzatore del 35%.')

    `, (err) => {
        if (err) console.error("Errore durante l'inserimento degli artefatti:", err.message);
    });

    db.run(`

        INSERT INTO statistiche (personaggio, duepezzi, quattropezzi, priorità_fiore, priorità_piuma, priorità_coppa, priorità_calice, priorità_corona, priorità_statistiche) VALUES
        -- Albedo
        (1, 'Husk of Opulent Dreams', 'Husk of Opulent Dreams', 'DEF%', 'DEF%', 'Geo DMG Bonus', 'DEF%', 'CRIT Rate/CRIT DMG', 'DEF%, CRIT Rate, CRIT DMG, Energy Recharge'),
        -- Alhaitham
        (2, 'Gilded Dreams', 'Deepwood Memories', 'Elemental Mastery', 'Elemental Mastery', 'Dendro DMG Bonus', 'Elemental Mastery', 'CRIT Rate/CRIT DMG', 'Elemental Mastery, CRIT Rate, CRIT DMG, ATK%'),
        -- Aloy
        (3, 'Blizzard Strayer', 'Blizzard Strayer', 'ATK%', 'ATK%', 'Cryo DMG Bonus', 'ATK%', 'CRIT Rate/CRIT DMG', 'CRIT Rate, CRIT DMG, ATK%, Energy Recharge'),
        -- Amber
        (4, 'Noblesse Oblige', 'Crimson Witch of Flames', 'ATK%', 'ATK%', 'Pyro DMG Bonus', 'ATK%', 'CRIT Rate/CRIT DMG', 'Energy Recharge, CRIT Rate, CRIT DMG, ATK%'),
        -- Arataki Itto
        (5, 'Husk of Opulent Dreams', 'Husk of Opulent Dreams', 'DEF%', 'DEF%', 'Geo DMG Bonus', 'DEF%', 'CRIT Rate/CRIT DMG', 'DEF%, CRIT Rate, CRIT DMG, Energy Recharge'),
        -- Ayaka
        (6, 'Blizzard Strayer', 'Blizzard Strayer', 'ATK%', 'ATK%', 'Cryo DMG Bonus', 'ATK%', 'CRIT Rate/CRIT DMG', 'CRIT Rate, CRIT DMG, ATK%, Energy Recharge'),
        -- Ayato
        (7, 'Heart of Depth', 'Heart of Depth', 'ATK%', 'ATK%', 'Hydro DMG Bonus', 'ATK%', 'CRIT Rate/CRIT DMG', 'CRIT Rate, CRIT DMG, ATK%, Energy Recharge'),
        -- Baizhu
        (8, 'Deepwood Memories', 'Deepwood Memories', 'HP%', 'HP%', 'Dendro DMG Bonus', 'HP%', 'Healing Bonus', 'HP%, Energy Recharge, Elemental Mastery'),
        -- Barbara
        (9, 'Ocean-Hued Clam', 'Ocean-Hued Clam', 'HP%', 'HP%', 'Healing Bonus', 'HP%', 'HP%', 'HP%, Energy Recharge, Healing Bonus'),
        -- Beidou
        (10, 'Emblem of Severed Fate', 'Emblem of Severed Fate', 'ATK%', 'ATK%', 'Electro DMG Bonus', 'ATK%', 'CRIT Rate/CRIT DMG', 'Energy Recharge, CRIT Rate, CRIT DMG, ATK%'),
        -- Bennett
        (11, 'Noblesse Oblige', 'Noblesse Oblige', 'HP%', 'ATK%', 'Pyro DMG Bonus', 'HP%', 'Healing Bonus', 'Energy Recharge, HP%, ATK%'),
        -- Candace
        (12, 'Tenacity of the Millelith', 'Tenacity of the Millelith', 'HP%', 'HP%', 'Hydro DMG Bonus', 'HP%', 'CRIT Rate/CRIT DMG', 'HP%, Energy Recharge, CRIT Rate, CRIT DMG'),
        -- Charlotte
        (13, 'Blizzard Strayer', 'Blizzard Strayer', 'ATK%', 'ATK%', 'Cryo DMG Bonus', 'ATK%', 'CRIT Rate/CRIT DMG', 'CRIT Rate, CRIT DMG, ATK%, Energy Recharge'),
        -- Chongyun
        (15, 'Blizzard Strayer', 'Blizzard Strayer', 'ATK%', 'ATK%', 'Cryo DMG Bonus', 'ATK%', 'CRIT Rate/CRIT DMG', 'CRIT Rate, CRIT DMG, ATK%, Energy Recharge'),
        -- Collei
        (16, 'Deepwood Memories', 'Deepwood Memories', 'Elemental Mastery', 'Elemental Mastery', 'Dendro DMG Bonus', 'Elemental Mastery', 'CRIT Rate/CRIT DMG', 'Elemental Mastery, CRIT Rate, CRIT DMG, Energy Recharge'),
        -- Cyno
        (17, 'Gilded Dreams', 'Thundering Fury', 'ATK%', 'ATK%', 'Electro DMG Bonus', 'ATK%', 'CRIT Rate/CRIT DMG', 'CRIT Rate, CRIT DMG, ATK%, Elemental Mastery'),
        -- Dehya
        (18, 'Tenacity of the Millelith', 'Emblem of Severed Fate', 'HP%', 'HP%', 'Pyro DMG Bonus', 'HP%', 'CRIT Rate/CRIT DMG', 'HP%, Energy Recharge, CRIT Rate, CRIT DMG'),
        -- Diluc
        (19, 'Crimson Witch of Flames', 'Crimson Witch of Flames', 'ATK%', 'ATK%', 'Pyro DMG Bonus', 'ATK%', 'CRIT Rate/CRIT DMG', 'CRIT Rate, CRIT DMG, ATK%, Energy Recharge'),
        -- Diona
        (20, 'Noblesse Oblige', 'Tenacity of the Millelith', 'HP%', 'HP%', 'Cryo DMG Bonus', 'HP%', 'Healing Bonus', 'HP%, Energy Recharge, CRIT Rate'),
        -- Dori
        (21, 'Emblem of Severed Fate', 'Noblesse Oblige', 'HP%', 'HP%', 'Electro DMG Bonus', 'HP%', 'Healing Bonus', 'Energy Recharge, HP%, CRIT Rate'),
        -- Eula
        (22, 'Pale Flame', 'Pale Flame', 'ATK%', 'ATK%', 'Physical DMG Bonus', 'ATK%', 'CRIT Rate/CRIT DMG', 'CRIT Rate, CRIT DMG, ATK%, Energy Recharge'),
        -- Faruzan
        (23, 'Viridescent Venerer', 'Noblesse Oblige', 'ATK%', 'ATK%', 'Anemo DMG Bonus', 'ATK%', 'CRIT Rate/CRIT DMG', 'Energy Recharge, CRIT Rate, CRIT DMG, ATK%'),
        -- Fischl
        (24, 'Thundering Fury', 'Thundering Fury', 'ATK%', 'ATK%', 'Electro DMG Bonus', 'ATK%', 'CRIT Rate/CRIT DMG', 'CRIT Rate, CRIT DMG, ATK%, Energy Recharge'),
        -- Freminet
        (25, 'Blizzard Strayer', 'Blizzard Strayer', 'ATK%', 'ATK%', 'Cryo DMG Bonus', 'ATK%', 'CRIT Rate/CRIT DMG', 'CRIT Rate, CRIT DMG, ATK%, Energy Recharge'),
        -- Furina
        (26, 'Heart of Depth', 'Noblesse Oblige', 'HP%', 'ATK%', 'Hydro DMG Bonus', 'HP%', 'CRIT Rate/CRIT DMG', 'HP%, Energy Recharge, CRIT Rate, CRIT DMG'),
        -- Ganyu
        (27, 'Blizzard Strayer', 'Blizzard Strayer', 'ATK%', 'ATK%', 'Cryo DMG Bonus', 'ATK%', 'CRIT Rate/CRIT DMG', 'CRIT Rate, CRIT DMG, ATK%, Energy Recharge'),
        -- Gorou
        (28, 'Husk of Opulent Dreams', 'Husk of Opulent Dreams', 'DEF%', 'DEF%', 'Geo DMG Bonus', 'DEF%', 'CRIT Rate/CRIT DMG', 'DEF%, Energy Recharge, CRIT Rate, CRIT DMG'),
        -- Heizou
        (29, 'Viridescent Venerer', 'Viridescent Venerer', 'Elemental Mastery', 'Elemental Mastery', 'Anemo DMG Bonus', 'Elemental Mastery', 'CRIT Rate/CRIT DMG', 'Elemental Mastery, CRIT Rate, CRIT DMG, Energy Recharge'),
        -- Hu Tao
        (30, 'Crimson Witch of Flames', 'Crimson Witch of Flames', 'HP%', 'ATK%', 'Pyro DMG Bonus', 'HP%', 'CRIT Rate/CRIT DMG', 'HP%, CRIT Rate, CRIT DMG, Elemental Mastery'),
        -- Jean
        (31, 'Viridescent Venerer', 'Viridescent Venerer', 'ATK%', 'ATK%', 'Anemo DMG Bonus', 'ATK%', 'Healing Bonus', 'Energy Recharge, ATK%, CRIT Rate, CRIT DMG'),
        -- Kaeya
        (32, 'Blizzard Strayer', 'Blizzard Strayer', 'ATK%', 'ATK%', 'Cryo DMG Bonus', 'ATK%', 'CRIT Rate/CRIT DMG', 'CRIT Rate, CRIT DMG, ATK%, Energy Recharge'),
        -- Kaveh
        (33, 'Gilded Dreams', 'Deepwood Memories', 'Elemental Mastery', 'Elemental Mastery', 'Dendro DMG Bonus', 'Elemental Mastery', 'CRIT Rate/CRIT DMG', 'Elemental Mastery, CRIT Rate, CRIT DMG, Energy Recharge'),
        -- Kazuha
        (34, 'Viridescent Venerer', 'Viridescent Venerer', 'Elemental Mastery', 'Elemental Mastery', 'Elemental Mastery', 'Elemental Mastery', 'Elemental Mastery', 'Elemental Mastery, Energy Recharge, ATK%'),
        -- Keqing
        (35, 'Thundering Fury', 'Thundering Fury', 'ATK%', 'ATK%', 'Electro DMG Bonus', 'ATK%', 'CRIT Rate/CRIT DMG', 'CRIT Rate, CRIT DMG, ATK%, Energy Recharge'),
        -- Kirara
        (36, 'Tenacity of the Millelith', 'Deepwood Memories', 'HP%', 'HP%', 'Dendro DMG Bonus', 'HP%', 'CRIT Rate/CRIT DMG', 'HP%, Energy Recharge, CRIT Rate, CRIT DMG'),
        -- Klee
        (37, 'Crimson Witch of Flames', 'Crimson Witch of Flames', 'ATK%', 'ATK%', 'Pyro DMG Bonus', 'ATK%', 'CRIT Rate/CRIT DMG', 'CRIT Rate, CRIT DMG, ATK%, Energy Recharge'),
        -- Kokomi
        (38, 'Ocean-Hued Clam', 'Ocean-Hued Clam', 'HP%', 'HP%', 'Healing Bonus', 'HP%', 'HP%', 'HP%, Energy Recharge, Healing Bonus'),
        -- Kuki Shinobu
        (39, 'Tenacity of the Millelith', 'Gilded Dreams', 'HP%', 'HP%', 'Electro DMG Bonus', 'HP%', 'Healing Bonus', 'HP%, Energy Recharge, Elemental Mastery'),
        -- Lisa
        (41, 'Thundering Fury', 'Thundering Fury', 'ATK%', 'ATK%', 'Electro DMG Bonus', 'ATK%', 'CRIT Rate/CRIT DMG', 'CRIT Rate, CRIT DMG, ATK%, Energy Recharge'),
        -- Lynette
        (42, 'Viridescent Venerer', 'Viridescent Venerer', 'Elemental Mastery', 'Elemental Mastery', 'Anemo DMG Bonus', 'Elemental Mastery', 'CRIT Rate/CRIT DMG', 'Elemental Mastery, Energy Recharge, ATK%'),
        -- Lyney
        (43, 'Crimson Witch of Flames', 'Shimenawa''s Reminiscence', 'ATK%', 'ATK%', 'Pyro DMG Bonus', 'ATK%', 'CRIT Rate/CRIT DMG', 'CRIT Rate, CRIT DMG, ATK%, Energy Recharge'),
        -- Mika
        (44, 'Noblesse Oblige', 'Tenacity of the Millelith', 'HP%', 'HP%', 'Cryo DMG Bonus', 'HP%', 'Healing Bonus', 'HP%, Energy Recharge, CRIT Rate'),
        -- Mona
        (45, 'Emblem of Severed Fate', 'Emblem of Severed Fate', 'ATK%', 'ATK%', 'Hydro DMG Bonus', 'ATK%', 'CRIT Rate/CRIT DMG', 'Energy Recharge, CRIT Rate, CRIT DMG, ATK%'),
        -- Neuvillette
        (48, 'Heart of Depth', 'Heart of Depth', 'HP%', 'ATK%', 'Hydro DMG Bonus', 'HP%', 'CRIT Rate/CRIT DMG', 'HP%, Energy Recharge, CRIT Rate, CRIT DMG'),
        -- Nilou
        (49, 'Tenacity of the Millelith', 'Gilded Dreams', 'HP%', 'HP%', 'Hydro DMG Bonus', 'HP%', 'CRIT Rate/CRIT DMG', 'HP%, Energy Recharge, Elemental Mastery'),
        -- Ningguang
        (50, 'Archaic Petra', 'Archaic Petra', 'ATK%', 'ATK%', 'Geo DMG Bonus', 'ATK%', 'CRIT Rate/CRIT DMG', 'CRIT Rate, CRIT DMG, ATK%, Energy Recharge'),
        -- Noelle
        (51, 'Husk of Opulent Dreams', 'Husk of Opulent Dreams', 'DEF%', 'DEF%', 'Geo DMG Bonus', 'DEF%', 'CRIT Rate/CRIT DMG', 'DEF%, CRIT Rate, CRIT DMG, Energy Recharge'),
        -- Qiqi
        (52, 'Ocean-Hued Clam', 'Ocean-Hued Clam', 'HP%', 'HP%', 'Healing Bonus', 'HP%', 'HP%', 'HP%, Energy Recharge, Healing Bonus'),
        -- Raiden Shogun
        (53, 'Emblem of Severed Fate', 'Emblem of Severed Fate', 'ATK%', 'ATK%', 'Electro DMG Bonus', 'ATK%', 'CRIT Rate/CRIT DMG', 'Energy Recharge, CRIT Rate, CRIT DMG, ATK%'),
        -- Razor
        (54, 'Pale Flame', 'Pale Flame', 'ATK%', 'ATK%', 'Physical DMG Bonus', 'ATK%', 'CRIT Rate/CRIT DMG', 'CRIT Rate, CRIT DMG, ATK%, Energy Recharge'),
        -- Rosaria
        (55, 'Blizzard Strayer', 'Blizzard Strayer', 'ATK%', 'ATK%', 'Cryo DMG Bonus', 'ATK%', 'CRIT Rate/CRIT DMG', 'CRIT Rate, CRIT DMG, ATK%, Energy Recharge'),
        -- Kujou Sara
        (56, 'Emblem of Severed Fate', 'Noblesse Oblige', 'ATK%', 'ATK%', 'Electro DMG Bonus', 'ATK%', 'CRIT Rate/CRIT DMG', 'Energy Recharge, CRIT Rate, CRIT DMG, ATK%'),
        -- Sayu
        (57, 'Viridescent Venerer', 'Viridescent Venerer', 'Elemental Mastery', 'Elemental Mastery', 'Anemo DMG Bonus', 'Elemental Mastery', 'Healing Bonus', 'Elemental Mastery, Energy Recharge, HP%'),
        -- Shenhe
        (58, 'Gladiator''s Finale', 'Blizzard Strayer', 'ATK%', 'ATK%', 'Cryo DMG Bonus', 'ATK%', 'CRIT Rate/CRIT DMG', 'ATK%, CRIT Rate, CRIT DMG, Energy Recharge'),
        -- Sucrose
        (59, 'Viridescent Venerer', 'Viridescent Venerer', 'Elemental Mastery', 'Elemental Mastery', 'Elemental Mastery', 'Elemental Mastery', 'Elemental Mastery', 'Elemental Mastery, Energy Recharge, ATK%'),
        -- Tartaglia (Childe)
        (60, 'Heart of Depth', 'Heart of Depth', 'ATK%', 'ATK%', 'Hydro DMG Bonus', 'ATK%', 'CRIT Rate/CRIT DMG', 'CRIT Rate, CRIT DMG, ATK%, Energy Recharge'),
        -- Thoma
        (61, 'Tenacity of the Millelith', 'Emblem of Severed Fate', 'HP%', 'HP%', 'Pyro DMG Bonus', 'HP%', 'CRIT Rate/CRIT DMG', 'HP%, Energy Recharge, CRIT Rate, CRIT DMG'),
        -- Tighnari
        (62, 'Gilded Dreams', 'Deepwood Memories', 'Elemental Mastery', 'Elemental Mastery', 'Dendro DMG Bonus', 'Elemental Mastery', 'CRIT Rate/CRIT DMG', 'Elemental Mastery, CRIT Rate, CRIT DMG, Energy Recharge'),
        -- Venti
        (70, 'Viridescent Venerer', 'Viridescent Venerer', 'Elemental Mastery', 'Elemental Mastery', 'Anemo DMG Bonus', 'Elemental Mastery', 'CRIT Rate/CRIT DMG', 'Elemental Mastery, Energy Recharge, ATK%'),
        -- Wanderer
        (71, 'Desert Pavilion Chronicle', 'Shimenawa''s Reminiscence', 'ATK%', 'ATK%', 'Anemo DMG Bonus', 'ATK%', 'CRIT Rate/CRIT DMG', 'CRIT Rate, CRIT DMG, ATK%, Energy Recharge'),
        -- Wriothesley
        (72, 'Blizzard Strayer', 'Blizzard Strayer', 'ATK%', 'ATK%', 'Cryo DMG Bonus', 'ATK%', 'CRIT Rate/CRIT DMG', 'CRIT Rate, CRIT DMG, ATK%, Energy Recharge'),
        -- Xiangling
        (73, 'Emblem of Severed Fate', 'Crimson Witch of Flames', 'ATK%', 'ATK%', 'Pyro DMG Bonus', 'ATK%', 'CRIT Rate/CRIT DMG', 'Energy Recharge, CRIT Rate, CRIT DMG, ATK%'),
        -- Xiao
        (74, 'Vermillion Hereafter', 'Gladiator''s Finale', 'ATK%', 'ATK%', 'Anemo DMG Bonus', 'ATK%', 'CRIT Rate/CRIT DMG', 'CRIT Rate, CRIT DMG, ATK%, Energy Recharge'),
        -- Xingqiu
        (75, 'Emblem of Severed Fate', 'Noblesse Oblige', 'ATK%', 'ATK%', 'Hydro DMG Bonus', 'ATK%', 'CRIT Rate/CRIT DMG', 'Energy Recharge, CRIT Rate, CRIT DMG, ATK%'),
        -- Xinyan
        (76, 'Retracing Bolide', 'Retracing Bolide', 'DEF%', 'ATK%', 'Physical DMG Bonus', 'DEF%', 'CRIT Rate/CRIT DMG', 'DEF%, CRIT Rate, CRIT DMG, Energy Recharge'),
        -- Yae Miko
        (77, 'Gilded Dreams', 'Thundering Fury', 'ATK%', 'ATK%', 'Electro DMG Bonus', 'ATK%', 'CRIT Rate/CRIT DMG', 'CRIT Rate, CRIT DMG, ATK%, Energy Recharge'),
        -- Yanfei
        (78, 'Crimson Witch of Flames', 'Wanderer''s Troupe', 'ATK%', 'ATK%', 'Pyro DMG Bonus', 'ATK%', 'CRIT Rate/CRIT DMG', 'CRIT Rate, CRIT DMG, ATK%, Energy Recharge'),
        -- Yaoyao
        (79, 'Deepwood Memories', 'Tenacity of the Millelith', 'HP%', 'HP%', 'Dendro DMG Bonus', 'HP%', 'Healing Bonus', 'HP%, Energy Recharge, Elemental Mastery'),
        -- Yelan
        (80, 'Emblem of Severed Fate', 'Noblesse Oblige', 'HP%', 'HP%', 'Hydro DMG Bonus', 'HP%', 'CRIT Rate/CRIT DMG', 'HP%, Energy Recharge, CRIT Rate, CRIT DMG'),
        -- Yoimiya
        (81, 'Shimenawa''s Reminiscence', 'Crimson Witch of Flames', 'ATK%', 'ATK%', 'Pyro DMG Bonus', 'ATK%', 'CRIT Rate/CRIT DMG', 'CRIT Rate, CRIT DMG, ATK%, Energy Recharge'),
        -- Yun Jin
        (82, 'Husk of Opulent Dreams', 'Husk of Opulent Dreams', 'DEF%', 'DEF%', 'Geo DMG Bonus', 'DEF%', 'CRIT Rate/CRIT DMG', 'DEF%, Energy Recharge, CRIT Rate, CRIT DMG'),
        -- Zhongli
        (83, 'Tenacity of the Millelith', 'Archaic Petra', 'HP%', 'HP%', 'Geo DMG Bonus', 'HP%', 'CRIT Rate/CRIT DMG', 'HP%, Energy Recharge, CRIT Rate, CRIT DMG'),
        -- Chiori
        (84, 'Husk of Opulent Dreams', 'Archaic Petra', 'DEF%', 'DEF%', 'Geo DMG Bonus', 'DEF%', 'CRIT Rate/CRIT DMG', 'DEF%, CRIT Rate, CRIT DMG, Energy Recharge'),
        -- Clorinde
        (86, 'Thundering Fury', 'Gladiator''s Finale', 'ATK%', 'ATK%', 'Electro DMG Bonus', 'ATK%', 'CRIT Rate/CRIT DMG', 'CRIT Rate, CRIT DMG, ATK%, Energy Recharge'),
        -- Sigewinne
        (87, 'Ocean-Hued Clam', 'Tenacity of the Millelith', 'HP%', 'HP%', 'Healing Bonus', 'HP%', 'HP%', 'HP%, Energy Recharge, Healing Bonus'),
        -- Sethos
        (89, 'Thundering Fury', 'Gilded Dreams', 'ATK%', 'ATK%', 'Electro DMG Bonus', 'ATK%', 'CRIT Rate/CRIT DMG', 'CRIT Rate, CRIT DMG, ATK%, Energy Recharge')

    `, (err) => {
        if (err) console.error("Errore durante l'inserimento delle statistiche:", err.message);
    });
    db.run(`

            CREATE TABLE IF NOT EXISTS gilda (

                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome_gilda TEXT NOT NULL,
                limite_partecipanti INTEGER NOT NULL,
                descrizione_gilda TEXT NOT NULL,
                lingua TEXT NOT NULL
            );
        `, (err) => {
            if (err) console.error("Errore durante la creazione della tabella gilde:", err.message);
        });

    db.run(`

    INSERT INTO gilda (nome_gilda, limite_partecipanti, descrizione_gilda, lingua)
    VALUES
        ('Cavalieri di Mondstadt', 50, 'Proteggiamo Mondstadt con onore e giustizia.', 'italiano'),
        ('Knights of Freedom', 60, 'Defenders of Mondstadt, guided by the wind of freedom.', 'inglese'),
        ('稲妻の守護者 (Inazuma no Shugosha)', 40, '永遠を追い求める稲妻の忠実な守護者。', 'giapponese'),
        ('璃月守护者 (Lìyuè Shǒuhùzhě)', 70, '守护璃月的繁荣与传统。', 'cinese'),
        ('리월의 수호자 (Liweol-ui Suhoja)', 55, '리월의 번영과 문화를 지키는 자들.', 'coreano')
        
    `, (err) => {
        if (err) console.error("Errore durante l'inserimento delle gilde", err.message);
    });

    db.run(`
        CREATE TABLE IF NOT EXISTS utentiGilda (
            id_utente INTEGER NOT NULL,
            id_gilda INTEGER NOT NULL,
            ruolo TEXT NOT NULL DEFAULT 'membro',
            FOREIGN KEY(id_utente) REFERENCES utenti(id) ON DELETE CASCADE ON UPDATE CASCADE,
            FOREIGN KEY(id_gilda) REFERENCES gilda(id) ON DELETE CASCADE ON UPDATE CASCADE
        );
    `, (err) => {
        if (err) console.error("Errore durante la creazione della tabella utentiGilda:", err.message);
    });
    db.run(`
        INSERT INTO utentiGilda (id_utente, id_gilda, ruolo)
        VALUES
            (1, 1, 'leader'),
            (2, 2, 'leader'),           
            (3, 1, 'membro'),
            (4, 1, 'membro'),
            (5, 2, 'membro')

    `, (err) => {
        if (err) console.error("Errore durante l'inserimento degli utenti nella gilda:", err.message);
    });
});





