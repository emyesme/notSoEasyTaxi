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
const base = myPgPromise('postgresx://postgres:root@localhost:5432/bases')

app.get('/Usuario', function(request, response){
    //database part
    const {cellphone, pass} = request.query;
    base.one('SELECT * FROM client WHERE cellphoneclient = $1 AND passwordClient = md5($2) AND status = true', [cellphone, pass])
    .then(function (dato){
        //send info part
        console.log(cellphone);
        console.log(pass)
        response.send({cellphone: dato.cellphoneclient, name: dato.nameclient})
    })
    .catch(function (error) {
        response.send({ error: "Usuario encontrado"})
    })
})

app.get('/Conductor', function(request, response){
    //database part
    const {cellphone, pass} = request.query;
    base.one('SELECT * FROM driver WHERE cellphoneDriver = $1 AND passwordDriver = md5($2) AND status = true', [cellphone, pass])
    .then(function (dato){
        //send info part
        response.send({cellphone: dato.cellphonedriver, name: dato.namedriver})
    })
    .catch(function (error) {
        response.send({ error: "Conductor encontrado"})
    })
})

app.post('/RegistrarUsuario', function(request, response){
    //database part
    var cellphone = request.body.cellphone;
    var pass = request.body.pass;
    var name = request.body.name;
    var address = request.body.cedulaOrAddress;
    var creditCard = request.body.creditCard;
    
    console.log( "cellphone: " + cellphone + "\npass: " + pass + "\nname: "+name+"\naddress: " + address + "\ncreditCard: " + creditCard )

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


app.post('/RegistrarConductor', function(request, response){
    //database part
    var cellphone = request.body.cellphone;
    var pass = request.body.pass;
    var name = request.body.name;
    var cedula = request.body.cedulaOrAddress;
    var numAccount = request.body.creditCard;
    
    console.log( "cellphone: " + cellphone + "\npass: " + pass + "\nname: "+name+"\ncedula: " + cedula + "\nnumAccount: " + numAccount )

    base.one("INSERT INTO Driver"+
            "(cellphoneDriver,passwordDriver, nameDriver, cc, available, numAccount, status) VALUES"+
	        "($1, md5($2), $3, $4, true, $5, true) RETURNING cellphoneDriver", [cellphone,pass, name, cedula, numAccount])
    .then( function (dato){
        response.send({ mensaje: "Usuario creado correctamente" })
    })
    .catch( function (error){
        console.log(error)
        response.send( { error:error})
    })
    
})

app.get('/' , function(request, response){
    base.any('SELECT * FROM client')
    .then( function (dato) {
        console.log("send get /")
        response.json(dato)
    })
    .catch( function (error) {
        console.log(error)
        response.send('error')
    })
})



app.listen(port, () => {
    console.log('Conexión a la base de datos puerto: ', port)
})




