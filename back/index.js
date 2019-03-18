const myExpress = require('express')
const myPgPromise = require('pg-promise')()
const cors = require('cors')
const app = myExpress()
//cors
app.use(cors())

const port = 4000
const base = myPgPromise('postgres://postgres:root@localhost:5432/bases')

app.get('/client', function(request, response){
    //database part
    const {cellphone} = request.query;
    base.one('SELECT * FROM client WHERE cellphoneclient = $1 AND status = true', [cellphone])
    .then(function (dato){
        //send info part
        response.send({cellphone: dato.cellphoneclient, name: dato.nameclient})
    })
    .catch(function (error) {
        response.send({ error: "No encontrado"})
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

app


app.listen(port, () => {
    console.log('Conexión a la base de datos')
})




