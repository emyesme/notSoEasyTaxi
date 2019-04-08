CREATE EXTENSION IF NOT EXISTS postgis;

SET ROLE postgres;
--CREATE USER userAdmin WITH PASSWORD '123' superuser;
--SET ROLE userAdmin;

DROP TABLE IF EXISTS Client CASCADE;
CREATE TABLE Client (
cellphoneClient VARCHAR(10),
passwordClient VARCHAR(40),
nameClient VARCHAR(40),
address GEOMETRY,
creditCard VARCHAR(16),
status BOOLEAN,

PRIMARY KEY (cellphoneClient)
);

create index searchCellphoneClient on Client using hash (cellphoneClient);


DROP TABLE IF EXISTS FavCoordinates CASCADE;
CREATE TABLE FavCoordinates (
cellphoneClient VARCHAR(10),
coordinate GEOMETRY,
nameCoordinate VARCHAR(40),

PRIMARY KEY (cellphoneClient, coordinate),
FOREIGN KEY (cellphoneClient) REFERENCES Client(cellphoneClient) ON DELETE CASCADE
);

create index searchNameFavCoordinate on FavCoordinates using hash (cellphoneClient);

DROP TABLE IF EXISTS Driver CASCADE;
CREATE TABLE Driver (
cellphoneDriver VARCHAR(10),
cc VARCHAR(15) UNIQUE,
passwordDriver VARCHAR(40),
nameDriver VARCHAR(40),
available BOOLEAN,
numAccount VARCHAR(16),
status BOOLEAN,

PRIMARY KEY (cellphoneDriver)
);

create index searchCellphoneDriver on Driver using hash (cellphoneDriver);

DROP TABLE IF EXISTS ModelTaxi CASCADE;
CREATE TABLE ModelTaxi (
model VARCHAR(15),
trademark VARCHAR(15),
trunk VARCHAR(15),

PRIMARY KEY (model)
);

create index searchModel on modelTaxi using hash (model);

DROP TABLE IF EXISTS Taxi CASCADE;
CREATE TABLE Taxi (
plaque VARCHAR(6),
soat VARCHAR(15),
year INTEGER,
model VARCHAR(15),

PRIMARY KEY (plaque),
FOREIGN KEY (model) REFERENCES modelTaxi(model)
);

create index searchTaxi on Taxi using hash (plaque);

DROP TABLE IF EXISTS Drive CASCADE;
CREATE TABLE Drive (
idReport SERIAL,
cellPhoneDriver VARCHAR(10),
plaque VARCHAR(6),
date TIMESTAMP,

PRIMARY KEY (idReport),
FOREIGN KEY (cellphoneDriver) REFERENCES Driver(cellphoneDriver) ON DELETE CASCADE,
FOREIGN KEY (plaque) REFERENCES Taxi(plaque)
);

create index searchTaxiDrive on Drive using hash (cellPhoneDriver);

DROP TABLE IF EXISTS Ask CASCADE;
CREATE TABLE Ask (
idAsk SERIAL,
cellphoneClient VARCHAR(10),
cellphoneDriver VARCHAR(10),
initialCoordinates GEOMETRY,
finalCoordinates GEOMETRY,
initialTime TIMESTAMP,
finalTime TIMESTAMP,
stars INTEGER,
pay BOOLEAN,

PRIMARY KEY (idAsk),
FOREIGN KEY (cellphoneClient) REFERENCES Client(cellphoneClient) ON DELETE CASCADE,
FOREIGN KEY (cellphoneDriver) REFERENCES Driver(cellphoneDriver) ON DELETE CASCADE
);

create index searcAskClient on Ask using hash (cellphoneClient);
create index searcAskDriver on Ask using hash (cellphoneDriver);

