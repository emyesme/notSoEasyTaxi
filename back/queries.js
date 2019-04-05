const Pool  = require('pg-pool')
const {validationResult} = require('express-validator/check')

const configDeveloper = {
    user: 'postgres',//aqui tengo dudas
    password: 'postgres',//aqui tengo dudas
    host: 'localhost', //cambia con el docker
    port: '5432',
    database: 'bases', //cambia con el docker
    ssl: true,
    max: 10,
    min: 2,
    idleTimeputMillis: 1000//close idle clients after 1 second
};

const configDocker = {
    user: 'postgres',//aqui tengo dudas
    password: 'root',//aqui tengo dudas
    host: 'db',
    port: '5432',
    database: 'easyTaxiDB',
    ssl: true,
    max: 10,
    min: 2,
    idleTimeputMillis: 1000//close idle clients after 1 second
}

const pool = new Pool(configDeveloper);

const validateCheck = (request,response) => {
    //validacion de errores de sanitize 
    const errors = validationResult(request);
    if (!errors.isEmpty()){
        //muestra el nombre del dato que no es apropiado
        return response.status(200).json({ error: "Dato invalido: " + errors.array()[0].param})
    }
}

const todo = (request,response) => {
    ( async () => {
        var client = await pool.connect()
        try{
            var result = await client.query('SELECT * FROM client')
            response.status(200).json(result.rows)
        }
        finally{
            client.release()
        }
    })().catch( error => console.error(error.message, error.stack))
}

//###########################USUARIO########################################

/* ingresarUsuario, valida que la informacion recibida del login corresponda con la almacenada*/
const ingresarUsuario = (request, response) => {  
    ( async () => {
        //conexion con database obtiene cliente
        var client = await pool.connect()
        try{
            validateCheck(request,response)
            //obtiene la informacion 
            const cellphone = request.query.cellphone;
            const pass = request.query.pass; 
            //ejecuta el query correspondiente
            var result = await client.query('SELECT cellphoneclient FROM client WHERE cellphoneclient = $1 AND passwordClient = md5($2) AND status = true;', [cellphone, pass]);
            if (result.rowCount === 0){
                response.status(404).json({error: "Usuario no encontrado"})
            }
            else{
                //devuelve la informacion esperada
                response.status(200).json({ cellphone: result.rows[0].cellphoneclient})
            }
        }
        finally{
            //cierra la conexion con el cliente
            client.release()
        }
    })().catch( error => console.log({error: error.message}))
}

const usuario = (request, response) => {
    (async () => {
        var client = await pool.connect()
        try{
            validateCheck(request,response)
            const cellphone = request.query.cellphone;
            var result = await client.query('SELECT * FROM client WHERE cellphoneclient = $1 AND status = true;', [cellphone]);
            if (result.rowCount === 0){
                response.status(404).json({error: "Usuario no encontrado"})
            }
            else{
                //devuelve la informacion esperada
                response.status(200).json({cellphone: result.rows[0].cellphoneclient, name: result.rows[0].nameclient})
            }
        }
        finally{
            //cierra la conexion con el cliente
            client.release()
        }
    })().catch( error => console.log({error: error.message}))
}

const registrarUsuario = (request, response) => {
    (async () => {
        var client = await pool.connect()
        try{
            //validacion de errores de sanitize 
            validateCheck(request,response)
            var cellphone = request.body.cellphone;
            var pass = request.body.pass;
            var name = request.body.name;
            var address = request.body.address;
            var creditCard = request.body.creditCard;
            var result = await client.query("INSERT INTO Client"+
                                            "(cellphoneClient, passwordClient, nameClient, address, creditCard, status) VALUES"+
                                            "($1, md5($2), $3, $4, $5, true) RETURNING cellphoneClient;", [cellphone, pass, name, address, creditCard])
            if (result.rows[0].cellphoneclient !== cellphone){
                response.status(404).json({mensaje: "Error en registrar usuario."})
            }
            else{
                response.status(200).json({mensaje: "Usuario creado correctamente."})
            }
        }finally{
            //cierra la conexion con el cliente
            client.release()
        }
    })().catch(error => console.log({error: error.message}))
}

const lugaresFavoritos = (request, response) => {
    (async () => {
        var client = await pool.connect()
        try{
            validateCheck(request,response)
            const cellphone = request.query.cellphone;
            var result = await client.query('SELECT POINT(coordinate) AS  point, namecoordinate FROM FavCoordinates WHERE cellphoneClient=$1;',[cellphone])
            var package = [];
            for (id in result.rows){
                package[id] = result.rows[id]
            }
            response.status(200).json({coordinates: package})
        }finally{
            //cierra la conexion con el cliente
            client.release()
        }
    })().catch(error => console.log({error: error.message}))
}

