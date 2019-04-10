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
        var client = await poolClient.connect()
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

        var client = await poolClient.connect()

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

        var client = await poolClient.connect()
      
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
        var client = await poolClient.connect() //#######################################
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
        var client = await poolClient.connect()

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
        var client = await poolClient.connect()

        try{
            validateCheck(request,response)
            const cellphone = request.query.cellphone;
            var result = await client.query('SELECT POINT(address) AS  point FROM Client WHERE cellphoneClient=$1;',[cellphone])
            if (result.rowCount === 0){
                response.status(200).json({error: "Usuario no encontrado"})
            }
            response.status(200).json({origin: result.rows[0].point})
        }finally{
            //cierra la conexion con el cliente
            client.release()
        }
    })().catch(error => console.log({error: error.message}))
}

const askConductor = (request, response) => {
    (async () => {
        var client = await poolAdmin.connect()
        try{
            validateCheck(request,response)
            const cellphone = request.query.cellphone;
            var result = await client.query('SELECT idask, cellphoneclient, POINT(initialcoordinates) AS initialpoint, POINT(finalcoordinates) AS finalpoint FROM ask WHERE cellphoneDriver=$1 AND initialTime IS NULL;',[cellphone])
            if (result.rowCount < 1){
                response.status(200).json({mensaje: "Noy hay servicios"})
            }
            else{
                response.status(200).json({servicio: result.rows[0]})
            }
        }finally{
            //cierra la conexion con el cliente
            client.release()
        }
    })().catch(error => console.log({error: error.message}))   
}


const kilometrosRecorridos = (request, response) => {
    (async () => {
        var client = await poolAdmin.connect()
        try{
            validateCheck(request,response)
            const cellphone = request.query.cellphone;
            const cellphonetype = request.query.type;
            var result;
            if( cellphonetype === 'cellphonedriver'){
                result = await client.query('WITH kilometers AS (SELECT cellphonedriver, SUM(distance(initialCoordinates, finalCoordinates)) as meters FROM Ask where pay=false GROUP BY cellphonedriver ) SELECT meters from kilometers where cellphonedriver=$1;',[cellphone])
            }
            else{
                result = await client.query('WITH kilometers AS (SELECT cellphoneclient, SUM(distance(initialCoordinates, finalCoordinates)) as meters FROM Ask where pay=false GROUP BY cellphoneclient ) SELECT meters from kilometers where cellphoneclient=$1;',[cellphone])
            }
            if (result.rowCount < 0){
                response.status(200).json({error: "No hay kilometros recorridos"})
            }
            else{
                response.status(200).json({km: result.rows[0].meters / 1000 })
            }
        }finally{
            //cierra la conexion con el cliente
            client.release()
        }
    })().catch(error => console.log({error: error.message}))    
}

const finServicio = (request, response) => {
    ( async () => {
        //conexion con database obtiene cliente
        var client = await poolAdmin.connect()
        try{
            validateCheck(request,response)
            //obtiene la informacion 
            const idAsk = request.body.idAsk;
            //ejecuta el query correspondiente
            var result = await client.query('SELECT finalAsk($1);', [idAsk]);
            if (result.rowCount === 0){
                response.status(200).json({error: "Error al terminar servicio."})
            }
            else{
                //devuelve la informacion esperada
                response.status(200).json({ idask: result.rows[0].finalask})
            }
        }
        finally{
            //cierra la conexion con el cliente
            client.release()
        }
    })().catch( error => console.log({error: error.message}))    
}

const calificar = (request, response) => {
    ( async () => {
        //conexion con database obtiene cliente
        var client = await poolAdmin.connect()
        try{
            validateCheck(request,response)
            //obtiene la informacion 
            const idAsk = request.body.idAsk;
            const star = request.body.star;
            //ejecuta el query correspondiente
            var result = await client.query('UPDATE ask SET stars = $1 WHERE idask = $2 RETURNING cellphoneclient;', [star,idAsk]);
            if (result.rowCount === 0){
                response.status(200).json({error: "Error al calificar"})
            }
            else{
                //devuelve la informacion esperada
                response.status(200).json({ cellphoneclient: result.rows[0].cellphoneclient})
            }
        }
        finally{
            //cierra la conexion con el cliente
            client.release()
        }
    })().catch( error => console.log({error: error.message}))    
}