DROP TABLE IF EXISTS Gps CASCADE;
CREATE TABLE Gps (
plaque VARCHAR(6),
timestamp TIMESTAMP,
coordinate GEOMETRY,

PRIMARY KEY (plaque, timestamp),
FOREIGN KEY (plaque) REFERENCES Taxi(plaque)
);

create index intervalGps on Gps using btree (plaque, timestamp);

/*
DROP USER IF EXISTS clientRole;
CREATE USER clientRole WITH PASSWORD '123';
GRANT SELECT ON TABLE FavCoordinates TO clientRole;

SET ROLE clientRole;
SET ROLE postgres;

DROP ROLE IF EXISTS clientRole;
CREATE ROLE clientRole;
GRANT SELECT ON TABLE FavCoordinates TO clientRole;

SET ROLE clientRole;


/*Client*/
/******************************************/
drop user if exists userClientInsert;
CREATE USER userClientInsert WITH PASSWORD '123';
GRANT INSERT ON TABLE Client TO userClientInsert;

drop user if exists userClientSelect;
CREATE USER userClientSelect WITH PASSWORD '123';
GRANT SELECT ON TABLE Client TO userClientSelect;

drop user if exists userClientUpdate;
CREATE USER userClientUpdate WITH PASSWORD '123';
GRANT UPDATE ON TABLE Client TO userClientUpdate;

drop user if exists userClientDelete;
CREATE USER userClientDelete WITH PASSWORD '123';
GRANT DELETE ON TABLE Client TO userClientDelete;


/*FavCoordinates*/
/******************************************/
drop user if exists userFavCoordinatesInsert;
CREATE USER userFavCoordinatesInsert WITH PASSWORD '123';
GRANT INSERT ON TABLE FavCoordinates TO userFavCoordinatesInsert;

drop user if exists userFavCoordinatesSelect;
CREATE USER userFavCoordinatesSelect WITH PASSWORD '123';
GRANT SELECT ON TABLE FavCoordinates TO userFavCoordinatesSelect;

drop user if exists userFavCoordinatesUpdate;
CREATE USER userFavCoordinatesUpdate WITH PASSWORD '123';
GRANT UPDATE ON TABLE FavCoordinates TO userFavCoordinatesUpdate;

drop user if exists userFavCoordinatesDelete;
CREATE USER userFavCoordinatesDelete WITH PASSWORD '123';
GRANT DELETE ON TABLE FavCoordinates TO userFavCoordinatesDelete;

/*Driver*/
/******************************************/
drop user if exists userDriverInsert;
CREATE USER userDriverInsert WITH PASSWORD '123';
GRANT INSERT ON TABLE Driver TO userDriverInsert;

drop user if exists userDriverSelect;
CREATE USER userDriverSelect WITH PASSWORD '123';
GRANT SELECT ON TABLE Driver TO userDriverSelect;

drop user if exists userDriverUpdate;
CREATE USER userDriverUpdate WITH PASSWORD '123';
GRANT UPDATE ON TABLE Driver TO userDriverUpdate;

drop user if exists userDriverDelete;
CREATE USER userDriverDelete WITH PASSWORD '123';
GRANT DELETE ON TABLE Driver TO userDriverDelete;

/*ModelTaxi*/
/******************************************/
drop user if exists userModelTaxiInsert;
CREATE USER userModelTaxiInsert WITH PASSWORD '123';
GRANT INSERT ON TABLE ModelTaxi TO userModelTaxiInsert;

drop user if exists userModelTaxiSelect;
CREATE USER userModelTaxiSelect WITH PASSWORD '123';
GRANT SELECT ON TABLE ModelTaxi TO userModelTaxiSelect;

drop user if exists userModelTaxiUpdate;
CREATE USER userModelTaxiUpdate WITH PASSWORD '123';
GRANT UPDATE ON TABLE ModelTaxi TO userModelTaxiUpdate;

drop user if exists userModelTaxiDelete;
CREATE USER userModelTaxiDelete WITH PASSWORD '123';
GRANT DELETE ON TABLE ModelTaxi TO userModelTaxiDelete;


