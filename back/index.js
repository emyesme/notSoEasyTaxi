const myExpress = require('express')
const myPgPromise = require('pg-promise')()

const app = myExpress()
const port = 3000
const base = myPgPromise('postgres://postgres:root@localhost:5432/postgres')



app.get('/mapa' , function(request, response){
    base.one('SELECT 123 AS a')
    .then( function (dato) {
        console.log(dato)
        response.send(dato)
    })
    .catch( function (error) {
        console.log(error)
    })
})


app.listen(port)




