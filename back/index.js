const myExpress = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = myExpress()
//check for sanitization
const {check} = require('express-validator/check')
//cors
app.use(cors())
//body parser for post method
app.use(bodyParser.urlencoded({ extended : false}));
app.use(bodyParser.json());
//db
const db = require('./queries')
//port
const port = 4000

//end-points
app.get('/', db.todo)

//###########################USUARIO######################################## 
app.get('/IngresarUsuario',
        [
            check('cellphone').isNumeric().isLength({min:10}).trim().escape(),
            check('pass').trim()
        ],
        db.ingresarUsuario)

app.get('/Usuario',
        [
            check('cellphone').isNumeric().isLength({min:10}).trim().escape()
        ],
        db.usuario)

app.post('/RegistrarUsuario',
        [
            check('cellphone').isNumeric().isLength({min:10}).trim().escape(),
            check('pass').trim(),
            check('name').isAlpha().trim().escape(),
            check('address').isAlphanumeric().trim().escape(),
            check('creditCard').isCreditCard().trim().escape()
        ],
        db.registrarUsuario)

app.get('/LugaresFavoritos',
        [
            check('cellphone').isNumeric().isLength({min:10}).trim().escape()
        ],
        db.lugaresFavoritos)

//###########################CONDUCTOR########################################        
app.get('/IngresarConductor',
        [
            check('cellphone').isNumeric().isLength({min:10}).trim().escape(),
            check('pass').trim()
        ],
        db.ingresarConductor)

app.get('/Conductor',
        [
            check('cellphone').isNumeric().isLength({min:10}).trim().escape()
        ],
        db.conductor)

app.get('/Placa',
        [
            check('plaque').isAlphanumeric().isLength({min:6}).trim().escape()
        ],
        db.placa)

app.post('/CambiarTaxi',
        [
            check('plaque').isAlphanumeric().isLength({min:6}).trim().escape(),
            check('cellphone').isNumeric().isLength({min:10}).trim().escape(),
            check('date').trim()
        ],
        db.cambiarTaxi)

app.post('/AdicionarTaxi',
        [
            check('plaque').isAlphanumeric().isLength({min:6}).trim().escape(),
            check('soat').isAlphanumeric().trim().escape(),
            check('year').isNumeric().escape(),
            check('model').isAlphanumeric().trim().escape(),
            check('trademark').isAlpha().trim().escape(),
            check('trunk').isAlpha().trim().escape()
        ],
        db.adicionarTaxi)

//start server
app.listen(port, () => {
    console.log('Conexión a la base de datos puerto: ', port)
})



