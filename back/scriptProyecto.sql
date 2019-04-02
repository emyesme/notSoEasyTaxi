DROP TABLE IF EXISTS Client CASCADE;
CREATE TABLE Client (
cellphoneClient VARCHAR(10),
passwordClient VARCHAR(40),
nameClient VARCHAR(40),
address VARCHAR(40),
creditCard VARCHAR(16),
status BOOLEAN,
PRIMARY KEY (cellphoneClient)
);

DROP TABLE IF EXISTS FavCoordinates CASCADE;
CREATE TABLE FavCoordinates (
cellphoneClient VARCHAR(10),
coordinate GEOMETRY,
nameCoordinate VARCHAR(40),

PRIMARY KEY (cellphoneClient, coordinate),
FOREIGN KEY (cellphoneClient) REFERENCES Client(cellphoneClient)
);

DROP TABLE IF EXISTS Driver CASCADE;
CREATE TABLE Driver (
cellphoneDriver VARCHAR(10),
passwordDriver VARCHAR(40),
nameDriver VARCHAR(40),
cc VARCHAR(15),
available BOOLEAN,
numAccount VARCHAR(16),
status BOOLEAN,

PRIMARY KEY (cellphoneDriver)
);

DROP TABLE IF EXISTS Taxi CASCADE;
CREATE TABLE Taxi (
plaque VARCHAR(6),
soat VARCHAR(15),
year INTEGER,
model VARCHAR(15),
trademark VARCHAR(15),
trunk VARCHAR(15),

PRIMARY KEY (plaque)
);

DROP TABLE IF EXISTS Drive CASCADE;
CREATE TABLE Drive (
idReport SERIAL,
cellPhoneDriver VARCHAR(10),
plaque VARCHAR(6),
date TIMESTAMP,

PRIMARY KEY (idReport),
FOREIGN KEY (cellphoneDriver) REFERENCES Driver(cellphoneDriver),
FOREIGN KEY (plaque) REFERENCES Taxi(plaque)
);

DROP TABLE IF EXISTS Ask CASCADE;
CREATE TABLE Ask (
idAsk SERIAL,
cellphoneClient VARCHAR(10),
cellphoneDriver VARCHAR(10),
initialCooridnates GEOMETRY,
finalCooridnates GEOMETRY,
initialTime TIMESTAMP,
finalTime TIMESTAMP,
stars INTEGER,

PRIMARY KEY (idAsk),
FOREIGN KEY (cellphoneClient) REFERENCES Client(cellphoneClient),
FOREIGN KEY (cellphoneDriver) REFERENCES Driver(cellphoneDriver)
);

INSERT INTO Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) VALUES
	('3107307371', md5('hola'), 'Jaime Cuartas', 'Calle Pro', '0000000000000000', true),
	('3101111111', md5('Como os va en vacaciones'), 'Emily Carvajal', 'Calle Noob', '0000000000000001', true);

INSERT INTO FavCoordinates (cellphoneClient, coordinate, nameCoordinate) VALUES
	('3107307371', GEOMETRY(POINT(1,2)), 'Mi casa'),
	('3107307371', GEOMETRY(POINT(1,3)), 'Univalle'),
	('3107307371', GEOMETRY(POINT(2,2)), 'Casa de Emily'),

	('3101111111', GEOMETRY(POINT(2,2)), 'Mi casa'),
	('3101111111', GEOMETRY(POINT(1,3)), 'Univalle'),
	('3101111111', GEOMETRY(POINT(1,2)), 'Casa de Jaime');


INSERT INTO Driver (cellphoneDriver, passwordDriver, nameDriver, cc, available, numAccount, status) VALUES
	('3102222222', md5('123'), 'Mateito', '123', true, '00000000', true),
	('3103333333', md5('123'), 'Valeria', '777', true, '717717', true);

INSERT INTO Taxi (plaque, soat, year, model, trademark, trunk) VALUES
	('VCE317', 'ASD123', 2000, 'GT', 'Mustang', 'Grande'),
	('VCC200', 'ASD124', 2010, 'Camaro', 'Chevrolet', 'Grande'),
	('VCD120', 'ASE123', 2005, 'Portofino', 'Ferrari', 'Mediano'),
	('VCF222', 'ASF125', 2015, 'A7', 'Audi', 'Grande');

INSERT INTO Drive (cellPhoneDriver, plaque, date) VALUES
	/*Mateo manejaba el Camaro, luego manejó el Ferrari y volvió al Camaro*/
	('3102222222', 'VCC200', (TIMESTAMP '2018-05-16T15:36:38.772Z')),
	('3102222222', 'VCD120', (TIMESTAMP '2018-12-28T16:40:00.772Z')),
	('3102222222', 'VCC200', (TIMESTAMP '2019-02-10T12:15:10.772Z')),

	/*Valeria manejaba el Mustang luego maneja el Audi*/
	('3102222222', 'VCE317', (TIMESTAMP '2018-05-16T15:36:38.772Z')),
	('3102222222', 'VCF222', (TIMESTAMP '2018-12-28T10:10:10.772Z')),

INSERT INTO Ask (cellphoneClient, cellphoneDriver, initialCooridnates, finalCooridnates, initialTime, finalTime, stars) VALUES
	/*Jaime fue llevado por Mateo dos veces de la casa a la universidad*/
	(3107307371, 3102222222, GEOMETRY(POINT(1,2)), GEOMETRY(POINT(1,3)), (TIMESTAMP '2019-03-08T08:00:12.772Z'), (TIMESTAMP '2019-03-08T08:30:12.772Z'), 5),
	(3107307371, 3102222222, GEOMETRY(POINT(1,2)), GEOMETRY(POINT(1,3)), (TIMESTAMP '2019-03-09T08:00:00.772Z'), (TIMESTAMP '2019-03-09T09:45:28.772Z'), 4),
	/*Emily fue llevado por Mateo y luego por Valeria*/
	(3101111111, 3102222222, GEOMETRY(POINT(2,2)), GEOMETRY(POINT(1,2)), (TIMESTAMP '2019-03-01T09:00:00.772Z'), (TIMESTAMP '2019-03-01T10:30:12.772Z'), 3),
	(3101111111, 3103333333, GEOMETRY(POINT(3,4)), GEOMETRY(POINT(4,4)), (TIMESTAMP '2019-03-01T15:20:33.772Z'), (TIMESTAMP '2019-03-01T16:01:35.772Z'), 4);


/*Coordendas en X favoritas de todos*/
SELECT ST_X(ST_AsText(coordinate))
FROM FavCoordinates;


/*Celular de cliente y contraseña*/
SELECT * FROM client WHERE cellphoneClient = '3107307371' AND passwordClient = md5('hola') AND status=true;

select * from Drive;

