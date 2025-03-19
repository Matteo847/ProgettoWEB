const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('perfectsushi.db', (err) => {
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

});

