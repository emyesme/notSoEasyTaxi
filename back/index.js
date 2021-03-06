const myExpress = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = myExpress()
//check for sanitization
const {check} = require('express-validator/check')


//body parser for post method
app.use(bodyParser.urlencoded({ extended : false}));
app.use(bodyParser.json());


//db
const db = require('./queries')
//port
const port = 4000

//end-points

var config = {
    origin: true,
    methods: ['GET','PUT','POST','OPTIONS','DELETE'],
    allowHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
    credentials: true,
    preflightContinue: true

}

app.use(function(request, response, next) {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Credentials", "true");
    response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
    response.setHeader("Access-Control-Max-Age", "3600");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept, X-Requested-With, remember-me");
    next();
  
  });

app.use(cors());

app.options('*', cors(config));

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

app.get('/InfoUsuario',
        [
            check('cellphone').isNumeric().isLength({min:10}).trim().escape()
        ],
        db.infoUsuario)

app.post('/EliminarUsuario',
        [
            check('cellphone').isNumeric().isLength({min:10}).trim().escape()
        ],
        db.eliminarUsuario)

app.post('/RegistrarUsuario',
        [
            check('cellphone').isNumeric().isLength({min:10}).trim().escape(),
            check('pass').trim(),
            check('name').isAlpha().trim().escape(),
            check('address').escape(),
            check('creditCard').isNumeric().isLength({min:16}).trim().escape()
        ],
        db.registrarUsuario)

app.post('/ModificarUsuario',
        [
            check('cellphone').isNumeric().isLength({min:10}).trim().escape(),
            check('pass').trim(),
            check('name').trim().escape(),
            check('address').escape(),
            check('creditcard').isNumeric().isLength({min:16}).trim().escape()
        ],
        db.modificarUsuario)

app.get('/LugaresFavoritos',
        [
            check('cellphone').isNumeric().isLength({min:10}).trim().escape()
        ],
        db.lugaresFavoritos)

app.post('/crearFavorito',
        [
            check('cellphone').isNumeric().isLength({min:10}).trim().escape(),
            check('coordinateX').isNumeric().escape(),
            check('coordinateY').isNumeric().escape(),
            check('name').isAlphanumeric().trim().escape()
        ],
        db.createFav)


app.post('/eliminarFavorito',
        [
            check('cellphone').isNumeric().isLength({min:10}).trim().escape(),
            check('name').isAlphanumeric().trim().escape()
        ],
        db.deleteFav)       

app.get('/Origen',
        [
            check('cellphone').isNumeric().isLength({min:10}).trim().escape()
        ],
        db.origen)

app.post('/BuscarTaxi',
        [
            check('cellphone').isNumeric().isLength({min:10}).trim().escape(),
            check('initialPoint').escape(),
            check('finalPoint').escape()
        ],
        db.buscarPrimerTaxi)

app.get('/HayServicio',
        [
            check('cellphone').isNumeric().isLength({min:10}).trim().escape()
        ],
        db.askConductor)

app.post('/FinServicio',
        [
            check('idAsk').isNumeric().escape()
        ],
        db.finServicio)

app.post('/MoverConductor',
        [
            check('cellphonedriver').isNumeric().isLength({min:10}).trim().escape(),
            check('destiny').isArray().escape()
        ],
        db.moverConductor)

app.get('/kilometrosRecorridos',
        [
            check('cellphone').isNumeric().isLength({min:10}).trim().escape(),
            check('type').isAlpha().trim().escape()
        ],
        db.kilometrosRecorridos)

app.post('/Calificacion',
        [
            check('idAsk').isNumeric().escape(),
            check('star').isNumeric().escape()
        ],
        db.calificar)

//###########################CONDUCTOR########################################  
app.post('/RegistrarConductor',
        [
            check('cellphone').isNumeric().isLength({min:10}).trim().escape(),
            check('pass').trim(),
            check('name').isAlpha().trim().escape(),
            check('cc').isNumeric().escape(),
            check('creditCard').isNumeric().isLength({min:16}).trim().escape()
        ],
        db.registrarConductor)

app.get('/IngresarConductor',
        [
            check('cellphone').isNumeric().isLength({min:10}).trim().escape(),
            check('pass').trim()
        ],
        db.ingresarConductor)