//###########################CONDUCTOR########################################

const registrarConductor = (request, response) => {
    (async () => {
        var client = await poolAdmin.connect() //#######################################
        try{
            //validacion de errores de sanitize 
            validateCheck(request,response)
            var cellphone = request.body.cellphone;
            var pass = request.body.pass;
            var name = request.body.name;
            var cc = request.body.cc;
            var creditCard = request.body.creditCard;
            var result = await client.query("INSERT INTO Driver"+
                                            "(cellphoneDriver,cc, passwordDriver, nameDriver,  available, numAccount, status) VALUES"+
                                            "($1, $2, md5($3), $4,false, $5, true) RETURNING cellphoneDriver;", [cellphone, cc,pass,name, creditCard])
            if (result.rows[0].cellphonedriver !== cellphone){
                response.status(200).json({mensaje: "Error en registrar conductor."})
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



/* ingresarUsuario, valida que la informacion recibida del login corresponda con la almacenada*/
const ingresarConductor = (request, response) => {  
    ( async () => {
        //conexion con database obtiene cliente
        var client = await poolDriver.connect()

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

        var client = await poolDriver.connect()//o cambiar el query o escoger diferente

        try{
            validateCheck(request,response)
            const cellphone = request.query.cellphone;
            var result = await client.query('select driver.namedriver, driver.cellphonedriver, drive.plaque, date from driver left join drive on driver.cellphonedriver = drive.cellphonedriver where driver.cellphonedriver = $1 order by date desc limit 1;', [cellphone]);
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
        var client = await poolDriver.connect()
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
            var pointx = request.body.point.x
            var pointy = request.body.point.y;
            var result = await client.query("SELECT cambiartaxi($1, $2, $3, GEOMETRY(POINT($4,$5)));", [cellphone, plaque, date, pointx,pointy])
            if (result.rows[0].cambiartaxi !== cellphone){
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
        var client = await poolDriver.connect()
        try{
            validateCheck(request,response)
            var plaque = request.body.plaque;
            var soat = request.body.soat;
            var year = parseInt(request.body.year);
            var model = request.body.model;
            var initialPoint = request.body.coordinate;
            var result = await client.query("INSERT INTO Taxi (plaque, soat, year, model) VALUES ($1, $2, $3, $4) RETURNING plaque;",[plaque, soat, year, model])

            await client.query("INSERT INTO Gps (plaque, now(), initialPoint) VALUES ($1, $2, $3);",[plaque, initialPoint])

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

const aceptaConductor = (request, response) => {
    (async () => {
        var client = await poolAdmin.connect()
        try{
            validateCheck(request,response);
            var idAsk = request.body.idAsk
            var result = await client.query("select aceptarConductor($1)", [idAsk])
            if (result.rows[0].aceptarconductor !== idAsk){
                response.status(200).json({error: "Error al aceptar solicitud"})
            }
            else{
                response.status(200).json({idAsk: result.rows[0].aceptarconductor})
            }            
        }finally{
            //cierra la conexion con el cliente
            client.release()
        }
    })().catch(error => console.log({error: error.message}))   
}

const moverConductor = (request, response) => {
    (async () => {
        var client = await poolAdmin.connect()
        try{
            validateCheck(request,response);
            var cellphonedriver = request.body.cellphonedriver
            var destiny = request.body.destiny
            var result = await client.query("SELECT moveDriver($1, ST_MakePoint($2,$3));", [cellphonedriver, destiny[0], destiny[1]])
            if (result.rows[0].movedriver === null){
                response.status(200).json({error: "Error al mover conductor"})
            }
            else{
                response.status(200).json({destiny:result.rows[0].movedriver})
            }            
        }finally{
            //cierra la conexion con el cliente
            client.release()
        }
    })().catch(error => console.log({error: error.message}))     
}

const obtenerGps = (request, response) => {
    (async () => {
        var client = await poolAdmin.connect()
        try{
            validateCheck(request,response);
            var plaque = request.query.plaque
            var result = await client.query("select POINT(coordinate) AS point from gps where plaque=$1 ORDER BY timestamp DESC LIMIT 1;", [plaque])
            if (result.rowCount === 0){
                response.status(200).json({error: "Error al mover conductor"})
            }
            else{
                response.status(200).json({point:result.rows[0].point})
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
            var initialx = request.body.initialCoordinates.lat;
            var initialy = request.body.initialCoordinates.lng;
            var finalx = request.body.finalCoordinates.lat;
            var finaly = request.body.finalCoordinates.lng;
            var result = await client.query("SELECT findDriver( $1, GEOMETRY(POINT($2,$3)), GEOMETRY(POINT($4,$5)));",[cellphoneClient, initialx, initialy, finalx, finaly])
            if (result.rowCount === 0){
                response.status(200).json({error: "No encontramos ningun taxista disponible"})
            }
            else{
                response.status(200).json({idAsk: result.rows[0].finddriver})
            }
                
        }finally{
            //cierra la conexion con el cliente
            client.release()
        }
    })().catch(error => console.log({error: error.message}))
}


const buscarCelularConAsk = (request, response) => {
    (async () => {
        var client = await poolClient.connect()
        try{
            validateCheck(request,response)
            var idAskIn = request.query.idAsk;
            var result = await client.query("SELECT cellphonedriver FROM Ask WHERE idAsk = $1;", [idAskIn]);
            if (result.rowCount === 0){
                response.status(200).json({error: "El celular de conductor no fue encontrado"})
            }
            else{
                response.status(200).json({cellphonedriver: result.rows[0].cellphonedriver})
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
            var cellphonedriver = request.query.cellphone;
            var result = await client.query("SELECT available FROM Driver WHERE cellphoneDriver = $1", [cellphonedriver]);
            if (result.rows[0].available){
                response.status(200).json({mensaje: "Esta disponible"})
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
        var client = await poolClient.connect()
        try{
            validateCheck(request,response)
            var idAskIn = request.query.idAsk;
            var result = await client.query("SELECT initialTime FROM Ask WHERE idAsk = $1", [idAskIn]);
            if (result.rows[0].initialtime === null){
                response.status(200).json({mensaje: "Aun no ha sido aceptada"})
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



const historial = (request, response) => {
    (async () => {

        var client = await poolAdmin.connect()

        try{
            validateCheck(request,response)
            var cellphoneIn = request.query.cellphone;
            var cellphonetype = request.query.cellphonetype;
            var result;
            if( cellphonetype === 'cellphonedriver'){
                result = await client.query("SELECT * FROM historyDrivers WHERE cellphonedriver = $1;", [cellphoneIn]);
            }
            else{
                result = await client.query("SELECT * FROM historyClients WHERE cellphoneClient = $1;", [cellphoneIn])
            }
            if (result.rowCount === 0){
                response.status(200).json({error: "El usuario no tiene historial aun"})
            }
            else{
                var package = [];
                for (id in result.rows){
                    package[id] = {distance: result.rows[id].distance,
                                    xi:result.rows[id].initialpoint.x, yi: result.rows[id].initialpoint.y,
                                    xf:result.rows[id].finalpoint.x, yf: result.rows[id].finalpoint.y }
                   /*package[id] = result.rows[id]*/
                }
                response.status(200).json({historial: package})
            }
        }finally{
            //cierra la conexion con el cliente
            client.release()
        }
    })().catch(error => console.log({error: error.message}))  
}

const searchFav = (request, response) => {
    (async () => {

        var client = await poolAdmin.connect()

        try{
            validateCheck(request,response)
            var cellphoneIn = request.query.cellphone;
            var coordinateInX = request.query.coordinateX;
            var coordinateInY = request.query.coordinateY;
            var result = await client.query("SELECT * FROM FavCoordinates WHERE cellphoneClient = $1 AND coordinate = GEOMETRY(POINT($2, $3));", [cellphoneIn, coordinateInX, coordinateInY]);
            if( result.rows[0].cellphoneClient === cellphoneIn){
                response.status(200).json({nombre: result.rows[0].nameCoordinate});
            }
            else{
                response.status(200).json({error: "error, la coordenada para el usuario no fue encontrada"});
            }
        }finally{
            //cierra la conexion con el cliente
            client.release()
        }
    })().catch(error => console.log({error: error.message}))  
}


const deleteFav = (request, response) => {
    (async () => {

        var client = await poolAdmin.connect()

        try{
            validateCheck(request,response)
            var cellphoneIn = request.body.cellphone;
            var coordinateXIn = request.body.coordinateX;
            var coordinateYIn = request.body.coordinateY;
            var result = await client.query("DELETE FROM FavCoordinates WHERE cellphoneClient = $1 AND coordinate = GEOMETRY(POINT($2, $3)) RETURNING cellphoneClient;", [cellphoneIn, coordinateXIn, coordinateYIn]);
            if(result.rowCount === 0){
                response.status(200).json({error: "Error al calificar"})
            }
            else{
                response.status(200).json({cellphoneclient: result.rows[0].cellphoneclient});
            }
        }finally{
            //cierra la conexion con el cliente
            client.release()
        }
    })().catch(error => console.log({error: error.message}))  
}

const createFav = (request, response) => {
    (async () => {

        var client = await poolAdmin.connect()

        try{
            validateCheck(request,response)
            var cellphoneIn = request.query.cellphone;
            var coordinateXIn = request.query.coordinateX;
            var coordinateYIn = request.query.coordinateY;
            var nameIn = request.query.name;

            var result = await client.query("INSERT INTO FavCoordinates (cellphoneClient, coordinate, nameCoordinate) VALUES($1, GEOMETRY(POINT($2, $3)), $4) RETURNING cellphoneClient;", [cellphoneIn, coordinateXIn, coordinateYIn, nameIn]);
            
            if(result.rows[0].cellphoneClient === cellphoneIn){
                response.status(200).json({cellphoneclient: result.rows[0].cellphoneclient});
            }
            else{
                response.status(200).json({error: "error al añadir favoritos"})
            }
        }finally{
            //cierra la conexion con el cliente
            client.release()
        }
    })().catch(error => console.log({error: error.message}))  
}

const pagarDeudas = (request, response) => {
    (async () => {

        
        var client = await poolAdmin.connect()

        try{
            
            validateCheck(request,response)
            var cellphoneIn = request.body.cellphone;
            
            var result = await client.query("UPDATE Ask SET pay = true WHERE cellphoneClient = $1 RETURNING cellphoneClient", [cellphoneIn]);
            if(result.rows[0].cellphoneclient === cellphoneIn){
                response.status(200).json({cellphoneclient: result.rows[0].cellphoneclient});
            }
            else{
                response.status(200).json({error: "error al pagar deudas"})
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
    buscarPrimerTaxi,
    buscarCelularConAsk,
    verDisponibilidadCellphone,
    askAceptada,
    moverConductor,
    kilometrosRecorridos,
    ingresarConductor,
    registrarConductor,
    conductor,
    placa,
    cambiarTaxi,
    adicionarTaxi,
    modelos,
    askConductor,
    aceptaConductor,
    crearModelo,
    consultarModelo,
    modificarModelo,
    eliminarModelo,
    finServicio,
    calificar,
    obtenerGps,
    historial,
    searchFav,
    deleteFav,
    createFav,
    pagarDeudas,
}