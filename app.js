const config = require('./config');
const express = require('express');
const { engine } = require('express-handlebars');
const { v4: UUID } = require('uuid');
const cookieParser = require('cookie-parser');
const Inventory = require('./models/Inventory');
const knex = require('knex')({
    client: 'pg',
    // connection: config.PG_CONNECTION_STRING
    connection: {
        host: config.CONNECTION.HOST,
        port: config.CONNECTION.PORT,
        user: config.CONNECTION.USER,
        password: config.CONNECTION.PASSWORD,
        database: config.CONNECTION.DATABASE
    }
});

const app = express();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

function checkAuthorization(req, res, next) {
    let authCookie = req.cookies.userId;
    if (authCookie) {
        knex
            .select('*')
            .from('users')
            .where('id', '=', authCookie)
            .then(data => {
                if (data[0] && data[0].id === authCookie) next();
                else res.redirect('/');
            })
            .catch(error => {
                console.log(error);
                res.redirect('/')
            });
    } else {
        res.redirect('/');
    }
}

/* GET login */
app.get('/', function (req, res, next) {
    let errorCode = parseInt(req.query.errorCode);
    res.render('login', { error: errorCode === 401 ? true : false });
});

/* POST login */
app.post('/login', function (req, res, next) {
    const { username, password } = req.body;
    knex
        .select('*')
        .from('users')
        .where('username', '=', username)
        .then(data => {
            if (data && data[0] && password === data[0].password) {
                res.cookie('userId', data[0].id);
                res.redirect('/home');
            } else {
                res.redirect('/?errorCode=401');
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json(error)
        });
});

/* GET inventory */
app.get('/home', checkAuthorization, function (req, res, next) {
    knex
        .select('*')
        .from('inventory')
        .then(data => {
            console.log(data, req.cookies);
            res.render('home', { items: data });
        })
        .catch(error => res.status(500).json(error));
});

/* GET create scan link */
app.get('/scans/link', checkAuthorization, function (req, res, next) {
    knex
        .select('*')
        .from('scan_session')
        .where('created_by', '=', req.cookies.userId)
        // .andWhere('status', '=', false)
        .then(data => {
            let curr = new Date();
            if (data && data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    if (+curr <= +data[i].expiry) {
                        return res.render('link', { data: data[i] });
                    }
                }
            } else {
                let date = new Date();
                const newSession = {
                    id: UUID(),
                    link: config.SCAN_LINK,
                    expiry: new Date(date.setTime(date.getTime() + (1 * 60 * 60 * 1000))),
                    created_by: req.cookies.userId,
                    created_at: new Date(),
                    status: false
                }
                newSession.link += newSession.id;
                // console.log(newSession);
                knex('scan_session')
                    .insert(newSession)
                    .then(_ => res.render('link', { data: newSession }))
                    .catch(error => res.redirect('/'));
            }
        })
        .catch(error => {
            console.error(error);
            res.redirect('/');
        });
});

app.get('/scan', function (req, res, next) {
    knex
        .select('*')
        .from('scan_session')
        .where('id', '=', req.query.sid)
        .then(data => {
            var curr = new Date();
            if (data && data[0] && (+curr <= +data[0].expiry)) {
                res.render('scan');
            } else {
                res.render('error', { error: '400 Invalid Session' });
            }
        })
        .catch(error => {
            console.log(error);
            res.render('error', { error: '500 Internal Server Error' })
        });
});

/* GET active unexpired scan sessions using id */
app.get('/scans/:Id', function (req, res, next) {
    knex
        .select('*')
        .from('scan_session')
        .where('id', '=', req.params.Id)
        .then(data => res.status(200).json(((data && data.length > 0) ? data[0] : [])))
        .catch(error => {
            console.log(error);
            res.status(500).json(error);
        });
});

/* GET scanned barcodes */
app.get('/scans/sessions/:Id/barcodes', function (req, res, next) {
    const index = parseInt(req.query.index);
    knex
        .select('*')
        .from('scan_item')
        .where('scan_session_id', '=', req.params.Id)
        .then(data => {
            if (data && data[0] && (data.length > index)) {
                return res.status(200).json(data.slice(index, data.length));
            }
        })
        .catch(error => {
            console.error(error);
        });
});

/* PUT scanned barcodes */
app.put('/scans/:Id', function (req, res, next) {
    const scanItem = {
        barcode: req.body.barcode,
        qoh: parseInt(req.body.qoh),
        scan_session_id: req.params.Id
    }
    knex('scan_item')
        .insert(scanItem)
        .then(data => res.status(200).json("created"))
        .catch(error => {
            console.log(error);
            res.status(500).json(error);
        });
});

/* PUT scanned items */
app.put('/inventory', function (req, res, next) {
    const { product_ndc, generic_name, product_type, manufacturer_name, quantity_on_hand, last_updated } = req.body;
    var inventoryItem = new Inventory(UUID(), product_ndc, generic_name, product_type, manufacturer_name, quantity_on_hand, last_updated);
    knex
        .select('*')
        .from('inventory')
        .where('product_ndc', '=', inventoryItem.product_ndc)
        .andWhere('quantity_on_hand', '=', inventoryItem.quantity_on_hand)
        .then(data => {
            if (data && data.length > 0) {
                res.status(200).json('exists');
            } else {
                knex('inventory')
                    .insert(inventoryItem)
                    .then(data => res.status(200).json("created"))
                    .catch(error => {
                        throw new Error(error);
                    });
            }
        })
        .catch(error => {
            console.log(error);
            res.render('error', { error: '500 Internal Server Error' })
        });
});

app.listen(config.PORT, function () { console.info('MedMapper app running on PORT : ' + config.PORT) });