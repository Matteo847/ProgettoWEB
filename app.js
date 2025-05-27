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


passport.serializeUser((user, done) => {
    console.log('utente:', user);
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    console.log('Deserializzo ID:', id);
    db.get('SELECT id, username, mail, ruolo FROM utenti WHERE id = ?', [id], (err, user) => {
        console.log('deserializzato:', user);
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
        db.run('INSERT INTO utenti (username, mail, password) VALUES (?, ?, ?)', [username, email, hashedPassword], function (err) {
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

app.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) return next(err);
        req.session.destroy(() => {
            res.redirect('/');
        });
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

app.get('/profilo', isLogged, (req, res) => {
    if (req.query.avatarSelezionato) {
        let avatarSelezionato = req.query.avatarSelezionato;
        db.run('UPDATE utenti SET avatar = ? WHERE id = ?', [avatarSelezionato, req.user.id], function (err) {
            if (err) {
                req.flash('error', 'Errore durante l\'aggiornamento dell\'avatar: ' + err.message);
                return res.redirect('/profilo');
            }
            req.flash('success', 'Avatar aggiornato con successo!');
            return res.redirect('/profilo');
        });
    } else {
        db.all('SELECT * FROM avatar', [], (err, avatars) => {
            if (err) throw err;

            db.get('SELECT * FROM utenti u LEFT JOIN avatar a ON u.avatar = a.id WHERE u.id = ?', [req.user.id], (err, utente) => {
                if (err) throw err;

                let sql = `
                    SELECT 
                        p.nome AS nome_personaggio,
                        p.immagine AS immagine_personaggio,

                        b.id AS id_build,

                        ar.nome_arma AS nome_arma,
                        ar.immagine AS immagine_arma,

                        sa.nome_set AS nome_set,
                        sa.descrizione AS descrizione_set,

                        a1.nome AS nome_artefatto1,
                        a1.immagine AS immagine_artefatto1,

                        a2.nome AS nome_artefatto2,
                        a2.immagine AS immagine_artefatto2,

                        a3.nome AS nome_artefatto3,
                        a3.immagine AS immagine_artefatto3,

                        a4.nome AS nome_artefatto4,
                        a4.immagine AS immagine_artefatto4,

                        a5.nome AS nome_artefatto5,
                        a5.immagine AS immagine_artefatto5

                    FROM build b
                    INNER JOIN set_artefatti sa ON b.id_set = sa.id
                    INNER JOIN artefatti a1 ON sa.fiore = a1.id
                    INNER JOIN artefatti a2 ON sa.piuma = a2.id
                    INNER JOIN artefatti a3 ON sa.clessidra = a3.id
                    INNER JOIN artefatti a4 ON sa.coppa = a4.id
                    INNER JOIN artefatti a5 ON sa.corona = a5.id
                    INNER JOIN personaggi p ON b.personaggio = p.id
                    INNER JOIN armi ar ON b.arma = ar.id
                    where b.id_utente = ?
                `;

                db.all(sql, req.user.id, (err, build) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send('Errore del server');
                    }
                    res.render('profilo', {
                        utente,
                        avatar: avatars,
                        build
                    });
                });
                    
                
            });
        });
    }
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
        filtro.push('%' + req.query.nome_artefatto + '%');  //aggiungo al filtro il nome da cerare (% nome %)
    }

    db.all(sql, filtro, (err, rows) => {
        if (err) {
            throw err;
        }
        res.render('artefatti', { artefatti: rows });
    });
});

app.get('/set-artefatti', isLogged, (req, res) => {

    const sql = `SELECT id, nome, categoria FROM artefatti`;
    const sqlArmi = `SELECT * FROM armi`;

    db.all(sql, [], (err, artefatti) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Errore nel recupero degli artefatti');
        }

        const categorie = {
            fiore: artefatti.filter(a => a.categoria === 'Flower of Life'),
            piuma: artefatti.filter(a => a.categoria === 'Plume of Death'),
            clessidra: artefatti.filter(a => a.categoria === 'Sands of Eon'),
            coppa: artefatti.filter(a => a.categoria === 'Goblet of Eonothem'),
            corona: artefatti.filter(a => a.categoria === 'Circlet of Logos')
        };

        db.all('SELECT * FROM personaggi', [], (err, personaggi) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Errore nel recupero dei personaggi');
            }

            db.all(sqlArmi, [], (err, queryarmi) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Errore nel recupero delle armi');
                }

                const armi = {
                    spada: queryarmi.filter(a => a.tipo_arma === 'spada'),
                    spadone: queryarmi.filter(a => a.tipo_arma === 'spadone'),
                    catalizzatore: queryarmi.filter(a => a.tipo_arma === 'catalizzatore'),
                    lancia: queryarmi.filter(a => a.tipo_arma === 'lancia'),
                    arco: queryarmi.filter(a => a.tipo_arma === 'arco'),
                };
                res.render('creaSetArtefatti', { categorie, personaggi, armi });

            });
        });
    });
});

