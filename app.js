'use strict';

//librerie
const express = require('express');
const session = require('express-session');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const passport = require('passport'); // Aggiunta questa importazione
const LocalStrategy = require('passport-local').Strategy; // Aggiunta questa importazione
const flash = require('connect-flash'); // Aggiunta per gestire i messaggi flash


const port = 8000;
const app = express();

// Configurazione session
app.use(session({
    secret: 'supersecretkey',
    resave: false,
    saveUninitialized: false
}));

// Inizializzazione Passport
app.use(passport.initialize());
app.use(passport.session());

// Database
const db = new sqlite3.Database('./genshin.db', (err) => {
    if (err) {
        console.error('Errore nel collegamento al database:', err.message);
    } else {
        console.log('Connesso al database');
    }
});
// Funzione helper per trovare un utente per username
function trovaUtenteNelDB(username) {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM utenti WHERE username = ?', [username], (err, row) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
}

// Funzione helper per trovare un utente per email
function trovaUtenteDaEmailNelDB(mail) {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM utenti WHERE mail = ?', [mail], (err, row) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
}

// Configurazione strategia Local di Passport
passport.use(new LocalStrategy(
    { usernameField: 'email' }, // Questo specifica che il campo del form è 'email'
    async (email, password, done) => {
        try {
            const user = await trovaUtenteDaEmailNelDB(email);
            if (!user) return done(null, false, { message: 'Email non trovata' });
            
            const match = await bcrypt.compare(password, user.password);
            if (!match) return done(null, false, { message: 'Password non corretta' });
            
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));


// Serializzazione dell'utente (cosa salvare nella sessione)
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserializzazione dell'utente (recupero dai dati di sessione)
passport.deserializeUser((id, done) => {
    db.get('SELECT id, username, mail, ruolo FROM utenti WHERE id = ?', [id], (err, user) => {
        done(err, user);
    });
});


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(flash()); // Aggiunta per gestire i messaggi flash

// Middleware per passare l'utente autenticato ai template
app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

// Middleware per verificare se l'utente è autenticato
function isLogged(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'Devi effettuare l\'accesso');
    res.redirect('/accedi');
}
function isNotLogged(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'Sei già loggato');
    res.redirect('/');
}

// Middleware per verificare se l'utente è amministratore
function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.ruolo === 'admin') {
        return next();
    }
    req.flash('error', 'Accesso non autorizzato');
    res.redirect('/');
}

// Route base
app.get('/', (req, res) => {
    res.render('index');
});

// Routes di autenticazione
app.get('/registrati', isNotLogged, (req, res) => {
    res.render('registrati');
});

app.post('/registrati', isNotLogged, async (req, res) => {
    try {
        console.log('Tentativo di registrazione:', req.body);
        const { username, email, password } = req.body;
        
        // Verifica campi obbligatori
        if (!username || !email || !password) {
            console.log('Dati mancanti nel form');
            req.flash('error', 'Tutti i campi sono obbligatori');
            return res.redirect('/registrati');
        }
        
        // Verifica username già esistente
        const userByUsername = await trovaUtenteNelDB(username);
        if (userByUsername) {
            req.flash('error', 'Username già in uso');
            return res.redirect('/registrati');
        }
        
        // Verifica email già esistente
        const userByEmail = await trovaUtenteDaEmailNelDB(email);
        if (userByEmail) {
            req.flash('error', 'Email già in uso');
            return res.redirect('/registrati');
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Salva nuovo utente
        console.log('Inserisco nuovo utente nel database');
        db.run('INSERT INTO utenti (username, mail, password) VALUES (?, ?, ?)', 
            [username, email, hashedPassword], function(err) {
                if (err) {
                    console.error('Errore inserimento:', err.message);
                    req.flash('error', 'Errore durante la registrazione: ' + err.message);
                    return res.redirect('/registrati');
                }
                
                console.log('Utente inserito con ID:', this.lastID);
                // Login automatico dopo registrazione
                const newUser = { id: this.lastID, username, mail: email, ruolo: 'utente' };
                req.login(newUser, (err) => {
                    if (err) {
                        req.flash('error', 'errore durante il login automatico');
                        return res.redirect('/accedi');
                    }
                    req.flash('success', 'Registrazione completata con successo!');
                    res.redirect('/'); 
                });
                
            }
        );
    } catch (err) {
        console.error('Eccezione durante la registrazione:', err);
        req.flash('error', 'Errore del server: ' + err.message);
        res.redirect('/registrati');
    }
});

app.get('/logout', isLogged, (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success', 'Logout effettuato con successo');
        res.redirect('/');
    });
});

app.get('/accedi', isNotLogged, (req, res) => {
    res.render('accedi');
});

app.post('/accedi', isNotLogged, (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/accedi',
        failureFlash: true,
        successFlash: 'Accesso effettuato con successo!'
    })(req, res, next);
});

app.get('/logout', isLogged, (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash('success', 'Logout effettuato con successo');
        res.redirect('/');
    });
});

// Rotta profilo protetta da autenticazione
app.get('/profilo', isLogged, (req, res) => {
    res.render('profilo');
})

app.get('/artefatti', (req, res) => {

    let sql = 'SELECT * FROM artefatti';
    let filtro = [];

    if (req.query.classe) { //controllo se l'utente ha selezionato un elemento
        sql += ' WHERE categoria = ?';
        filtro.push(req.query.classe); //aggiungo il filtro per elemento alla query
    }

    if (req.query.nome) { //controllo se l'utente ha selezionato un elemento
        sql += ' WHERE nome like ?'; //aggiungo l'ordinamento per nome
        filtro.push(req.query.nome+'%'); //aggiungo l'elemento alla lista dei nomi;
    }

    db.all(sql, filtro, (err, rows) => { //rows sono i dati restituiti dalla query
        if (err) {
            throw err;
        }
        res.render('artefatti', { artefatti: rows });
    });
});


app.get('/personaggi', (req, res) => {

    let sql = 'SELECT * FROM personaggi';
    let filtro = [];
    
    if (req.query.elemento) { //controllo se l'utente ha selezionato un elemento
        sql += ' WHERE elemento = ?';
        filtro.push(req.query.elemento); //aggiungo il filtro per elemento alla query
    }

    if (req.query.nome) { //controllo se l'utente ha selezionato un elemento
        sql += ' WHERE nome like ?'; //aggiungo l'ordinamento per nome
        filtro.push(req.query.nome+'%'); //aggiungo l'elemento alla lista dei nomi
    }

    db.all(sql, filtro, (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Errore del server');
        }
        res.render('personaggi', { personaggi: rows });
    });

});

app.get('/build', (req, res) => {

    let sql = ' SELECT * FROM personaggi p INNER JOIN statistiche s ON p.id = s.personaggio';

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Errore del server');
        }
        res.render('build', { statistiche: rows });
    });
});

app.listen(port, '127.0.0.1', () => { //route principale per avviare l'app
    console.log(`http://localhost:${port}`);
});