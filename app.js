'use strict';

//librerie
const express = require('express');
const session = require('express-session');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const port = 8000;
const app = express();

app.use(session({
    secret: 'supersecretkey',
    resave: false,
    saveUninitialized: false
}));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = new sqlite3.Database('./genshin.db', (err) => {
    if (err) {
        console.error('Errore nel collegamento al database:', err.message);
    } else {
        console.log('Connesso al database');
    }
});

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/registrati', (req, res) => {
    res.render('registrati');
});

app.get('/artefatti', (req, res) => {
    let sql = 'SELECT * FROM artefatti';
    db.all(sql, [], (err, rows) => { //rows sono i dati restituiti dalla query
        if (err) {
            throw err;
        }
        res.render('artefatti', { artefatti: rows });
    });
});
app.listen(port, '127.0.0.1', () => { //route principale per avviare l'app
    console.log(`http://localhost:${port}`);
});

app.get('/personaggi', (req, res) => {
    let sql = 'SELECT * FROM personaggi';
    let elemento = [];
    
    if (req.query.elemento) { //controllo se l'utente ha selezionato un elemento
        sql += ' WHERE elemento = ?';
        elemento.push(req.query.elemento); //aggiungo il filtro per elemento alla query
    }
    
    db.all(sql, elemento, (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Errore del server');
        }
        res.render('personaggi', { personaggi: rows });
    });
});