//###########################CONDUCTOR########################################

/* ingresarUsuario, valida que la informacion recibida del login corresponda con la almacenada*/
const ingresarConductor = (request, response) => {  
    ( async () => {
        //conexion con database obtiene cliente
        var client = await pool.connect()
        try{
            validateCheck(request,response)
            //obtiene la informacion 
            const cellphone = request.query.cellphone;
            const pass = request.query.pass; 
            //ejecuta el query correspondiente
            var result = await client.query('SELECT cellphonedriver FROM driver WHERE cellphonedriver=$1 AND passworddriver=md5($2) and status=true;', [cellphone, pass]);
            if (result.rowCount === 0){
                response.status(200).json({error: "Conductor no encontrado"})
            }
            else{
                //devuelve la informacion esperada
                response.status(200).json({ cellphone: result.rows[0].cellphonedriver})
            }
        }
        finally{
            //cierra la conexion con el cliente
            client.release()
        }
    })().catch( error => console.log({error: error.message}))
}

const conductor = (request, response) => {
    (async () => {
        var client = await pool.connect()
        try{
            validateCheck(request,response)
            const cellphone = request.query.cellphone;
            var result = await client.query('SELECT driver.cellphonedriver, driver.nameDriver, plaque, date FROM driver INNER JOIN drive ON driver.cellphoneDriver = drive.cellphoneDriver WHERE driver.cellphoneDriver = $1  AND status=true ORDER BY date DESC LIMIT 1;', [cellphone]);
            if (result.rowCount === 0){
                response.status(200).json({error: "Conductor no encontrado"})
            }
            else{
                //devuelve la informacion esperada
                response.status(200).json({cellphone: result.rows[0].cellphonedriver, name: result.rows[0].namedriver, plaque: result.rows[0].plaque})
            }
        }
        finally{
            //cierra la conexion con el cliente
            client.release()
        }
    })().catch(error => console.log({error: error.message}))
}

const placa = (request, response) => {
    (async () => {
        var client = await pool.connect()
        try{
            validateCheck(request,response)
            const plaque = request.query.plaque;
            var result = await client.query("SELECT * FROM Taxi WHERE plaque=$1;",[plaque])
            if (result.rowCount === 0){
                response.status(404).json({error: "Taxi no encontrado"})
            }
            else{
                //devuelve la informacion esperada
                response.status(200).json({plaque: result.rows[0].plaque,model: result.rows[0].model, soat: result.rows[0].soat, year: result.rows[0].year, trademark: result.rows[0].trademark, trunk: result.rows[0].trunk})
            }
        }finally{
            //cierra la conexion con el cliente
            client.release()
        }
    })().catch(error => console.log({error: error.message}))
}

const cambiarTaxi = (request, response) => {
    (async () => {
        var client = await pool.connect()
        try{
            validateCheck(request, response)
            var plaque = request.body.plaque;
            var cellphone = request.body.cellphone;
            var date = request.body.date;
            var result = await client.query("INSERT INTO Drive (cellPhoneDriver, plaque, date) VALUES ($1, $2, $3) RETURNING cellPhoneDriver;", [cellphone, plaque, date])
            if (result.rows[0].cellphonedriver !== cellphone){
                response.status(200).json({mensaje: "Error al cambiar taxi"})
            }
            else{
                response.status(200).json({mensaje: "Taxi cambiado correctamente."})
            }            
        }finally{
            //cierra la conexion con el cliente
            client.release()
        }
    })().catch(error => console.log({error: error.message}))
}

const adicionarTaxi = (request, response) => {
    (async () => {
        var client = await pool.connect()
        try{
            validateCheck(request,response)
            var plaque = request.body.plaque;
            var soat = request.body.soat;
            var year = parseInt(request.body.year);
            var model = request.body.model;
            var trademark = request.body.trademark;
            var trunk = request.body.trunk;
            var result = await client.query("INSERT INTO Taxi (plaque, soat, year, model, trademark, trunk) VALUES ($1, $2, $3, $4, $5, $6) RETURNING plaque;",[plaque, soat, year, model, trademark, trunk])
            if (result.rows[0].plaque !== plaque){
                response.status(200).json({mensaje: "Error al adicionar taxi"})
            }
            else{
                response.status(200).json({mensaje: "Taxi adicionado correctamente."})
            }
        }finally{
            //cierra la conexion con el cliente
            client.release()
        }
    })().catch(error => console.log({error: error.message}))
}

//importante 
module.exports = {
    todo,
    ingresarUsuario,
    usuario,
    registrarUsuario,
    lugaresFavoritos,
    ingresarConductor,
    conductor,
    placa,
    cambiarTaxi,
    adicionarTaxi,
}