app.post('/EliminarConductor',
        [
            check('cellphone').isNumeric().isLength({min:10}).trim().escape()
        ],
        db.eliminarConductor)


app.get('/InfoConductor',
        [
            check('cellphone').isNumeric().isLength({min:10}).trim().escape()
        ],
        db.infoConductor)

app.post('/ModificarConductor',
        [
            check('cellphone').isNumeric().isLength({min:10}).trim().escape(),
            check('pass').trim(),
            check('name').trim().escape(),
            check('cc').isNumeric().escape(),
            check('numaccount').isNumeric().isLength({min:16}).trim().escape()
        ],
        db.modificarConductor)

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
            check('point').escape()
        ],
        db.cambiarTaxi)

app.post('/AdicionarTaxi',
        [
            check('plaque').isAlphanumeric().isLength({min:6}).trim().escape(),
            check('soat').isAlphanumeric().trim().escape(),
            check('year').isNumeric().escape(),
            check('model').isAlphanumeric().trim().escape()
        ],
        db.adicionarTaxi)

app.post('/ModificarTaxi',
        [
            check('plaque').isAlphanumeric().isLength({min:6}).trim().escape(),
            check('soat').isAlphanumeric().trim().escape(),
            check('year').isNumeric().escape(),
            check('model').isAlphanumeric().trim().escape()            
        ],
        db.modificarTaxi)

app.get('/Modelos', db.modelos)

app.get('/SolicitudConductor',
        [
            check('idAsk').isNumeric().escape()
        ],db.buscarCelularConAsk)

app.get( '/DisponibilidadConductor',
        [
            check('cellphone').isNumeric().isLength({min:10}).trim().escape()
        ],
        db.verDisponibilidadCellphone)

app.get('/ServicioAceptado',
        [
            check('idAsk').isNumeric().escape()
        ],db.askAceptada)

app.post('/AceptaConductor',
        [
            check('idAsk').isNumeric().escape()
        ],
        db.aceptaConductor)


app.get('/Posicion',
        [
            check('plaque').isAlphanumeric().escape()
        ],
        db.obtenerGps)


//###########################MODELO########################################

app.post('/CrearModelo',
        [
            check('model').isAlphanumeric().isLength({max:15}).trim().escape(),
            check('trademark').isAlphanumeric().isLength({max:15}).trim().escape(),
            check('trunk').isAlpha().isLength({max:15}).trim().escape()
        ],
        db.crearModelo)

app.get('/ConsultarModelo',
        [
            check('model').isAlphanumeric().isLength({max:15}).trim().escape()
        ],
        db.consultarModelo)

app.post('/ModificarModelo',
        [
            check('model').isAlphanumeric().isLength({max:15}).trim().escape(),
            check('trademark').isAlphanumeric().isLength({max:15}).trim().escape(),
            check('trunk').isAlphanumeric().isLength({max:15}).trim().escape()
        ],
        db.modificarModelo)

app.post('/EliminarModelo',
        [
            check('model').isAlphanumeric().isLength({max:15}).trim().escape()
        ],
        db.eliminarModelo)

app.get('/Historial',
        [
            check('cellphone').isNumeric().isLength({max:10}).trim().escape(),
            check('cellphonetype').escape()
        ],
        db.historial)

app.get('/searchFav',
        [
            check('cellphone').isNumeric().isLength({max:10}).trim().escape(),
            check('coordinateX').escape(),
            check('coordinateY').escape()
        ],
        db.searchFav)

app.get('/deleteFav',
        [
            check('cellphone').isNumeric().isLength({max:10}).trim().escape(),
            check('coordinateX').escape(),
            check('coordinateY').escape()
        ],
        db.searchFav)

app.get('/deleteFav',
        [
            check('cellphone').isNumeric().isLength({max:10}).trim().escape(),
            check('coordinateX').escape(),
            check('coordinateY').escape(),
            check('name').isAlphanumeric().trim().escape()
        ],
        db.searchFav)


app.post('/pagar',
        [
            check('cellphone').isNumeric().isLength({max:10}).trim().escape(),
        ],
        db.pagarDeudas)

app.post('/cambiarDisponibilidad',
        [
            check('cellphone').isNumeric().isLength({max:10}).trim().escape(),
        ],
        db.cambiarDisponibilidad)

//start server
app.listen(port, () => {
    console.log('Conexión a la base de datos puerto: ', port)
})




