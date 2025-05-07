'use strict';

//librerie
const express = require('express');
const session = require('express-session');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');


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

const db = new sqlite3.Database('./genshin.db', (err) => {//assegna alla variabile db un nuovo database sqlite3
    if (err) {
        console.error('Errore nel collegamento al database:', err.message);
    } else {
        console.log('Connesso al database');
    }
});
// Funzione per trovare un utente tramite username
function trovaUtenteNelDB(username) {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM utenti WHERE username = ?', [username], (err, row) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
}

// Funzione per trovare un utente tramite email
function trovaUtenteDaEmailNelDB(mail) {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM utenti WHERE mail = ?', [mail], (err, row) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
}


passport.use(new LocalStrategy(
    { usernameField: 'email' },
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


passport.serializeUser((user, done) => { // Serializza l'utente per la sessione
    done(null, user.id);
});


passport.deserializeUser((id, done) => { // Deserializza l'utente dalla sessione
    db.get('SELECT id, username, mail, ruolo FROM utenti WHERE id = ?', [id], (err, user) => {
        done(err, user);
    });
});


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(flash());

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

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/registrati', isNotLogged, (req, res) => {
    res.render('registrati');
});

app.post('/registrati', isNotLogged, async (req, res) => {
    try {
        console.log('Tentativo di registrazione:', req.body);
        const { username, email, password } = req.body;
        
        // Verifica che i campi vengano inseriti 
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
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Salva nuovo utente
        console.log('Inserisco nuovo utente nel database');
        db.run('INSERT INTO utenti (username, mail, password) VALUES (?, ?, ?)', [username, email, hashedPassword], function(err) {
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

app.get('/armi', isNotLogged, (req, res) => {

    let sql = 'SELECT * FROM armi';

    db.all(sql, [], (err, tabella) => { //cambiare rows in tabella per evitare confusione con la variabile di sopra
        if (err) {
            throw err;
        }
        res.render('armi', { armi: tabella});
    });
});

app.post('/accedi', isNotLogged, (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/accedi',
        failureFlash: true,
        successFlash: 'Accesso effettuato con successo!'
    })(req, res, next);
});

app.get('/profilo', isLogged, (req, res) => {
    if (req.query.avatarSelezionato) {
        let avatarSelezionato = req.query.avatarSelezionato;
        db.run('UPDATE utenti SET avatar = ? WHERE id = ?', [avatarSelezionato, req.user.id], function(err) {
            if (err) {
                req.flash('error', 'Errore durante l\'aggiornamento dell\'avatar: ' + err.message);
                return res.redirect('/profilo');
            }
            req.flash('success', 'Avatar aggiornato con successo!');
            return res.redirect('/profilo');
        });
    }

    db.all('SELECT * FROM avatar', [], (err, avatars) => {
        if (err) {
            throw err;
        }
        console.log('avatar:', avatars);

        db.get('SELECT * FROM utenti u INNER JOIN avatar a ON u.avatar = a.id', [], (err, utenti) => {
            if (err) {
                throw err;
            }
            console.log('utenti:', utenti);
            res.render('profilo', { utenti, avatar: avatars });
        });
    });
});

app.get('/artefatti', (req, res) => {

    let sql = 'SELECT * FROM artefatti';
    let filtro = [];

    if (req.query.classe) {
        sql += ' WHERE categoria = ?';
        filtro.push(req.query.classe); //aggiungo il filtro per categoria alla query
    }

    if (req.query.nome_artefatto) {
        sql += ' WHERE nome like ?'; //aggiungo alla query la ricerca per il nome inserito nel campo di ricerca
        filtro.push(req.query.nome_artefatto+'%'); //aggiungo l'elemento alla lista dei nomi;
    }

    db.all(sql, filtro, (err, rows) => {
        if (err) {
            throw err;
        }
        res.render('artefatti', { artefatti: rows });
    });
});


app.get('/personaggi', (req, res) => {

    let sql = 'SELECT * FROM personaggi';
    let filtro = [];
    
    if (req.query.elemento) {
        sql += ' WHERE elemento = ?';
        filtro.push(req.query.elemento);
    }

    if (req.query.nome) {
        sql += ' WHERE nome like ?';  //aggiungo alla query la ricerca per il nome inserito nel campo di ricerca
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
    let filtro = [];
    if (req.query.nome_personaggio) {
        sql += ' WHERE p.nome like ?';
        filtro.push(req.query.nome_personaggio+'%');
    }

    db.all(sql, filtro, (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Errore del server');
        }
        res.render('build', { statistiche: rows });
    });
});

app.listen(port, '127.0.0.1', () => {
    console.log(`http://localhost:${port}`);
});