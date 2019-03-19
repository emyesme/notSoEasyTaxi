const myExpress = require('express')
const myPgPromise = require('pg-promise')()
const cors = require('cors')
const app = myExpress()
//cors
app.use(cors())

const port = 4000
const base = myPgPromise('postgres://postgres:root@localhost:5432/bases')

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
    console.log('Conexión a la base de datos')
})




