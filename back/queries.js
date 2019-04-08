const Pool  = require('pg-pool')
const {validationResult} = require('express-validator/check')
const config = require('./configs')


const poolAdmin = new Pool(config.configAdmin);
const poolClient = new Pool(config.configUserClient);
const poolDriver = new Pool(config.configUserDriver);


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
        var client = await poolAdmin.connect()
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
        var client = await poolAdmin.connect()
        try{
            validateCheck(request,response)
            //obtiene la informacion 
            const cellphone = request.query.cellphone;
            const pass = request.query.pass; 
            //ejecuta el query correspondiente
            var result = await client.query('SELECT cellphoneclient FROM client WHERE cellphoneclient = $1 AND passwordClient = md5($2) AND status = true;', [cellphone, pass]);
            if (result.rowCount === 0){
                response.status(200).json({error: "Usuario no encontrado"})
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
        var client = await poolAdmin.connect()
        try{
            validateCheck(request,response)
            const cellphone = request.query.cellphone;
            var result = await client.query('SELECT * FROM client WHERE cellphoneclient = $1 AND status = true;', [cellphone]);
            if (result.rowCount === 0){
                response.status(200).json({error: "Usuario no encontrado"})
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
        var client = await poolAdmin.connect() //#######################################
        try{
            //validacion de errores de sanitize 
            validateCheck(request,response)
            var cellphone = request.body.cellphone;
            var pass = request.body.pass;
            var name = request.body.name;
            var pointx = request.body.address.lat;
            var pointy = request.body.address.lng;
            var creditCard = request.body.creditCard;
            var result = await client.query("INSERT INTO Client"+
                                            "(cellphoneClient, passwordClient, nameClient, address, creditCard, status) VALUES"+
                                            "($1, md5($2), $3, GEOMETRY(POINT($4,$5)), $6, true) RETURNING cellphoneClient;", [cellphone, pass, name, pointx, pointy, creditCard])
            if (result.rows[0].cellphoneclient !== cellphone){
                console.log(result.error)
                response.status(200).json({mensaje: "Error en registrar usuario."})
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
        var client = await poolAdmin.connect()
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

const origen = (request, response) => {
    (async () => {
        var client = await poolAdmin.connect()
        try{
            validateCheck(request,response)
            const cellphone = request.query.cellphone;
            var result = await client.query('SELECT POINT(address) AS  point FROM Client WHERE cellphoneClient=$1;',[cellphone])
            if (result.rowCount === 0){
                response.status(200).json({error: "Usuario no encontrado"})
            }
            console.log(result.rows[0].point)
            response.status(200).json({origin: result.rows[0].point})
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
        var client = await poolAdmin.connect()
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
        var client = await poolAdmin.connect()//o cambiar el query o escoger diferente
        try{
            validateCheck(request,response)
            const cellphone = request.query.cellphone;
            var result = await client.query('SELECT cellphonedriver, plaque, date FROM drive WHERE cellphonedriver = $1 ORDER BY date DESC LIMIT 1;', [cellphone]);
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
        var client = await poolAdmin.connect()
        try{
            validateCheck(request,response)
            const plaque = request.query.plaque;
            var result = await client.query("SELECT * FROM Taxi WHERE plaque=$1;",[plaque])
            if (result.rowCount === 0){
                response.status(200).json({error: "Taxi no encontrado"})
            }
            else{
                //devuelve la informacion esperada
                response.status(200).json({plaque: result.rows[0].plaque,model: result.rows[0].model, soat: result.rows[0].soat, year: result.rows[0].year})
            }
        }finally{
            //cierra la conexion con el cliente
            client.release()
        }
    })().catch(error => console.log({error: error.message}))
}

const cambiarTaxi = (request, response) => {
    (async () => {
        var client = await poolAdmin.connect()
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
        var client = await poolAdmin.connect()
        try{
            validateCheck(request,response)
            var plaque = request.body.plaque;
            var soat = request.body.soat;
            var year = parseInt(request.body.year);
            var model = request.body.model;
            var trademark = request.body.trademark;
            var trunk = request.body.trunk;
            var result = await client.query("INSERT INTO Taxi (plaque, soat, year, model) VALUES ($1, $2, $3, $4) RETURNING plaque;",[plaque, soat, year, model])
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

const modelos = (request, response) => {
    (async () => {
        var client = await poolAdmin.connect()
        try{
            var result = await client.query("SELECT * FROM modelTaxi")
            if (result.rowCount === 0){
                response.status(200).json({error: "No hay modelos"})
            }
            else{
                var package = [];
                for (id in result.rows){
                    package[id] = result.rows[id]
                }
                response.status(200).json({models: package})
            }
        }finally{
            //cierra la conexion con el cliente
            client.release()
        }
    })().catch(error => console.log({error: error.message}))  
}


//###########################Administrador########################################

const crearModelo = (request, response) => {
    (async () => {
        var client = await poolAdmin.connect()
        try{
            validateCheck(request,response);
            
            var modelo = request.body.model;
            var marca = request.body.trademark;
            var baul = request.body.trunk;
            
            var result = await client.query("INSERT INTO ModelTaxi (model, trademark, trunk) VALUES ($1, $2, $3) RETURNING model", [modelo, marca, baul])


            if (result.rows[0].model !== modelo){
                response.status(200).json({mensaje: "Error al agregar modelo"})
            }
            else{
                response.status(200).json({mensaje: "Modelo agregado correctamente"})
            }            
        }finally{
            //cierra la conexion con el cliente
            client.release()
        }
    })().catch(error => console.log({error: error.message}))
}

const consultarModelo = (request, response) => {
    (async () => {
        var client = await poolAdmin.connect()
        try{
            validateCheck(request,response);
            
            var modelo = request.query.model;
            
            var result = await client.query("SELECT * FROM ModelTaxi WHERE model = $1", [modelo])
            
            if (result.rowCount === 0){
                response.status(200).json({mensaje: "El modelo no fue encontrado"});
            }
            else{
                response.status(200).json(result.rows);
            }            
        }finally{
            //cierra la conexion con el cliente
            client.release()
        }
    })().catch(error => console.log({error: error.message}))
}

const modificarModelo = (request, response) => {
    (async () => {
        var client = await poolAdmin.connect()
        try{
            
            var modelo = request.body.model;
            var marca = request.body.trademark;
            var baul = request.body.trunk;

            var result = await client.query("UPDATE ModelTaxi SET marca = $1, baul = $2 WHERE model = $3 RETURNING model", [modelo, marca, baul]);
            
            if (result.rows[0].model !== modelo){
                response.status(200).json({mensaje: "Error al modificar modelo"})
            }
            else{
                response.status(200).json({mensaje: "Modelo modificado correctamente"})
            }            
        }finally{
            //cierra la conexion con el cliente
            client.release()
        }
    })().catch(error => console.log({error: error.message}))
}

const eliminarModelo = (request, response) => {
    (async () => {
        var client = await poolAdmin.connect()
        try{
            validateCheck(request,response);
            
            var modelo = request.body.model;
            
            var result = await client.query("DELETE FROM ModelTaxi WHERE model = $1 RETURNING model", [modelo])
            if (result.rows[0].model !== modelo){
                response.status(200).json({mensaje: "No fue posible la eliminación del modelo, verifique la existencia del modelo"})
            }
            else{
                response.status(200).json({mensaje: "Modelo eliminado correctamente"})
            }            
        }finally{
            //cierra la conexion con el cliente
            client.release()
        }
    })().catch(error => console.log({error: error.message}))
}





const buscarPrimerTaxi = (request, response) => {
    (async () => {
        var client = await poolAdmin.connect()
        try{
            validateCheck(request,response)
            var cellphoneClient = request.body.cellphone;
            var initialPoint = request.body.initialCoordinates;
            var finalPoint = request.body.finalCoordinates;
            
            var result = await client.query("SELECT findDriver($1, $2, $3)",[cellphoneClient, initialPoint, finalPoint])
            if (result.rows[0].findDriver === NULL){
                response.status(200).json({error: "No encontramos ningun taxista disponible"})
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
        var client = await poolAdmin.connect()
        try{
            validateCheck(request,response)
            var idAskIn = request.body.idAsk;
            
            var result = await client.query("SELECT cellphoneDriver FROM Ask WHERE idAsk = $1", [idAskIn]);
            
            if (result.rows[0].cellphonedriver === NULL){
                response.status(200).json({error: "El celular de conductor no fue encontrado"})
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
        var client = await poolAdmin.connect()
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
        var client = await poolClients.connect()
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
    origen,
    ingresarConductor,
    conductor,
    placa,
    cambiarTaxi,
    adicionarTaxi,
    modelos,
    crearModelo,
    consultarModelo,
    modificarModelo,
    eliminarModelo
}