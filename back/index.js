const myExpress = require('express')
const myPgPromise = require('pg-promise')()

const app = myExpress()
const port = 3000
const base = myPgPromise('postgres://postgres:root@localhost:5432/postgres')

app.get('/client', function(request, response){
    const {cellphone} = request.query;
    base.one('SELECT * FROM client WHERE cellphoneclient = $1 and status = true', [cellphone])
    .then(function (dato){
        console.log('Encontrado con exito \n')
        console.log(dato)
        response.send(dato)
    })
    .catch(function (error) {
        console.log(error)
        response.send({"error": {}})
    })
})


app.get('/' , function(request, response){
    base.any('SELECT * FROM client')
    .then( function (dato) {
        console.log(dato)
        response.send(dato)
    })
    .catch( function (error) {
        console.log(error)
        response.send('error')
    })
})


app.listen(port, () => {
    console.log('Conección a la base de datos')
})