app.post('/set-artefatti', isLogged,(req, res) => {

    const { nome_set, descrizione, fiore, piuma, clessidra, coppa, corona, personaggi, tipo_arma, pubblico } = req.body;
    const id_utente = req.user?.id;

    const sqlSet = `
        INSERT INTO set_artefatti 
        (nome_set, descrizione, fiore, piuma, clessidra, coppa, corona, id_utente)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const sqlBuild = `
        INSERT INTO build (id_utente, arma, personaggio, id_set, pubblico)
        values (?, ?, ?, ?, ?)
    `;

    const valuesSet = [nome_set, descrizione, fiore, piuma, clessidra, coppa, corona, id_utente];

    db.run(sqlSet, valuesSet, function (err) {
        if (err) {
            console.error(err);
            return res.status(500).send('Errore nel salvataggio del set di artefatti');
        }
        const valuesBuild = [req.user.id, tipo_arma, personaggi, this.lastID, pubblico];

        db.run(sqlBuild, valuesBuild, function (err) {

            if (err) {
                console.error(err);
                return res.status(500).send('Errore nel salvataggio della build');
            }

            res.redirect('/profilo');
        });
    });
});

app.get('/delete-build/:id', async (req, res) => {
    try {
        const buildId = req.params.id;
        const sql = 'DELETE FROM build WHERE id = ?';
        db.run(sql, buildId, function (err) {
            if (err) {
                console.error(err);
                return res.status(500);
            }
            if (this.changes === 0) {
                return res.status(404);
            }
        });
        res.status(200).json();
    } catch (error) {
        console.error(error);
        res.status(500);
    }
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
        filtro.push('%' + req.query.nome + '%'); //aggiungo al filtro il nome da cerare (% nome %)
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
    let sql = `
        SELECT 
            p.nome AS nome_personaggio,
            p.immagine AS immagine_personaggio,

            ar.nome_arma AS nome_arma,
            ar.immagine AS immagine_arma,

            sa.nome_set AS nome_set,

            a1.nome AS nome_artefatto1,
            a1.immagine AS immagine_artefatto1,

            a2.nome AS nome_artefatto2,
            a2.immagine AS immagine_artefatto2,

            a3.nome AS nome_artefatto3,
            a3.immagine AS immagine_artefatto3,

            a4.nome AS nome_artefatto4,
            a4.immagine AS immagine_artefatto4,

            b.pubblico AS pubblico,

            a5.nome AS nome_artefatto5,
            a5.immagine AS immagine_artefatto5

        FROM build b
        INNER JOIN set_artefatti sa ON b.id_set = sa.id
        INNER JOIN artefatti a1 ON sa.fiore = a1.id
        INNER JOIN artefatti a2 ON sa.piuma = a2.id
        INNER JOIN artefatti a3 ON sa.clessidra = a3.id
        INNER JOIN artefatti a4 ON sa.coppa = a4.id
        INNER JOIN artefatti a5 ON sa.corona = a5.id
        INNER JOIN personaggi p ON b.personaggio = p.id
        INNER JOIN armi ar ON b.arma = ar.id
        WHERE b.pubblico = 1
    `;

    let filtro = [];
    
    // Se c'è un filtro per nome build
    if (req.query.nome_build) {
        sql += ' AND p.nome LIKE ?';
        filtro.push('%' + req.query.nome_build + '%');
    }

    db.all(sql, filtro, (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Errore del server');
        }
        res.render('build', { build: rows });
    });
});

app.get('/armi', isNotLogged, (req, res) => {

    let sql = 'SELECT * FROM armi';
    let filtro = [];

    if (req.query.tipo_arma) {
        sql += ' WHERE tipo_arma = ?';
        filtro.push(req.query.tipo_arma); //aggiungo il filtro per categoria alla query
    }

    if (req.query.nome_arma) {
        sql += ' WHERE nome_arma like ?'; //aggiungo alla query la ricerca per il nome inserito nel campo di ricerca
        filtro.push('%' + req.query.nome_arma + '%'); //aggiungo al filtro il nome da cerare (% nome %)
    }

    db.all(sql, filtro, (err, tabella) => { //cambiare rows in tabella per evitare confusione con la variabile di sopra
        if (err) {
            throw err;
        }
        res.render('armi', { armi: tabella });
    });
});

app.listen(port, '127.0.0.1', () => {
    console.log(`http://localhost:${port}`);
});