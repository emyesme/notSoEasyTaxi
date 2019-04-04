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




//###########################USUARIO########################################
app.get('/IngresarUsuario', function(request, response){
    const cellphone = escape(request.query.cellphone);
    const pass = escape(request.query.pass);
    base.one('SELECT cellphoneclient FROM client WHERE cellphoneclient = $1 AND passwordClient = md5($2) AND status = true', [cellphone, pass])
    .then( function (dato){
        response.send({cellphone: dato.cellphoneclient})
    }).catch( function (error){
        response.send({ error: "Usuario no encontrado"})
    })
})

app.get('/Usuario', function(request, response){
    //database part
    const cellphone = escape(request.query.cellphone);
    base.one('SELECT * FROM client WHERE cellphoneclient = $1 AND status = true', [cellphone])
    .then(function (dato){
        //send info part
        response.send({cellphone: dato.cellphoneclient, name: dato.nameclient})
    })
    .catch(function (error) {
        response.send({ error: "Usuario no encontrado"})
    })
})

app.post('/RegistrarUsuario', function(request, response){
    //database part
    var cellphone = escape(request.body.cellphone);
    var pass = escape(request.body.pass);
    var name = escape(request.body.name);
    var address = escape(request.body.address);
    var creditCard = escape(request.body.creditCard);
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

app.get('/LugaresFavoritos', function( request, response){
    const cellphone = escape(request.query.cellphone);
    base.any('SELECT POINT(coordinate) AS  point, namecoordinate FROM FavCoordinates WHERE cellphoneClient=$1;',[cellphone])
    .then( function(dato){
        var package = [];
        for (id in dato){
            package[id] = dato[id]
        }
        response.send({coordinates: package})
    }).catch( function (error){
        response.send({error: "Error al buscar lugares favoritos"})
    })
})


//###########################CONDUCTOR########################################

app.get('/IngresarConductor', function(request, response){
    const cellphone = escape(request.query.cellphone);
    const pass = escape(request.query.pass);
    base.one('SELECT cellphonedriver FROM driver WHERE cellphonedriver=$1 AND passworddriver=md5($2) and status=true;', [cellphone, pass])
    .then( function (dato){
        response.send({cellphone: dato.cellphonedriver})
    }).catch( function (error){
        response.send({ error: "Conductor no encontrado"})
    })
})

app.get('/Conductor', function(request, response){
    //database part
    const cellphone = escape(request.query.cellphone);
    //pasarlo a un procedimiento en el script TENER EN CUENTA CUANDO TAXISTA NO TIENE PLACA
    base.one('SELECT driver.cellphonedriver, driver.nameDriver, plaque, date FROM driver INNER JOIN drive ON driver.cellphoneDriver = drive.cellphoneDriver WHERE driver.cellphoneDriver = $1  AND status=true ORDER BY date DESC LIMIT 1;', [cellphone])
    .then(function (dato){
        if( dato.plaque === null){
            dato.plaque = "No Asignado"
        }
        //send info part
        response.send({cellphone: dato.cellphonedriver, name: dato.namedriver, plaque: dato.plaque})
    })
    .catch(function (error) {
        response.send({ error: "Error al seleccionar la información del conductor" })
    })
})

app.get('/Placa', function(request, response){
    const plaque = escape(request.query.plaque);
    base.one("SELECT * FROM Taxi WHERE plaque=$1;",[plaque])
    .then( function(dato){
        response.send({ plaque: dato.plaque,model: dato.model, soat: dato.soat, year: dato.year, trademark: dato.trademark, trunk: dato.trunk})
    }).catch( function (error){
        response.send({error: "No se encontro el taxi con esa placa"})
    })
})

app.post('/CambiarTaxi', function(request, response){
    var plaque = escape(request.body.plaque);
    var cellphone = escape(request.body.cellphone);
    var date = request.body.date;
    base.one("INSERT INTO Drive (cellPhoneDriver, plaque, date) VALUES ($1, $2, $3) RETURNING cellPhoneDriver", [cellphone, plaque, date])
    .then( function(dato){
        response.send({ mensaje: "Taxi Cambiado correctamente"})
    }).catch( function (error){
        console.log(error)
        response.send({error: "Sucedio un error en la DB Cambiar Taxi"})
    })
})

app.post('/AdicionarTaxi', function(request, response){
    var plaque = escape(request.body.plaque);
    var soat = escape(request.body.soat);
    var year = escape(parseInt(request.body.year));
    var model = escape(request.body.model);
    var trademark = escape(request.body.trademark);
    var trunk = escape(request.body.trunk);
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




