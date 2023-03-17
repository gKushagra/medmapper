const config = require('./config');
const express = require('express');
const { engine } = require('express-handlebars');
const { v4: UUID } = require('uuid');
const knex = require('knex')({
    client: 'pg',
    connection: config.PG_CONNECTION_STRING
});

const date = new Date();
const app = express();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', function (req, res, next) {
    res.render('home');
});

/* GET inventory */
app.get('/inventory', function (req, res, next) {
    knex
        .select('*')
        .from('inventory')
        .then(data => res.status(200).json(data))
        .catch(error => res.status(500).json(error));
});

/* PUT scanned items */
app.put('/inventory', function (req, res, next) {
    const fieldsToInsert = req.body.map(field => ({
        id: uuid(),
        product_ndc: field.ProductNdc,
        generic_name: field.GenericName,
        brand_name: field.BrandName,
        active_ingredients: field.ActiveIngredients,
        package_ndc: field.PackageNdc,
        product_id: field.ProductId,
        product_type: field.ProductType,
        dosage_form: field.DosageForm,
        manufacturer_name: field.ManufacturerName,
        quantity_on_hand: field.QuantityOnHand,
        max_level: field.MaxLevel,
        reorder_level: field.ReorderLevel,
        last_updated: Date.now(),
        package_description: field.PackageDescription,
        item_barcode: field.ItemBarcode
    }));
    knex('inventory')
        .insert(fieldsToInsert)
        .then(success => res.status(200).json(success))
        .catch(error => res.status(500).json(error));
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

/* POST create or retrieve a scan session */
app.post('/scans', function (req, res, next) {
    knex
        .select('*')
        .from('scan_session')
        .where('created_by', '=', req.body.created_by)
        .andWhere('status', '=', false)
        .then(data => {
            if (data && data.length > 0) {
                console.log(data);
                res.status(200).json(data[0]);
            } else {
                const newLink = {
                    id: uuid(),
                    link: config.LINK_BASE_URL,
                    expiry: new Date(date.setTime(date.getTime() + (1 * 60 * 60 * 1000))),
                    created_by: req.body.created_by,
                    created_at: new Date(),
                    status: false
                }
                newLink.link += newLink.id;
                knex('scan_session')
                    .insert(newLink)
                    .then(_ => res.status(200).json(newLink))
                    .catch(error => res.status(500).json(error));
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).json(error)
        });
});

/* PUT scanned barcodes */
app.put('/scans/:Id', function (req, res, next) {
    const fieldsToInsert = req.body.map(field => ({
        scan_session_id: req.params.Id,
        barcode: field.Barcode
    }));
    knex('scan_item')
        .insert(fieldsToInsert)
        .then(success => res.status(200).json(success))
        .catch(error => res.status(200).json(error));
});

/* GET scanned barcodes */
app.get('/scans/:Id', function (req, res, next) {
    knex
        .select('*')
        .from('scan_item')
        .where('scan_session_id', '=', req.params.Id)
        .then(data => res.status(200).json(data))
        .catch(error => res.status(500).json(error));
});

app.listen(config.PORT, function () { console.info('MedMapper app running on PORT : ' + config.PORT) });