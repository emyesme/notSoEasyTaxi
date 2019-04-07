const Pool  = require('pg-pool')
const {validationResult} = require('express-validator/check')
const config = require('./configs')

const configDeveloper = {
    user: 'postgres',//aqui tengo dudas
    password: 'postgres',//aqui tengo dudas
    host: 'localhost', //cambia con el docker
    port: '5432',
    database: 'easyTaxiDB', //cambia con el docker
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


const poolUserClientInsert = new Pool(config.configUserClientInsert);
const poolUserClientSelect = new Pool(config.configUserClientSelect);
const poolUserClientUpdate = new Pool(config.configUserClientUpdate);
const poolUserClientDelete = new Pool(config.configUserClientDelete);
const poolUserFavCoordinatesInsert = new Pool(config.configUserFavCoordinatesInsert);
const poolUserFavCoordinatesSelect = new Pool(config.configUserFavCoordinatesSelect);
const poolUserFavCoordinatesUpdate = new Pool(config.configUserFavCoordinatesUpdate);
const poolUserFavCoordinatesDelete = new Pool(config.configUserFavCoordinatesDelete);
const poolUserDriverInsert = new Pool(config.configUserDriverInsert);
const poolUserDriverSelect = new Pool(config.configUserDriverSelect);
const poolUserDriverUpdate = new Pool(config.configUserDriverUpdate);
const poolUserDriverDelete = new Pool(config.configUserDriverDelete);
const poolUserModelTaxiInsert = new Pool(config.configUserModelTaxiInsert);
const poolUserModelTaxiSelect = new Pool(config.configUserModelTaxiSelect);
const poolUserModelTaxiUpdate = new Pool(config.configUserModelTaxiUpdate);
const poolUserModelTaxiDelete = new Pool(config.configUserModelTaxiDelete);
const poolUserTaxiInsert = new Pool(config.configUserTaxiInsert);
const poolUserTaxiSelect = new Pool(config.configUserTaxiSelect);
const poolUserTaxiUpdate = new Pool(config.configUserTaxiUpdate);
const poolUserTaxiDelete = new Pool(config.configUserTaxiDelete);
const poolUserDriveInsert = new Pool(config.configUserDriveInsert);
const poolUserDriveSelect = new Pool(config.configUserDriveSelect);
const poolUserDriveUpdate = new Pool(config.configUserDriveUpdate);
const poolUserDriveDelete = new Pool(config.configUserDriveDelete);
const poolUserAskInsert = new Pool(config.configUserAskInsert);
const poolUserAskSelect = new Pool(config.configUserAskSelect);
const poolUserAskUpdate = new Pool(config.configUserAskUpdate);
const poolUserAskDelete = new Pool(config.configUserAskDelete);
const poolUserGpsInsert = new Pool(config.configUserGpsInsert);
const poolUserGpsSelect = new Pool(config.configUserGpsSelect);
const poolUserGpsUpdate = new Pool(config.configUserGpsUpdate);
const poolUserGpsDelete = new Pool(config.configUserGpsDelete);


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
        var client = await poolUserClientSelect.connect()
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

const buscarPrimerTaxi = (request, response) => {
    (async () => {
        var client = await pool.connect()
        try{
            validateCheck(request,response)
            var cellphoneClient = request.body.cellphone;
            var initialPoint = request.body.initialCoordinates;
            var finalPoint = request.body.finalCoordinates;
            
            var result = await client.query("SELECT findDriver($1, $2, $3)",[cellphoneClient, initialPoint, finalPoint])
            if (result.rows[0].findDriver === NULL){
                response.status(404).json({error: "No encontramos ningun taxista disponible"})
            }
            else{
                response.status(200).json({mensaje: "Taxista encontrado, por favor espere la respuesta del conductor asignado"})
            }
                
        }finally{
            //cierra la conexion con el cliente
            client.release()
        }
    })().catch(error => console.log({error: error.message}))
}


const buscarCelularConAsk = (request, response) => {
    (async () => {
        var client = await pool.connect()
        try{
            validateCheck(request,response)
            var idAskIn = request.body.idAsk;
            
            var result = await client.query("SELECT cellphoneDriver FROM Ask WHERE idAsk = $1", [idAskIn]);
            
            if (result.rows[0].cellphonedriver === NULL){
                response.status(404).json({error: "El celular de conductor no fue encontrado"})
            }
            else{
                response.status(200).json({mensaje: "El celular de conductor fue encontrado"})
            }
                
        }finally{
            //cierra la conexion con el cliente
            client.release()
        }
    })().catch(error => console.log({error: error.message}))
}


const verDisponibilidadCellphone = (request, response) => {
    (async () => {
        var client = await pool.connect()
        try{
            validateCheck(request,response)
            var cellphoneDriver = request.body.cellphone;
            
            var result = await client.query("SELECT available FROM Driver WHERE cellphoneDriver = $1", [cellphoneDriver]);
            
            if (result.rows[0].cellphonedriver === true){
                response.status(200).json({error: "Esta disponible"})
            }
            else{
                response.status(200).json({mensaje: "No esta disponible"})
            }
                
        }finally{
            //cierra la conexion con el cliente
            client.release()
        }
    })().catch(error => console.log({error: error.message}))
}

const askAceptada = (request, response) => {
    (async () => {
        var client = await pool.connect()
        try{
            validateCheck(request,response)
            var idAskIn = request.body.idAsk;
            
            var result = await client.query("SELECT initialTime FROM Ask WHERE idAsk = $1", [idAskIn]);
            
            if (result.rows[0].initialTime === NULL){
                response.status(200).json({error: "Aun no ha sido aceptada"})
            }
            else{
                response.status(200).json({mensaje: "Fue aceptada"})
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