/*Taxi*/
/******************************************/
drop user if exists userTaxiInsert;
CREATE USER userTaxiInsert WITH PASSWORD '123';
GRANT INSERT ON TABLE Taxi TO userTaxiInsert;

drop user if exists userTaxiSelect;
CREATE USER userTaxiSelect WITH PASSWORD '123';
GRANT SELECT ON TABLE Taxi TO userTaxiSelect;

drop user if exists userTaxiUpdate;
CREATE USER userTaxiUpdate WITH PASSWORD '123';
GRANT UPDATE ON TABLE Taxi TO userTaxiUpdate;

drop user if exists userTaxiDelete;
CREATE USER userTaxiDelete WITH PASSWORD '123';
GRANT DELETE ON TABLE Taxi TO userTaxiDelete;

/*Drive*/
/******************************************/
drop user if exists userDriveInsert;
CREATE USER userDriveInsert WITH PASSWORD '123';
GRANT INSERT ON TABLE Drive TO userDriveInsert;

drop user if exists userDriveSelect;
CREATE USER userDriveSelect WITH PASSWORD '123';
GRANT SELECT ON TABLE Drive TO userDriveSelect;

drop user if exists userDriveUpdate;
CREATE USER userDriveUpdate WITH PASSWORD '123';
GRANT UPDATE ON TABLE Drive TO userDriveUpdate;

drop user if exists userDriveDelete;
CREATE USER userDriveDelete WITH PASSWORD '123';
GRANT DELETE ON TABLE Drive TO userDriveDelete;

/*Ask*/
/******************************************/
drop user if exists userAskInsert;
CREATE USER userAskInsert WITH PASSWORD '123';
GRANT INSERT ON TABLE Ask TO userAskInsert;

drop user if exists userAskSelect;
CREATE USER userAskSelect WITH PASSWORD '123';
GRANT SELECT ON TABLE Ask TO userAskSelect;

drop user if exists userAskUpdate;
CREATE USER userAskUpdate WITH PASSWORD '123';
GRANT UPDATE ON TABLE Ask TO userAskUpdate;

drop user if exists userAskDelete;
CREATE USER userAskDelete WITH PASSWORD '123';
GRANT DELETE ON TABLE Ask TO userAskDelete;

/*Gps*/
/******************************************/
drop user if exists userGpsInsert;
CREATE USER userGpsInsert WITH PASSWORD '123';
GRANT INSERT ON TABLE Gps TO userGpsInsert;

drop user if exists userGpsSelect;
CREATE USER userGpsSelect WITH PASSWORD '123';
GRANT SELECT ON TABLE Gps TO userGpsSelect;

drop user if exists userGpsUpdate;
CREATE USER userGpsUpdate WITH PASSWORD '123';
GRANT UPDATE ON TABLE Gps TO userGpsUpdate;

drop user if exists userGpsDelete;
CREATE USER userGpsDelete WITH PASSWORD '123';
GRANT DELETE ON TABLE Gps TO userGpsDelete;
*/

INSERT INTO Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) VALUES
	('3107307371', md5('hola'), 'Jaime Cuartas', GEOMETRY(POINT(3.413803722450137,283.4533059597016)),'0000000000000000', true),
	('3101111111', md5('hola'), 'Emily Carvajal', GEOMETRY(POINT(3.3992864819024993,283.4863239526749)),'1100000000000011', true);

INSERT INTO FavCoordinates (cellphoneClient, coordinate, nameCoordinate) VALUES
	('3107307371', GEOMETRY(POINT(3.413803722450137,283.4533059597016)), 'Mi casa'),
	('3107307371', GEOMETRY(POINT(3.375973296733919,283.4671810269356)), 'Univalle'),
	('3107307371', GEOMETRY(POINT(3.3992864819024993,283.4863239526749)), 'Casa de Emily'),

	('3101111111', GEOMETRY(POINT(3.474354999536053,283.4922409057618)), 'Mi Casa'),
	('3101111111', GEOMETRY(POINT(3.4287759029877747,283.52313995361334)), 'Parties Point'),
	('3101111111', GEOMETRY(POINT(3.4387143884393305,283.46443176269537)), 'Casa de Jaime');


