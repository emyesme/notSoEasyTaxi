const myExpress = require('express')
const myPgPromise = require('pg-promise')()
const bodyParser = require('body-parser')
const cors = require('cors')
const app = myExpress()
//cors
app.use(cors())
//body parser for post method
app.use(bodyParser.urlencoded({ extended : false}));
app.use(bodyParser.json());

const port = 4000
const base = myPgPromise('postgres://postgres:postgres@localhost:5432/bases')

app.get('/Usuario', function(request, response){
    //database part
    const {cellphone, pass} = request.query;
    base.one('SELECT * FROM client WHERE cellphoneclient = $1 AND passwordClient = md5($2) AND status = true', [cellphone, pass])
    .then(function (dato){
        //send info part
        response.send({cellphone: dato.cellphoneclient, name: dato.nameclient})
    })
    .catch(function (error) {
        response.send({ error: "Usuario encontrado"})
    })
})

app.get('/Conductor', function(request, response){
    //database part
    const {cellphone, pass} = request.query;
    //pasarlo a un procedimiento en el script
    base.one('SELECT driver.cellphonedriver, driver.nameDriver, plaque, date FROM driver INNER JOIN drive ON driver.cellphoneDriver = drive.cellphoneDriver WHERE driver.cellphoneDriver = $1 AND passwordDriver = md5($2) AND status=true ORDER BY date DESC LIMIT 1;', [cellphone, pass])
    .then(function (dato){
        //send info part
        response.send({cellphone: dato.cellphonedriver, name: dato.namedriver, plaque: dato.plaque})
    })
    .catch(function (error) {
        console.log(error)
        response.send({ error: error })
    })
})

app.post('/RegistrarUsuario', function(request, response){
    //database part
    var cellphone = request.body.cellphone;
    var pass = request.body.pass;
    var name = request.body.name;
    var address = request.body.address;
    var creditCard = request.body.creditCard;
    console.log( "llego al post")
    base.one("INSERT INTO Client"+
            "(cellphoneClient, passwordClient, nameClient, address, creditCard, status) VALUES"+
            "($1, md5($2), $3, $4, $5, true) RETURNING cellphoneClient", [cellphone, pass, name, address, creditCard])
    .then( function (dato){
        response.send({ mensaje: "Usuario creado correctamente" })
    })
    .catch( function (error){
        response.send( { error:error})
    })
    
})

app.get('/Placa', function(request, response){
    const plaque = request.query.plaque;
    base.one("SELECT * FROM Taxi WHERE plaque=$1;",[plaque])
    .then( function(dato){
        response.send({ plaque: dato.plaque,model: dato.model, soat: dato.soat, year: dato.year, trademark: dato.trademark, trunk: dato.trunk})
    }).catch( function (error){
        response.send({error: "No se encontro el taxi con esa placa"})
    })
})

app.post('/CambiarTaxi', function(request, response){
    var plaque = request.body.plaque
    var cellphone = request.body.cellphone
    var date = request.body.date
    base.one("INSERT INTO Drive (cellPhoneDriver, plaque, date) VALUES ($1, $2, $3) RETURNING cellPhoneDriver", [cellphone, plaque, date])
    .then( function(dato){
        response.send({ mensaje: "Taxi Cambiado correctamente"})
    }).catch( function (error){
        response.send({error: "Sucedio un error en la DB Cambiar Taxi"})
    })
})

app.post('/AdicionarTaxi', function(request, response){
    var plaque = request.body.plaque
    var soat = request.body.soat
    var year = parseInt(request.body.year)
    var model = request.body.model
    var trademark = request.body.trademark
    var trunk = request.body.trunk
    base.one("INSERT INTO Taxi (plaque, soat, year, model, trademark, trunk) VALUES ($1, $2, $3, $4, $5, $6) RETURNING plaque",[plaque, soat, year, model, trademark, trunk])
    .then( function(dato){
        response.send({mensaje: "Taxi creado correctamente"})
    }).catch( function (error){
        response.send({error: error})
    })
})

app.get('/' , function(request, response){
    base.any('SELECT * FROM client')
    .then( function (dato) {
        console.log("send get /")
        response.json(dato)
    })
    .catch( function (error) {
        response.send('error')
    })
})

app.listen(port, () => {
    console.log('Conexión a la base de datos puerto: ', port)
})




