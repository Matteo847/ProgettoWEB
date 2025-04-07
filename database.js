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
        CREATE TABLE IF NOT EXISTS utenti (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            mail TEXT UNIQUE,
            nome TEXT,
            cognome TEXT,
            password TEXT NOT NULL,
            ruolo TEXT DEFAULT 'utente'
        );
    `, (err) => {
        if (err) console.error("Errore durante la creazione della tabella utenti:", err.message);
    });
    db.run(`
        CREATE TABLE IF NOT EXISTS personaggi (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            immagine TEXT NOT NULL,
            elemento TEXT NOT NULL,
            rarità TINYINT NOT NULL
        );
    `, (err) => {
        if (err) console.error("Errore durante la creazione della tabella utenti:", err.message);
    });

    db.run(`
        CREATE TABLE IF NOT EXISTS artefatti (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            immagine TEXT NOT NULL
        );
    `, (err) => {
        if (err) console.error("Errore durante la creazione della tabella utenti:", err.message);
    });
    db.run(`
        INSERT INTO "personaggi" ("id", "nome", "immagine", "elemento", "rarità") VALUES
        (1, 'xingqiu', '/images/personaggi/xingqiu.png', 'hydro', 4),
        (2, 'raiden shogun', '/images/personaggi/raiden-shogun.png', 'electro', 5),
        (3, 'ayaka', '/images/personaggi/ayaka.png', 'cryo', 5),
        (4, 'kazuha', '/images/personaggi/kazuha.png', 'anemo', 5),
        (5, 'lynette', '/images/personaggi/lynette.png', 'anemo', 4),
        (6, 'baizhu', '/images/personaggi/baizhu.png', 'dendro', 5),
        (7, 'arlecchino', '/images/personaggi/arlecchino.png', 'pyro', 5),
        (8, 'diluc', '/images/personaggi/diluc.png', 'pyro', 5),
        (9, 'kaeya', '/images/personaggi/kaeya.png', 'cryo', 4),
        (10, 'clorinde', '/images/personaggi/clorinde.png', 'electro', 5),
        (11, 'kokomi', '/images/personaggi/kokomi.png', 'hydro', 5),
        (12, 'alhaitam', '/images/personaggi/alhaitam.png', 'dendro', 5),
        (13, 'yanfei', '/images/personaggi/yanfai.png', 'pyro', 4),
        (14, 'barbara', '/images/personaggi/barbara.png', 'hydro', 4),
        (15, 'ganyu', '/images/personaggi/ganyu.png', 'cryo', 5),
        (16, 'venti', '/images/personaggi/venti.png', 'anemo', 5),
        (17, 'klee', '/images/personaggi/klee.png', 'pyro', 5);

    `, (err) => {
        if (err) console.error("Errore durante la creazione della tabella utenti:", err.message);
    });
    db.run(`
       INSERT INTO "artefatti" ("id", "nome", "immagine") VALUES
        (1, 'veridesent', '/images/veridesent.png'),
        (2, 'crimson witch', '/images/crimson.png'),
        (3, 'fracment armonic', '/images/fracment.png'),
        (4, 'emblem', '/images/emblem.png'),
        (5, 'blizzard strayer', '/images/blizzard-strayer.png'),
        (6, 'ocean clam', '/images/ocean-hued-clam.png'),
        (7, 'dream flower', '/images/dreams-flower.png');
    `, (err) => {
        if (err) console.error("Errore durante la creazione della tabella utenti:", err.message);
    });
});