INSERT INTO Driver (cellphoneDriver,cc, passwordDriver, nameDriver,  available, numAccount, status) VALUES
	('3102222222','123', md5('123'), 'Mateito',  true, '00000000', true),
	('3103333333','777', md5('123'), 'Valeria',  true, '717717', true);

INSERT INTO modelTaxi (model, trademark, trunk) VALUES 
	('GT', 'Mustang', 'Grande'),
	('Camaro', 'Chevrolet', 'Grande'),
	('Portofino', 'Ferrari', 'Mediano'),
	('A7', 'Audi', 'Grande');

INSERT INTO Taxi (plaque, soat, year, model) VALUES
	('VCE317', 'ASD123', 2000, 'GT'),
	('VCC200', 'ASD124', 2010, 'Camaro'),
	('VCD120', 'ASE123', 2005, 'Portofino'),
	('VCF222', 'ASF125', 2015, 'A7');

INSERT INTO Drive (cellPhoneDriver, plaque, date) VALUES
	/*Mateo manejaba el Camaro, luego manejó el Ferrari y volvió al Camaro*/
	('3102222222', 'VCC200', (TIMESTAMP '2018-05-16T15:36:38.772Z')),
	('3102222222', 'VCD120', (TIMESTAMP '2018-12-28T16:40:00.772Z')),
	('3102222222', 'VCC200', (TIMESTAMP '2019-02-10T12:15:10.772Z')),

	/*Valeria manejaba el Mustang luego maneja el Audi*/
	('3103333333', 'VCE317', (TIMESTAMP '2018-05-16T15:36:38.772Z')),
	('3103333333', 'VCF222', (TIMESTAMP '2018-12-28T10:10:10.772Z'));

INSERT INTO Ask (cellphoneClient, cellphoneDriver, initialCoordinates, finalCoordinates, initialTime, finalTime, stars, pay) VALUES
	/*Jaime fue llevado por Mateo dos veces de la casa a la universidad*/
	(3107307371, 3102222222, GEOMETRY(POINT(3.413803722450137,283.4533059597016)), GEOMETRY(POINT(3.375973296733919,283.4671810269356)), (TIMESTAMP '2019-03-08T08:00:12.772Z'), (TIMESTAMP '2019-03-08T08:30:12.772Z'), 5, false),
	(3107307371, 3102222222, GEOMETRY(POINT(3.413803722450137,283.4533059597016)), GEOMETRY(POINT(3.375973296733919,283.4671810269356)), (TIMESTAMP '2019-03-09T08:00:00.772Z'), (TIMESTAMP '2019-03-09T09:45:28.772Z'), 4,false),
	/*Emily fue llevado por Mateo y luego por Valeria*/
	(3101111111, 3102222222, GEOMETRY(POINT(3.413803722450137,283.4533059597016)), GEOMETRY(POINT(3.4287759029877747,283.52313995361334)), (TIMESTAMP '2019-03-01T09:00:00.772Z'), (TIMESTAMP '2019-03-01T10:30:12.772Z'), 3,false),
	(3101111111, 3103333333, GEOMETRY(POINT(3.474354999536053,283.4922409057618)), GEOMETRY(POINT(3.413803722450137,283.4533059597016)), (TIMESTAMP '2019-03-01T15:20:33.772Z'), (TIMESTAMP '2019-03-01T16:01:35.772Z'), 4,false);


INSERT INTO Gps (plaque, timestamp, coordinate) VALUES
	
	('VCC200', (TIMESTAMP '2019-03-09T09:45:28.772Z'), GEOMETRY(POINT(1,2))),
	('VCC200', (TIMESTAMP '2019-03-10T09:45:28.772Z'), GEOMETRY(POINT(1,3))),
	('VCF222', (TIMESTAMP '2019-02-08T09:45:28.772Z'), GEOMETRY(POINT(1,1)));
	
explain select * from client where cellphoneClient = '6176166' and status = true;

/*Se retorna de tipo integer porque los cobros se haran teniendo en cuenta metros y no unidades más pequeñas*/
CREATE OR REPLACE FUNCTION distance(GEOMETRY, GEOMETRY) RETURNS INTEGER AS $$
BEGIN 
	RETURN ST_DistanceSphere($1, $2);
END
$$ LANGUAGE plpgsql;

SELECT distance(GEOMETRY(POINT (3.3993721615737833, 283.48647683858877)), GEOMETRY(POINT (3.3994524862586832, 283.48640173673635)));

CREATE OR REPLACE VIEW lastCoordinatesPlaques AS (
	WITH
	driverLastRecord AS 
	(select Driver.cellphoneDriver,  max(date) AS date
	from driver inner join drive on driver.cellphonedriver=drive.cellphonedriver
	where available = true
	group by (driver.cellphoneDriver)),

	driverLastPlaque AS
	(SELECT Drive.cellphoneDriver, Drive.plaque
	FROM driverLastRecord INNER JOIN drive 
	ON driverLastRecord.cellphonedriver = drive.cellphoneDriver
	AND driverLastRecord.date = drive.date ),

	plaqueLastRecord AS
	(SELECT driverLastPlaque.cellphoneDriver, driverLastPlaque.plaque, max(timestamp) AS timestamp
	FROM driverLastPlaque INNER JOIN Gps
	ON driverLastPlaque.plaque = Gps.plaque
	GROUP BY (driverLastPlaque.cellphoneDriver, driverLastPlaque.plaque)),

	plaqueLastCoordinate AS
	(SELECT plaqueLastRecord.cellphoneDriver, plaqueLastRecord.plaque, Gps.coordinate
	FROM plaqueLastRecord INNER JOIN Gps
	ON plaqueLastRecord.plaque = Gps.plaque
	AND plaqueLastRecord.timestamp = Gps.timestamp)
	
SELECT * FROM plaqueLastCoordinate
);


CREATE OR REPLACE FUNCTION findDriver (cellphoneClientIn VARCHAR(10), initialCoordinatesIn GEOMETRY, finalCoordinatesIn GEOMETRY) 
RETURNS INTEGER AS $$
DECLARE
	idAskOut INTEGER;
	closerDriver VARCHAR(10) := (SELECT cellphoneDriver
								FROM (select row_number() over (order by (distance(coordinate, initialCoordinatesIn))) rn, * from lastCoordinatesPlaques)
								AS closer
								where rn = 1 LIMIT 1);
BEGIN
	INSERT INTO Ask (cellphoneClient, cellphoneDriver, initialCoordinates, finalCoordinates, initialTime, finalTime, stars) VALUES
						(cellphoneClientIn, closerDriver, initialCoordinatesIn, finalCoordinatesIn, NULL, NULL, NULL) 
						RETURNING idAsk
						INTO idAskOut;
	RETURN idAskOut;
END;
$$ LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION meters (cellphoneIn VARCHAR(10))
RETURNS INTEGER AS $$
BEGIN
	RETURN (SELECT SUM(distance(initialCoordinates, finalCoordinates)) 
			FROM Ask
			GROUP BY (cellphoneIn));
END;
$$ LANGUAGE plpgsql;


SELECT * FROM lastcoordinatesplaques WHERE cellphoneDriver = '3102222222';
SELECT findDriver('3107307371', GEOMETRY(POINT (1,1)), GEOMETRY(POINT(10,10)) );
