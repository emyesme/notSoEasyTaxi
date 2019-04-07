CREATE EXTENSION IF NOT EXISTS postgis;

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

DROP TABLE IF EXISTS modelTaxi CASCADE;
CREATE TABLE modelTaxi (
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

DROP USER IF EXISTS clientRole;
CREATE USER clientRole WITH PASSWORD '123';
GRANT SELECT ON TABLE FavCoordinates TO clientRole;

SET ROLE clientRole;
SET ROLE postgres;
/*
DROP ROLE IF EXISTS clientRole;
CREATE ROLE clientRole;
GRANT SELECT ON TABLE FavCoordinates TO clientRole;

SET ROLE clientRole;
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
	('3102222222', 'VCE317', (TIMESTAMP '2018-05-16T15:36:38.772Z')),
	('3102222222', 'VCF222', (TIMESTAMP '2018-12-28T10:10:10.772Z'));

INSERT INTO Ask (cellphoneClient, cellphoneDriver, initialCoordinates, finalCoordinates, initialTime, finalTime, stars) VALUES
	/*Jaime fue llevado por Mateo dos veces de la casa a la universidad*/
	(3107307371, 3102222222, GEOMETRY(POINT(1,2)), GEOMETRY(POINT(1,3)), (TIMESTAMP '2019-03-08T08:00:12.772Z'), (TIMESTAMP '2019-03-08T08:30:12.772Z'), 5),	(3107307371, 3102222222, GEOMETRY(POINT(1,2)), GEOMETRY(POINT(1,3)), (TIMESTAMP '2019-03-09T08:00:00.772Z'), (TIMESTAMP '2019-03-09T09:45:28.772Z'), 4),
	/*Emily fue llevado por Mateo y luego por Valeria*/
	(3101111111, 3102222222, GEOMETRY(POINT(2,2)), GEOMETRY(POINT(1,2)), (TIMESTAMP '2019-03-01T09:00:00.772Z'), (TIMESTAMP '2019-03-01T10:30:12.772Z'), 3),
	(3101111111, 3103333333, GEOMETRY(POINT(3,4)), GEOMETRY(POINT(4,4)), (TIMESTAMP '2019-03-01T15:20:33.772Z'), (TIMESTAMP '2019-03-01T16:01:35.772Z'), 4);



insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4305385', md5('123'), 'Nixie', GEOMETRY(POINT (1, 1)), '5210342561751905', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3723168', md5('123'), 'Petronille', GEOMETRY(POINT (1, 1)), '7746830548001325', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4003488', md5('123'), 'Gian', GEOMETRY(POINT (1, 1)), '7136371278156468', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3615559', md5('123'), 'Mario', GEOMETRY(POINT (1, 1)), '2321141728487162', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0002709', md5('123'), 'Wynny', GEOMETRY(POINT (1, 1)), '1013953962368058', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7295300', md5('123'), 'Kort', GEOMETRY(POINT (1, 1)), '2700863186636602', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9072615', md5('123'), 'Lewes', GEOMETRY(POINT (1, 1)), '3422495307845908', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1354267', md5('123'), 'Daren', GEOMETRY(POINT (1, 1)), '8538905964378631', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0088643', md5('123'), 'Ailsun', GEOMETRY(POINT (1, 1)), '6261692256702535', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2184436', md5('123'), 'Isabelita', GEOMETRY(POINT (1, 1)), '7233710313742045', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7939627', md5('123'), 'Cacilie', GEOMETRY(POINT (1, 1)), '2670055883186992', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1240124', md5('123'), 'Den', GEOMETRY(POINT (1, 1)), '7039924111325210', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7900307', md5('123'), 'Daryle', GEOMETRY(POINT (1, 1)), '4478752373871404', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0810928', md5('123'), 'Hakeem', GEOMETRY(POINT (1, 1)), '4497716068978872', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6929487', md5('123'), 'Uriah', GEOMETRY(POINT (1, 1)), '8830398686337065', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6138622', md5('123'), 'Flinn', GEOMETRY(POINT (1, 1)), '3838793229770496', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0128129', md5('123'), 'Neysa', GEOMETRY(POINT (1, 1)), '6329521340404333', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8864224', md5('123'), 'Arther', GEOMETRY(POINT (1, 1)), '7463986361110638', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0541488', md5('123'), 'Benedetto', GEOMETRY(POINT (1, 1)), '7841620740786548', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1612920', md5('123'), 'Casie', GEOMETRY(POINT (1, 1)), '6419739810388369', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2274721', md5('123'), 'Arlyn', GEOMETRY(POINT (1, 1)), '7069879914517358', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5942063', md5('123'), 'Georgianna', GEOMETRY(POINT (1, 1)), '3477884748795757', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0160774', md5('123'), 'Lester', GEOMETRY(POINT (1, 1)), '7937964448387430', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5253752', md5('123'), 'Jephthah', GEOMETRY(POINT (1, 1)), '7749600731377882', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8198841', md5('123'), 'Cori', GEOMETRY(POINT (1, 1)), '0182897602116213', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0686361', md5('123'), 'Homerus', GEOMETRY(POINT (1, 1)), '6827355457635199', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9422041', md5('123'), 'Adria', GEOMETRY(POINT (1, 1)), '2905503827497236', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9369128', md5('123'), 'Elwood', GEOMETRY(POINT (1, 1)), '6294479354156145', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2713549', md5('123'), 'Phil', GEOMETRY(POINT (1, 1)), '4345600168193874', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3902321', md5('123'), 'Kristin', GEOMETRY(POINT (1, 1)), '1705196139963110', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4148412', md5('123'), 'Madelle', GEOMETRY(POINT (1, 1)), '3892645141804282', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6831554', md5('123'), 'Ema', GEOMETRY(POINT (1, 1)), '1740933540929185', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3882930', md5('123'), 'Nessie', GEOMETRY(POINT (1, 1)), '9761117944800013', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5253168', md5('123'), 'Jan', GEOMETRY(POINT (1, 1)), '5035014141617728', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2954606', md5('123'), 'Carolin', GEOMETRY(POINT (1, 1)), '9953124674281715', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8321625', md5('123'), 'Ellie', GEOMETRY(POINT (1, 1)), '3349857033066493', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4510777', md5('123'), 'Myca', GEOMETRY(POINT (1, 1)), '1445618345088950', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4750292', md5('123'), 'Stanford', GEOMETRY(POINT (1, 1)), '9071051245838105', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6363378', md5('123'), 'Lanita', GEOMETRY(POINT (1, 1)), '6040839575083538', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9154803', md5('123'), 'Kayley', GEOMETRY(POINT (1, 1)), '5501154699448990', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6126635', md5('123'), 'Ephrem', GEOMETRY(POINT (1, 1)), '7575134110118014', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1000793', md5('123'), 'Emmalynn', GEOMETRY(POINT (1, 1)), '6022720781141094', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1459299', md5('123'), 'Victoria', GEOMETRY(POINT (1, 1)), '0879478121471212', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9054911', md5('123'), 'Brad', GEOMETRY(POINT (1, 1)), '5981934181405619', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9599096', md5('123'), 'Tobey', GEOMETRY(POINT (1, 1)), '5528961424229221', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5546667', md5('123'), 'Ulick', GEOMETRY(POINT (1, 1)), '2589719975537186', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3133815', md5('123'), 'Amalia', GEOMETRY(POINT (1, 1)), '2990698512454478', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8365013', md5('123'), 'Lynne', GEOMETRY(POINT (1, 1)), '6492315711396398', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7504886', md5('123'), 'Rickie', GEOMETRY(POINT (1, 1)), '7317762539492034', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3713421', md5('123'), 'Dallon', GEOMETRY(POINT (1, 1)), '1155603046354533', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7423447', md5('123'), 'Lari', GEOMETRY(POINT (1, 1)), '4996342816114370', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0513770', md5('123'), 'Connie', GEOMETRY(POINT (1, 1)), '6857723319516129', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1754908', md5('123'), 'Eryn', GEOMETRY(POINT (1, 1)), '4039384365426815', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6358765', md5('123'), 'Ferrel', GEOMETRY(POINT (1, 1)), '8390931188256721', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8418137', md5('123'), 'Karena', GEOMETRY(POINT (1, 1)), '8316428167720938', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0593716', md5('123'), 'Anne-marie', GEOMETRY(POINT (1, 1)), '4490793815374079', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6975782', md5('123'), 'Robbin', GEOMETRY(POINT (1, 1)), '9621679820403237', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4543487', md5('123'), 'Floris', GEOMETRY(POINT (1, 1)), '2908957772825387', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4036544', md5('123'), 'Toiboid', GEOMETRY(POINT (1, 1)), '6687494765286289', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9607380', md5('123'), 'Cesya', GEOMETRY(POINT (1, 1)), '2678635537722423', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6241520', md5('123'), 'Sybilla', GEOMETRY(POINT (1, 1)), '2723947480141000', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6634618', md5('123'), 'Monty', GEOMETRY(POINT (1, 1)), '6865715036535297', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2726493', md5('123'), 'Curry', GEOMETRY(POINT (1, 1)), '5868016972618344', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7534402', md5('123'), 'Giulia', GEOMETRY(POINT (1, 1)), '2448096428282099', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7134489', md5('123'), 'Sanford', GEOMETRY(POINT (1, 1)), '8434086048933716', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4800087', md5('123'), 'Carey', GEOMETRY(POINT (1, 1)), '5261326983995659', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3562471', md5('123'), 'Cordula', GEOMETRY(POINT (1, 1)), '7026286575221062', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9243401', md5('123'), 'Titos', GEOMETRY(POINT (1, 1)), '2049247054827582', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1694857', md5('123'), 'Kyle', GEOMETRY(POINT (1, 1)), '1541197376429449', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7757936', md5('123'), 'Dorine', GEOMETRY(POINT (1, 1)), '8379423923803282', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0648446', md5('123'), 'Damara', GEOMETRY(POINT (1, 1)), '5402739048688378', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4007556', md5('123'), 'Germana', GEOMETRY(POINT (1, 1)), '1730814141092444', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0685064', md5('123'), 'Larine', GEOMETRY(POINT (1, 1)), '4752632175313350', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6755923', md5('123'), 'Violante', GEOMETRY(POINT (1, 1)), '6441933781081576', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8760096', md5('123'), 'Emmalynne', GEOMETRY(POINT (1, 1)), '1284748238005732', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1986695', md5('123'), 'Larisa', GEOMETRY(POINT (1, 1)), '0948760344818865', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4487125', md5('123'), 'King', GEOMETRY(POINT (1, 1)), '9916339371695652', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7528164', md5('123'), 'Kennan', GEOMETRY(POINT (1, 1)), '6504930106068991', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7691148', md5('123'), 'Dinny', GEOMETRY(POINT (1, 1)), '5236777995130246', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6156451', md5('123'), 'Melisa', GEOMETRY(POINT (1, 1)), '6177716013968529', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4238822', md5('123'), 'Dorey', GEOMETRY(POINT (1, 1)), '4744992128887464', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9409817', md5('123'), 'Suzette', GEOMETRY(POINT (1, 1)), '8200284629242770', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8148095', md5('123'), 'Oswald', GEOMETRY(POINT (1, 1)), '8226843196079235', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9397055', md5('123'), 'Danella', GEOMETRY(POINT (1, 1)), '6093887778472689', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0283266', md5('123'), 'Jamaal', GEOMETRY(POINT (1, 1)), '0354832493872482', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0644477', md5('123'), 'Robbie', GEOMETRY(POINT (1, 1)), '8288937689105318', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0212301', md5('123'), 'Olimpia', GEOMETRY(POINT (1, 1)), '7651202583976518', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6107772', md5('123'), 'Madeline', GEOMETRY(POINT (1, 1)), '9220984612321343', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8194775', md5('123'), 'Bank', GEOMETRY(POINT (1, 1)), '9032006007453339', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4273609', md5('123'), 'Leone', GEOMETRY(POINT (1, 1)), '7158119182803110', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8524828', md5('123'), 'Belinda', GEOMETRY(POINT (1, 1)), '4917578722035884', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8335446', md5('123'), 'Codie', GEOMETRY(POINT (1, 1)), '8177084995153589', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6762437', md5('123'), 'Mischa', GEOMETRY(POINT (1, 1)), '7843150722966113', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5762425', md5('123'), 'Hillary', GEOMETRY(POINT (1, 1)), '1400644799213485', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0412417', md5('123'), 'Lorena', GEOMETRY(POINT (1, 1)), '1451203165897440', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2240058', md5('123'), 'Rowena', GEOMETRY(POINT (1, 1)), '8548559552392109', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9944845', md5('123'), 'Marillin', GEOMETRY(POINT (1, 1)), '4315724917289702', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9103970', md5('123'), 'Franz', GEOMETRY(POINT (1, 1)), '0083234723242177', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1803380', md5('123'), 'Layney', GEOMETRY(POINT (1, 1)), '6803617716520241', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0252774', md5('123'), 'Dania', GEOMETRY(POINT (1, 1)), '0208030051746690', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6429308', md5('123'), 'Olivia', GEOMETRY(POINT (1, 1)), '4269461435457565', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1886542', md5('123'), 'Gothart', GEOMETRY(POINT (1, 1)), '8055994864682487', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3226390', md5('123'), 'Etta', GEOMETRY(POINT (1, 1)), '9776865802323684', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6669798', md5('123'), 'Gabie', GEOMETRY(POINT (1, 1)), '4839336924905046', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1675272', md5('123'), 'Nissie', GEOMETRY(POINT (1, 1)), '2418523919582461', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2408975', md5('123'), 'Blayne', GEOMETRY(POINT (1, 1)), '4332827266160852', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3224783', md5('123'), 'Isa', GEOMETRY(POINT (1, 1)), '6003850669165531', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2029751', md5('123'), 'Sybilla', GEOMETRY(POINT (1, 1)), '2532093078834834', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9147127', md5('123'), 'Don', GEOMETRY(POINT (1, 1)), '7101214616168950', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6791919', md5('123'), 'Arvin', GEOMETRY(POINT (1, 1)), '1709793042395934', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5811446', md5('123'), 'Corilla', GEOMETRY(POINT (1, 1)), '2606989871472544', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2112163', md5('123'), 'Othello', GEOMETRY(POINT (1, 1)), '9144938492422930', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5291861', md5('123'), 'Claybourne', GEOMETRY(POINT (1, 1)), '6215442474965863', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2042512', md5('123'), 'Mike', GEOMETRY(POINT (1, 1)), '0229106466738615', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1353034', md5('123'), 'Honey', GEOMETRY(POINT (1, 1)), '0646025304570748', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6642399', md5('123'), 'Nicolas', GEOMETRY(POINT (1, 1)), '0500164335327168', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9217776', md5('123'), 'Kattie', GEOMETRY(POINT (1, 1)), '2316456999516116', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2924588', md5('123'), 'Torey', GEOMETRY(POINT (1, 1)), '9237681597749535', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3538020', md5('123'), 'Xenia', GEOMETRY(POINT (1, 1)), '2368262428520786', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1889020', md5('123'), 'Salvatore', GEOMETRY(POINT (1, 1)), '7111155702088155', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5741944', md5('123'), 'Lauri', GEOMETRY(POINT (1, 1)), '1336297738265686', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3337603', md5('123'), 'Breena', GEOMETRY(POINT (1, 1)), '2317268975306740', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2797526', md5('123'), 'Jacintha', GEOMETRY(POINT (1, 1)), '8595178615249023', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8880705', md5('123'), 'Tildy', GEOMETRY(POINT (1, 1)), '6003566749577353', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7345476', md5('123'), 'Jacquie', GEOMETRY(POINT (1, 1)), '7763571128158939', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3280680', md5('123'), 'Paloma', GEOMETRY(POINT (1, 1)), '9564407101070858', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1219866', md5('123'), 'Orelie', GEOMETRY(POINT (1, 1)), '6622638645576763', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0873885', md5('123'), 'Bert', GEOMETRY(POINT (1, 1)), '2810426989296320', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7388706', md5('123'), 'Maire', GEOMETRY(POINT (1, 1)), '2414353059318790', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8182639', md5('123'), 'Ashlan', GEOMETRY(POINT (1, 1)), '1885931160533859', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7754610', md5('123'), 'Joelle', GEOMETRY(POINT (1, 1)), '6975154489938635', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2093641', md5('123'), 'Sky', GEOMETRY(POINT (1, 1)), '1456295496111959', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2865128', md5('123'), 'Wilton', GEOMETRY(POINT (1, 1)), '1488119541980063', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8552003', md5('123'), 'Dionisio', GEOMETRY(POINT (1, 1)), '6218955215034854', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6010263', md5('123'), 'Jaye', GEOMETRY(POINT (1, 1)), '5958922457334858', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4986312', md5('123'), 'Birk', GEOMETRY(POINT (1, 1)), '8551419816881936', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6058361', md5('123'), 'Trish', GEOMETRY(POINT (1, 1)), '4127773198161990', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7776727', md5('123'), 'Briggs', GEOMETRY(POINT (1, 1)), '0989100128488136', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9512691', md5('123'), 'Miles', GEOMETRY(POINT (1, 1)), '3382160602700468', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5364251', md5('123'), 'Sascha', GEOMETRY(POINT (1, 1)), '2718293758798403', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0066434', md5('123'), 'Barclay', GEOMETRY(POINT (1, 1)), '1498553008210465', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8936520', md5('123'), 'Brendin', GEOMETRY(POINT (1, 1)), '7229361936475700', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8582836', md5('123'), 'Gabrila', GEOMETRY(POINT (1, 1)), '4177037914826084', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3033266', md5('123'), 'Page', GEOMETRY(POINT (1, 1)), '4815388985339437', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6896559', md5('123'), 'Rubi', GEOMETRY(POINT (1, 1)), '6414322502594327', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0184558', md5('123'), 'Yolane', GEOMETRY(POINT (1, 1)), '1109042448683153', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4771467', md5('123'), 'Rosemaria', GEOMETRY(POINT (1, 1)), '2383949376432809', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9543812', md5('123'), 'Orbadiah', GEOMETRY(POINT (1, 1)), '0000026534906196', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7717279', md5('123'), 'Rutherford', GEOMETRY(POINT (1, 1)), '6711830801610582', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6722300', md5('123'), 'Evelin', GEOMETRY(POINT (1, 1)), '2493723354607419', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7886608', md5('123'), 'Lauren', GEOMETRY(POINT (1, 1)), '2593941897703651', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5348679', md5('123'), 'Tilly', GEOMETRY(POINT (1, 1)), '6879389410153364', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7104953', md5('123'), 'Tulley', GEOMETRY(POINT (1, 1)), '5451983332962431', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4763369', md5('123'), 'Baxy', GEOMETRY(POINT (1, 1)), '3127925038534312', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7865910', md5('123'), 'Zebadiah', GEOMETRY(POINT (1, 1)), '4196923174050046', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6576678', md5('123'), 'Sydney', GEOMETRY(POINT (1, 1)), '0502860448712507', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3966548', md5('123'), 'Edi', GEOMETRY(POINT (1, 1)), '2327606026859375', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6246894', md5('123'), 'Morlee', GEOMETRY(POINT (1, 1)), '7934361430459133', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0339130', md5('123'), 'Tymon', GEOMETRY(POINT (1, 1)), '4685962009831251', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7512678', md5('123'), 'Barbe', GEOMETRY(POINT (1, 1)), '9273343386619777', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0363934', md5('123'), 'Inez', GEOMETRY(POINT (1, 1)), '7027613542744347', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0691449', md5('123'), 'Aguistin', GEOMETRY(POINT (1, 1)), '4448091752269471', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3209898', md5('123'), 'Danielle', GEOMETRY(POINT (1, 1)), '0519453970793552', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4560483', md5('123'), 'Jeannette', GEOMETRY(POINT (1, 1)), '9606613307396872', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5456389', md5('123'), 'Waylon', GEOMETRY(POINT (1, 1)), '1652306690259891', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0976959', md5('123'), 'Spike', GEOMETRY(POINT (1, 1)), '0380292221694594', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0805981', md5('123'), 'Kyla', GEOMETRY(POINT (1, 1)), '9427051370019823', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8654115', md5('123'), 'Patrice', GEOMETRY(POINT (1, 1)), '0892076475186054', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3244873', md5('123'), 'Ferdinand', GEOMETRY(POINT (1, 1)), '8623880413229650', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1642084', md5('123'), 'Selene', GEOMETRY(POINT (1, 1)), '1743704583761953', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7757033', md5('123'), 'Raymond', GEOMETRY(POINT (1, 1)), '9657487481578549', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8250627', md5('123'), 'Egor', GEOMETRY(POINT (1, 1)), '3633725683636588', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8726757', md5('123'), 'Fielding', GEOMETRY(POINT (1, 1)), '4581911118757324', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6253474', md5('123'), 'Nannie', GEOMETRY(POINT (1, 1)), '5358443667232868', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2011042', md5('123'), 'Cosimo', GEOMETRY(POINT (1, 1)), '0880477029338343', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2468014', md5('123'), 'Cathie', GEOMETRY(POINT (1, 1)), '0214370914159823', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9944212', md5('123'), 'Libby', GEOMETRY(POINT (1, 1)), '3917160825897060', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8196487', md5('123'), 'Flory', GEOMETRY(POINT (1, 1)), '0207752165321245', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9522546', md5('123'), 'Jae', GEOMETRY(POINT (1, 1)), '8087769899078065', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9080142', md5('123'), 'Lina', GEOMETRY(POINT (1, 1)), '3033798260172608', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0975928', md5('123'), 'Brockie', GEOMETRY(POINT (1, 1)), '9348304257945744', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6769743', md5('123'), 'Gabriella', GEOMETRY(POINT (1, 1)), '7924764044703946', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9071041', md5('123'), 'Danie', GEOMETRY(POINT (1, 1)), '7251018744718094', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5729330', md5('123'), 'Daphna', GEOMETRY(POINT (1, 1)), '0385533030561090', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3732675', md5('123'), 'Ferrel', GEOMETRY(POINT (1, 1)), '6167698250870742', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1681226', md5('123'), 'Israel', GEOMETRY(POINT (1, 1)), '8906817619377267', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2534373', md5('123'), 'Gamaliel', GEOMETRY(POINT (1, 1)), '2628410575705964', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7598310', md5('123'), 'Haslett', GEOMETRY(POINT (1, 1)), '1688006939433392', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4630054', md5('123'), 'Taddeo', GEOMETRY(POINT (1, 1)), '1807813923765034', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7933617', md5('123'), 'Cyndy', GEOMETRY(POINT (1, 1)), '4452695201623144', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4667866', md5('123'), 'Tamara', GEOMETRY(POINT (1, 1)), '7801160565619954', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0849239', md5('123'), 'Sisely', GEOMETRY(POINT (1, 1)), '6310379177715587', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5111817', md5('123'), 'Abbye', GEOMETRY(POINT (1, 1)), '0242362946880548', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1379540', md5('123'), 'Hilda', GEOMETRY(POINT (1, 1)), '5249492004041454', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9804573', md5('123'), 'Debra', GEOMETRY(POINT (1, 1)), '5976216996288417', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8225221', md5('123'), 'Renaud', GEOMETRY(POINT (1, 1)), '0091885654450929', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8658510', md5('123'), 'Loutitia', GEOMETRY(POINT (1, 1)), '5425012026410772', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8608421', md5('123'), 'Etienne', GEOMETRY(POINT (1, 1)), '7613266645099664', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7617593', md5('123'), 'Orelia', GEOMETRY(POINT (1, 1)), '6245206234282513', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8118574', md5('123'), 'Willey', GEOMETRY(POINT (1, 1)), '2144506750817695', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4593775', md5('123'), 'Ashien', GEOMETRY(POINT (1, 1)), '0621943842933238', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4151932', md5('123'), 'Beau', GEOMETRY(POINT (1, 1)), '4888022089513402', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1027438', md5('123'), 'Reggie', GEOMETRY(POINT (1, 1)), '2594797380069833', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3745890', md5('123'), 'Gizela', GEOMETRY(POINT (1, 1)), '6363664532681271', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1616152', md5('123'), 'Ailina', GEOMETRY(POINT (1, 1)), '5208763589568098', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5581106', md5('123'), 'Jedediah', GEOMETRY(POINT (1, 1)), '2339939748600423', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6826926', md5('123'), 'Ezmeralda', GEOMETRY(POINT (1, 1)), '7124406511618230', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0970796', md5('123'), 'Ophelia', GEOMETRY(POINT (1, 1)), '7658087371341992', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0169500', md5('123'), 'Britni', GEOMETRY(POINT (1, 1)), '9055450975507274', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6035828', md5('123'), 'Devon', GEOMETRY(POINT (1, 1)), '6983951920926158', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9810472', md5('123'), 'Fredericka', GEOMETRY(POINT (1, 1)), '1186476638078836', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4530877', md5('123'), 'Reinwald', GEOMETRY(POINT (1, 1)), '4159274677510981', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2563172', md5('123'), 'Darbie', GEOMETRY(POINT (1, 1)), '2426161991808779', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9207453', md5('123'), 'Morry', GEOMETRY(POINT (1, 1)), '1421374376946513', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8872544', md5('123'), 'Papageno', GEOMETRY(POINT (1, 1)), '0322462458666478', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2465005', md5('123'), 'Aarika', GEOMETRY(POINT (1, 1)), '7285514466287953', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4687107', md5('123'), 'Papageno', GEOMETRY(POINT (1, 1)), '8210464236438245', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7701093', md5('123'), 'Dorey', GEOMETRY(POINT (1, 1)), '6441915695240697', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9661174', md5('123'), 'Hansiain', GEOMETRY(POINT (1, 1)), '7773830077859313', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0754630', md5('123'), 'Hamish', GEOMETRY(POINT (1, 1)), '9721097457694695', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4213259', md5('123'), 'Townie', GEOMETRY(POINT (1, 1)), '4890401341584249', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1567162', md5('123'), 'Darice', GEOMETRY(POINT (1, 1)), '6956896738687188', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6939857', md5('123'), 'Jonathon', GEOMETRY(POINT (1, 1)), '4120964985076753', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2754883', md5('123'), 'Mitzi', GEOMETRY(POINT (1, 1)), '2542389800735313', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7060815', md5('123'), 'Jocelyne', GEOMETRY(POINT (1, 1)), '2322987888011080', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7873840', md5('123'), 'Babita', GEOMETRY(POINT (1, 1)), '2175618076179839', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5648314', md5('123'), 'Ros', GEOMETRY(POINT (1, 1)), '9481451664707538', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4212086', md5('123'), 'Ban', GEOMETRY(POINT (1, 1)), '7662394884569904', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0345587', md5('123'), 'Erinna', GEOMETRY(POINT (1, 1)), '6794080911082374', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2810795', md5('123'), 'Alidia', GEOMETRY(POINT (1, 1)), '5570641162385618', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4644910', md5('123'), 'Nanni', GEOMETRY(POINT (1, 1)), '5425192739849443', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0204505', md5('123'), 'Davide', GEOMETRY(POINT (1, 1)), '9087706913628908', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2204089', md5('123'), 'Sonny', GEOMETRY(POINT (1, 1)), '4237312468722704', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8349258', md5('123'), 'Filbert', GEOMETRY(POINT (1, 1)), '2018281246990735', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0907596', md5('123'), 'Cassie', GEOMETRY(POINT (1, 1)), '2183077951668629', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2922141', md5('123'), 'Laurie', GEOMETRY(POINT (1, 1)), '4220921566977547', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6369667', md5('123'), 'Mohandas', GEOMETRY(POINT (1, 1)), '1264775360934558', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5886959', md5('123'), 'Mart', GEOMETRY(POINT (1, 1)), '1828967990229005', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8686355', md5('123'), 'Micky', GEOMETRY(POINT (1, 1)), '7140829705117232', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2337452', md5('123'), 'Vivianne', GEOMETRY(POINT (1, 1)), '6256072118226457', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9939152', md5('123'), 'Noami', GEOMETRY(POINT (1, 1)), '6654781969253379', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0979830', md5('123'), 'Siward', GEOMETRY(POINT (1, 1)), '9288705090268527', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6125298', md5('123'), 'Alicia', GEOMETRY(POINT (1, 1)), '8172304859865978', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5014886', md5('123'), 'Ciro', GEOMETRY(POINT (1, 1)), '6812103544365477', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1002218', md5('123'), 'Rebe', GEOMETRY(POINT (1, 1)), '5911721245605494', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6075215', md5('123'), 'Judon', GEOMETRY(POINT (1, 1)), '4786800510214038', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4433082', md5('123'), 'Orbadiah', GEOMETRY(POINT (1, 1)), '1525544075342228', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1254985', md5('123'), 'Adan', GEOMETRY(POINT (1, 1)), '4006770996314110', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2315427', md5('123'), 'Robbyn', GEOMETRY(POINT (1, 1)), '9357341806613794', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3916051', md5('123'), 'Camala', GEOMETRY(POINT (1, 1)), '2060045823943316', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7508248', md5('123'), 'Royall', GEOMETRY(POINT (1, 1)), '9735114948985923', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7007307', md5('123'), 'Darby', GEOMETRY(POINT (1, 1)), '2877274771816967', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8402749', md5('123'), 'Roze', GEOMETRY(POINT (1, 1)), '0174518665664790', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8480358', md5('123'), 'Blisse', GEOMETRY(POINT (1, 1)), '2270134548907038', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5823269', md5('123'), 'Galina', GEOMETRY(POINT (1, 1)), '3433757231791697', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1654883', md5('123'), 'Clea', GEOMETRY(POINT (1, 1)), '4536978892525303', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7143101', md5('123'), 'Bendick', GEOMETRY(POINT (1, 1)), '3959252298036750', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7887653', md5('123'), 'Janeta', GEOMETRY(POINT (1, 1)), '1557808597623188', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2352841', md5('123'), 'Anny', GEOMETRY(POINT (1, 1)), '8325165213603798', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3237636', md5('123'), 'Wandis', GEOMETRY(POINT (1, 1)), '2256078009211839', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9765121', md5('123'), 'Torrence', GEOMETRY(POINT (1, 1)), '1129635171071835', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3928096', md5('123'), 'Cele', GEOMETRY(POINT (1, 1)), '6201106286197283', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7160609', md5('123'), 'Jessica', GEOMETRY(POINT (1, 1)), '5115411347256803', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4784070', md5('123'), 'Cirilo', GEOMETRY(POINT (1, 1)), '2974504517034168', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8443192', md5('123'), 'Ricky', GEOMETRY(POINT (1, 1)), '5313024386597414', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5425751', md5('123'), 'Frederic', GEOMETRY(POINT (1, 1)), '2773952596475501', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1246834', md5('123'), 'Roseann', GEOMETRY(POINT (1, 1)), '4745783119604789', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7636577', md5('123'), 'Paxon', GEOMETRY(POINT (1, 1)), '9441948521779122', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5758765', md5('123'), 'Gerry', GEOMETRY(POINT (1, 1)), '0802710767575132', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3142680', md5('123'), 'Alva', GEOMETRY(POINT (1, 1)), '2218838342333592', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1026296', md5('123'), 'Albertina', GEOMETRY(POINT (1, 1)), '8583427496256084', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6383909', md5('123'), 'Claude', GEOMETRY(POINT (1, 1)), '7888201539853672', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3317575', md5('123'), 'Francoise', GEOMETRY(POINT (1, 1)), '8547409414123965', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3186843', md5('123'), 'Devlin', GEOMETRY(POINT (1, 1)), '1643115571493084', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8703742', md5('123'), 'Janella', GEOMETRY(POINT (1, 1)), '1636809636249403', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0765879', md5('123'), 'Juliet', GEOMETRY(POINT (1, 1)), '9204893147802897', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4124876', md5('123'), 'Inger', GEOMETRY(POINT (1, 1)), '8686878433073376', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4537124', md5('123'), 'Dannie', GEOMETRY(POINT (1, 1)), '1426992390147462', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4907938', md5('123'), 'Pierce', GEOMETRY(POINT (1, 1)), '1478599891626138', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5412117', md5('123'), 'Cele', GEOMETRY(POINT (1, 1)), '0544071630189783', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5019904', md5('123'), 'Inna', GEOMETRY(POINT (1, 1)), '3257358130054073', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9886038', md5('123'), 'Rafael', GEOMETRY(POINT (1, 1)), '4727518133423932', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9515873', md5('123'), 'Bradford', GEOMETRY(POINT (1, 1)), '6896494707016659', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1089323', md5('123'), 'Fanya', GEOMETRY(POINT (1, 1)), '9773339397087522', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3073356', md5('123'), 'Augusta', GEOMETRY(POINT (1, 1)), '0833409131867752', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0932870', md5('123'), 'Helga', GEOMETRY(POINT (1, 1)), '7006012420063996', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4940301', md5('123'), 'Orella', GEOMETRY(POINT (1, 1)), '6733486269329603', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7677107', md5('123'), 'Lettie', GEOMETRY(POINT (1, 1)), '8899776201453658', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1408812', md5('123'), 'Hew', GEOMETRY(POINT (1, 1)), '4440094925057704', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2362478', md5('123'), 'Honey', GEOMETRY(POINT (1, 1)), '7712973750369836', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6978077', md5('123'), 'Tomasine', GEOMETRY(POINT (1, 1)), '4960272614992108', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8399444', md5('123'), 'Raine', GEOMETRY(POINT (1, 1)), '9998562903289849', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5856813', md5('123'), 'Iggie', GEOMETRY(POINT (1, 1)), '0678669375660208', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9818516', md5('123'), 'Che', GEOMETRY(POINT (1, 1)), '9883821375240749', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7390602', md5('123'), 'Gregorius', GEOMETRY(POINT (1, 1)), '8406985425547808', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1621747', md5('123'), 'Wallace', GEOMETRY(POINT (1, 1)), '5146409422316547', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4428304', md5('123'), 'Tresa', GEOMETRY(POINT (1, 1)), '7274776463677142', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1427301', md5('123'), 'Julienne', GEOMETRY(POINT (1, 1)), '5165733360461566', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5789849', md5('123'), 'Trudie', GEOMETRY(POINT (1, 1)), '4023010945826706', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8712233', md5('123'), 'Bartlet', GEOMETRY(POINT (1, 1)), '5956594192485605', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1021511', md5('123'), 'Ansley', GEOMETRY(POINT (1, 1)), '6900535005038498', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7621621', md5('123'), 'Nolie', GEOMETRY(POINT (1, 1)), '6517516676030407', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8323454', md5('123'), 'Augustus', GEOMETRY(POINT (1, 1)), '6004126728110985', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2443551', md5('123'), 'Merrick', GEOMETRY(POINT (1, 1)), '1772066783434015', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1907023', md5('123'), 'Elliot', GEOMETRY(POINT (1, 1)), '5049221259836424', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7637094', md5('123'), 'Cosette', GEOMETRY(POINT (1, 1)), '1727093724746800', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8634877', md5('123'), 'Sallyann', GEOMETRY(POINT (1, 1)), '8510033880534265', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6708607', md5('123'), 'Galina', GEOMETRY(POINT (1, 1)), '7444454473265251', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4599770', md5('123'), 'Sylas', GEOMETRY(POINT (1, 1)), '0583330152850638', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2321887', md5('123'), 'Oliy', GEOMETRY(POINT (1, 1)), '6147531593054021', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1721456', md5('123'), 'Artur', GEOMETRY(POINT (1, 1)), '1802126371673450', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3492298', md5('123'), 'Tulley', GEOMETRY(POINT (1, 1)), '1462079862179831', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0916726', md5('123'), 'Jeth', GEOMETRY(POINT (1, 1)), '2824761067016819', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1191876', md5('123'), 'Virgilio', GEOMETRY(POINT (1, 1)), '0755014397128726', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0383210', md5('123'), 'Lynne', GEOMETRY(POINT (1, 1)), '7723178938335947', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4470132', md5('123'), 'Jeannine', GEOMETRY(POINT (1, 1)), '4682162731086943', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8656367', md5('123'), 'Katine', GEOMETRY(POINT (1, 1)), '0591327023799319', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1743372', md5('123'), 'Lock', GEOMETRY(POINT (1, 1)), '1126941077885886', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6393265', md5('123'), 'Stanford', GEOMETRY(POINT (1, 1)), '6386895419028155', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4052853', md5('123'), 'Virge', GEOMETRY(POINT (1, 1)), '7366223791395200', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3128838', md5('123'), 'Neville', GEOMETRY(POINT (1, 1)), '7130271948291757', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1295839', md5('123'), 'Lancelot', GEOMETRY(POINT (1, 1)), '8721386321107518', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2465528', md5('123'), 'Fredrick', GEOMETRY(POINT (1, 1)), '2209622205166310', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9353877', md5('123'), 'Leigh', GEOMETRY(POINT (1, 1)), '4081059230331550', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7920935', md5('123'), 'Willamina', GEOMETRY(POINT (1, 1)), '6459349185363986', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8653582', md5('123'), 'Kimmy', GEOMETRY(POINT (1, 1)), '0959016091937362', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3475939', md5('123'), 'Freeman', GEOMETRY(POINT (1, 1)), '0588800903329460', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3974643', md5('123'), 'Deanna', GEOMETRY(POINT (1, 1)), '8959820916361149', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9887037', md5('123'), 'Mychal', GEOMETRY(POINT (1, 1)), '8605857976951597', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0643080', md5('123'), 'Giles', GEOMETRY(POINT (1, 1)), '0653596589123970', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9451277', md5('123'), 'Tomasina', GEOMETRY(POINT (1, 1)), '3927770999901434', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3015034', md5('123'), 'Dyan', GEOMETRY(POINT (1, 1)), '7075741947101173', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5300735', md5('123'), 'Tremayne', GEOMETRY(POINT (1, 1)), '2868892502334055', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6510330', md5('123'), 'Fredia', GEOMETRY(POINT (1, 1)), '2864416807459582', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8497365', md5('123'), 'Fionna', GEOMETRY(POINT (1, 1)), '4792088639279042', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0693679', md5('123'), 'Koressa', GEOMETRY(POINT (1, 1)), '4580042622317466', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2133483', md5('123'), 'Zonda', GEOMETRY(POINT (1, 1)), '1413758217457453', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0708019', md5('123'), 'Francis', GEOMETRY(POINT (1, 1)), '0770001219159106', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9252347', md5('123'), 'Valeda', GEOMETRY(POINT (1, 1)), '6613945768699511', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6545107', md5('123'), 'Eugine', GEOMETRY(POINT (1, 1)), '9094257186344829', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9847353', md5('123'), 'Marcello', GEOMETRY(POINT (1, 1)), '3703700223822677', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8577898', md5('123'), 'Bee', GEOMETRY(POINT (1, 1)), '0618530946416579', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5059085', md5('123'), 'Agnesse', GEOMETRY(POINT (1, 1)), '6303933255586871', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4605382', md5('123'), 'Norrie', GEOMETRY(POINT (1, 1)), '1251563615048140', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9209074', md5('123'), 'Ransell', GEOMETRY(POINT (1, 1)), '8284949005950407', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6661845', md5('123'), 'Pepito', GEOMETRY(POINT (1, 1)), '3810372473008640', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9444912', md5('123'), 'Yvonne', GEOMETRY(POINT (1, 1)), '6043915006794126', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1875792', md5('123'), 'Elayne', GEOMETRY(POINT (1, 1)), '0621841319209785', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9216965', md5('123'), 'Ernie', GEOMETRY(POINT (1, 1)), '6703197358479991', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7190187', md5('123'), 'Humbert', GEOMETRY(POINT (1, 1)), '4378044084012149', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9002793', md5('123'), 'Ginger', GEOMETRY(POINT (1, 1)), '7871530587123003', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5509851', md5('123'), 'Giselle', GEOMETRY(POINT (1, 1)), '8145390955966355', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9281958', md5('123'), 'Britt', GEOMETRY(POINT (1, 1)), '5340722098001787', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2692503', md5('123'), 'Cchaddie', GEOMETRY(POINT (1, 1)), '9492350090760121', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9305327', md5('123'), 'Alexandrina', GEOMETRY(POINT (1, 1)), '7354743036637791', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2377566', md5('123'), 'Lilian', GEOMETRY(POINT (1, 1)), '0378483477559139', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2226176', md5('123'), 'Gracia', GEOMETRY(POINT (1, 1)), '5416538991538262', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4164024', md5('123'), 'Jenny', GEOMETRY(POINT (1, 1)), '3154638555243011', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1651959', md5('123'), 'Redd', GEOMETRY(POINT (1, 1)), '3696389697318738', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3568348', md5('123'), 'Viola', GEOMETRY(POINT (1, 1)), '0065865277793375', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7058351', md5('123'), 'Denni', GEOMETRY(POINT (1, 1)), '2860549934442170', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1356630', md5('123'), 'Witty', GEOMETRY(POINT (1, 1)), '0508521231540348', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0436354', md5('123'), 'Eric', GEOMETRY(POINT (1, 1)), '0597491336360462', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5264847', md5('123'), 'Jorry', GEOMETRY(POINT (1, 1)), '5697939933164461', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8034584', md5('123'), 'Katerine', GEOMETRY(POINT (1, 1)), '8455826964133150', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6821733', md5('123'), 'Beverlie', GEOMETRY(POINT (1, 1)), '8922455502378825', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0118028', md5('123'), 'Fairlie', GEOMETRY(POINT (1, 1)), '3968432787283481', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6539945', md5('123'), 'Bob', GEOMETRY(POINT (1, 1)), '4245278698195139', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0369879', md5('123'), 'Nil', GEOMETRY(POINT (1, 1)), '9267551197405935', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3614099', md5('123'), 'Udell', GEOMETRY(POINT (1, 1)), '6254106234188916', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4698366', md5('123'), 'Wandis', GEOMETRY(POINT (1, 1)), '1165526881154454', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4735254', md5('123'), 'Giraldo', GEOMETRY(POINT (1, 1)), '6422218828060048', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5925894', md5('123'), 'Adelina', GEOMETRY(POINT (1, 1)), '5081022809572716', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0750123', md5('123'), 'Halimeda', GEOMETRY(POINT (1, 1)), '2822906493357512', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1542453', md5('123'), 'Brooks', GEOMETRY(POINT (1, 1)), '6006289227689229', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6902946', md5('123'), 'Rosene', GEOMETRY(POINT (1, 1)), '4925680104345725', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5995204', md5('123'), 'Matthias', GEOMETRY(POINT (1, 1)), '2884667963376470', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2326350', md5('123'), 'Eryn', GEOMETRY(POINT (1, 1)), '5258671341130468', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4409864', md5('123'), 'Tandy', GEOMETRY(POINT (1, 1)), '6392573620305937', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7518247', md5('123'), 'Clayton', GEOMETRY(POINT (1, 1)), '8498509309750030', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3675758', md5('123'), 'Sandor', GEOMETRY(POINT (1, 1)), '8161785687934616', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2181134', md5('123'), 'Goldie', GEOMETRY(POINT (1, 1)), '2302281581759322', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5424718', md5('123'), 'Alfons', GEOMETRY(POINT (1, 1)), '2192188188401552', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6944715', md5('123'), 'Corri', GEOMETRY(POINT (1, 1)), '2476612698939409', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8018063', md5('123'), 'Minny', GEOMETRY(POINT (1, 1)), '7512063824810884', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8287196', md5('123'), 'Desirae', GEOMETRY(POINT (1, 1)), '0661439719847583', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2674257', md5('123'), 'Ora', GEOMETRY(POINT (1, 1)), '3064217370988945', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1363217', md5('123'), 'Rollo', GEOMETRY(POINT (1, 1)), '0560762976336261', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6281451', md5('123'), 'Dennie', GEOMETRY(POINT (1, 1)), '8811532551647177', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9493656', md5('123'), 'Lavina', GEOMETRY(POINT (1, 1)), '5708444954136266', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6299440', md5('123'), 'Shirleen', GEOMETRY(POINT (1, 1)), '6308225647973107', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0186350', md5('123'), 'Lammond', GEOMETRY(POINT (1, 1)), '2847218595163846', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9683998', md5('123'), 'Zacherie', GEOMETRY(POINT (1, 1)), '2372882401444021', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1032843', md5('123'), 'Marley', GEOMETRY(POINT (1, 1)), '6260765760134238', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3463049', md5('123'), 'Devlen', GEOMETRY(POINT (1, 1)), '5034148528401876', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8136065', md5('123'), 'Shurlocke', GEOMETRY(POINT (1, 1)), '5561400321785416', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4767672', md5('123'), 'Tally', GEOMETRY(POINT (1, 1)), '1016376652406936', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0431334', md5('123'), 'Emlyn', GEOMETRY(POINT (1, 1)), '8385628880266411', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8573714', md5('123'), 'Shermie', GEOMETRY(POINT (1, 1)), '7071083062749854', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5659047', md5('123'), 'Evita', GEOMETRY(POINT (1, 1)), '0495232024987685', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5774557', md5('123'), 'Mayor', GEOMETRY(POINT (1, 1)), '7766124895180855', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3297775', md5('123'), 'Aigneis', GEOMETRY(POINT (1, 1)), '0272868732598318', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3678188', md5('123'), 'Jane', GEOMETRY(POINT (1, 1)), '7895805444410784', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5887099', md5('123'), 'Valenka', GEOMETRY(POINT (1, 1)), '0413652259184387', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5740028', md5('123'), 'Lindy', GEOMETRY(POINT (1, 1)), '9235970102169282', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5131386', md5('123'), 'Kelly', GEOMETRY(POINT (1, 1)), '1604378709778981', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5730544', md5('123'), 'Grant', GEOMETRY(POINT (1, 1)), '6950734212538000', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0247995', md5('123'), 'Carroll', GEOMETRY(POINT (1, 1)), '0348500224707963', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9563724', md5('123'), 'Husain', GEOMETRY(POINT (1, 1)), '5257488617197385', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0429072', md5('123'), 'Eleanore', GEOMETRY(POINT (1, 1)), '0217509482530940', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9508850', md5('123'), 'Craggie', GEOMETRY(POINT (1, 1)), '9310583624566889', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1282861', md5('123'), 'Arturo', GEOMETRY(POINT (1, 1)), '2664127152441304', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0974553', md5('123'), 'Marcus', GEOMETRY(POINT (1, 1)), '1523938709953408', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0003574', md5('123'), 'Derk', GEOMETRY(POINT (1, 1)), '5318180438518583', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4794810', md5('123'), 'Torre', GEOMETRY(POINT (1, 1)), '4653451596524714', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4875038', md5('123'), 'Enrichetta', GEOMETRY(POINT (1, 1)), '3541731939592099', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9026978', md5('123'), 'Silva', GEOMETRY(POINT (1, 1)), '6507527308060565', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9747638', md5('123'), 'Glenn', GEOMETRY(POINT (1, 1)), '5655994799855018', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7420017', md5('123'), 'Paquito', GEOMETRY(POINT (1, 1)), '6661425548690816', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2578812', md5('123'), 'Jamaal', GEOMETRY(POINT (1, 1)), '6802150101709539', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1189341', md5('123'), 'Brew', GEOMETRY(POINT (1, 1)), '9158155543615828', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1944086', md5('123'), 'Leona', GEOMETRY(POINT (1, 1)), '6752664114816458', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8087758', md5('123'), 'Minette', GEOMETRY(POINT (1, 1)), '8728733728600231', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3222790', md5('123'), 'Mead', GEOMETRY(POINT (1, 1)), '0738421152406887', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5420230', md5('123'), 'Manda', GEOMETRY(POINT (1, 1)), '1334740713143553', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2352876', md5('123'), 'Heath', GEOMETRY(POINT (1, 1)), '9577175571438107', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0954748', md5('123'), 'Irma', GEOMETRY(POINT (1, 1)), '9427970971541872', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5978025', md5('123'), 'Corrinne', GEOMETRY(POINT (1, 1)), '6559263643808010', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6522603', md5('123'), 'Arron', GEOMETRY(POINT (1, 1)), '6079892588094378', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5390571', md5('123'), 'Peri', GEOMETRY(POINT (1, 1)), '2589474656935065', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9667004', md5('123'), 'Jeanette', GEOMETRY(POINT (1, 1)), '5410364251034665', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8835438', md5('123'), 'Steffi', GEOMETRY(POINT (1, 1)), '4306976773533922', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8591345', md5('123'), 'Claudia', GEOMETRY(POINT (1, 1)), '3358521988161283', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1564267', md5('123'), 'Nicky', GEOMETRY(POINT (1, 1)), '9133268117392361', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7370332', md5('123'), 'Starr', GEOMETRY(POINT (1, 1)), '9493369019590568', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6424275', md5('123'), 'Rickie', GEOMETRY(POINT (1, 1)), '0567804568608720', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9043558', md5('123'), 'Marnie', GEOMETRY(POINT (1, 1)), '1178625431138600', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1290702', md5('123'), 'Dennie', GEOMETRY(POINT (1, 1)), '7861176719602640', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8330828', md5('123'), 'Jephthah', GEOMETRY(POINT (1, 1)), '9635920855442429', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2275177', md5('123'), 'Natasha', GEOMETRY(POINT (1, 1)), '2681354782878393', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8362316', md5('123'), 'Barbe', GEOMETRY(POINT (1, 1)), '7552054357476985', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7513900', md5('123'), 'Ruprecht', GEOMETRY(POINT (1, 1)), '0476228696229271', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9817014', md5('123'), 'Salvador', GEOMETRY(POINT (1, 1)), '9881746381523681', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2359857', md5('123'), 'Lorelei', GEOMETRY(POINT (1, 1)), '4592047030925351', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4130945', md5('123'), 'Tate', GEOMETRY(POINT (1, 1)), '8731217178102533', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1833489', md5('123'), 'Brit', GEOMETRY(POINT (1, 1)), '6316473835046595', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7213065', md5('123'), 'Lewiss', GEOMETRY(POINT (1, 1)), '9095526675501089', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0549051', md5('123'), 'Crin', GEOMETRY(POINT (1, 1)), '0419742234268566', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4506017', md5('123'), 'Flory', GEOMETRY(POINT (1, 1)), '3154506603006302', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7837399', md5('123'), 'Glenda', GEOMETRY(POINT (1, 1)), '6902290167785552', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2910543', md5('123'), 'Galven', GEOMETRY(POINT (1, 1)), '4780677805064818', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2842419', md5('123'), 'Philomena', GEOMETRY(POINT (1, 1)), '9579435382319032', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2634571', md5('123'), 'David', GEOMETRY(POINT (1, 1)), '4916700118911209', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7898276', md5('123'), 'Meryl', GEOMETRY(POINT (1, 1)), '6287992804180260', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3278265', md5('123'), 'Gabie', GEOMETRY(POINT (1, 1)), '3255644283640870', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6593996', md5('123'), 'Kessia', GEOMETRY(POINT (1, 1)), '1028825531098021', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1764745', md5('123'), 'Ernie', GEOMETRY(POINT (1, 1)), '1796433921581253', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5338349', md5('123'), 'Susanna', GEOMETRY(POINT (1, 1)), '0651020233134757', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6672151', md5('123'), 'Tobey', GEOMETRY(POINT (1, 1)), '4971387180717302', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6481960', md5('123'), 'Birch', GEOMETRY(POINT (1, 1)), '3415342872614055', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4213119', md5('123'), 'Clarey', GEOMETRY(POINT (1, 1)), '3807358141090789', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5674021', md5('123'), 'Celestia', GEOMETRY(POINT (1, 1)), '5553490857602554', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8612855', md5('123'), 'Ruthy', GEOMETRY(POINT (1, 1)), '9088587218671478', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8368613', md5('123'), 'Kellen', GEOMETRY(POINT (1, 1)), '9136966746748226', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6931019', md5('123'), 'Patricia', GEOMETRY(POINT (1, 1)), '1488274647326199', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7170864', md5('123'), 'Myrle', GEOMETRY(POINT (1, 1)), '8307293339448966', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5919478', md5('123'), 'Eleonore', GEOMETRY(POINT (1, 1)), '9578469192853545', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9104328', md5('123'), 'Aundrea', GEOMETRY(POINT (1, 1)), '2838701117754122', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1190668', md5('123'), 'Alfredo', GEOMETRY(POINT (1, 1)), '6817291921276988', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1666207', md5('123'), 'Claiborn', GEOMETRY(POINT (1, 1)), '7125823474562775', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4095018', md5('123'), 'Steffi', GEOMETRY(POINT (1, 1)), '4398954842324693', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6098908', md5('123'), 'Winslow', GEOMETRY(POINT (1, 1)), '6300381598123066', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6173658', md5('123'), 'Lisa', GEOMETRY(POINT (1, 1)), '7855518726967361', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5907871', md5('123'), 'Corrina', GEOMETRY(POINT (1, 1)), '7821686771293420', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6086238', md5('123'), 'Gordan', GEOMETRY(POINT (1, 1)), '8784075496997491', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6518798', md5('123'), 'Ludovika', GEOMETRY(POINT (1, 1)), '9877817527848124', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5653380', md5('123'), 'Kit', GEOMETRY(POINT (1, 1)), '0599458658996569', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1075097', md5('123'), 'Tiertza', GEOMETRY(POINT (1, 1)), '0544134683572810', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2155131', md5('123'), 'Raviv', GEOMETRY(POINT (1, 1)), '7547274396839928', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7810463', md5('123'), 'Andonis', GEOMETRY(POINT (1, 1)), '4621482649688563', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8629434', md5('123'), 'Siusan', GEOMETRY(POINT (1, 1)), '1533288444071645', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8237875', md5('123'), 'Cordy', GEOMETRY(POINT (1, 1)), '6362873713656358', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5578118', md5('123'), 'Irina', GEOMETRY(POINT (1, 1)), '5596678439129850', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2459314', md5('123'), 'Ronnie', GEOMETRY(POINT (1, 1)), '7348044577119147', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7676751', md5('123'), 'Astra', GEOMETRY(POINT (1, 1)), '7873997423668912', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0890936', md5('123'), 'Daffi', GEOMETRY(POINT (1, 1)), '1648050141885535', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4081047', md5('123'), 'Row', GEOMETRY(POINT (1, 1)), '7962617770405499', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3456911', md5('123'), 'Clarabelle', GEOMETRY(POINT (1, 1)), '2226199109790984', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1052496', md5('123'), 'Bobine', GEOMETRY(POINT (1, 1)), '7986483202616396', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7061992', md5('123'), 'Irvin', GEOMETRY(POINT (1, 1)), '9671931137522046', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9414920', md5('123'), 'Enrica', GEOMETRY(POINT (1, 1)), '6217475605142504', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2139822', md5('123'), 'Gwenette', GEOMETRY(POINT (1, 1)), '6953673485924411', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2951341', md5('123'), 'Beilul', GEOMETRY(POINT (1, 1)), '7894770531616416', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4159361', md5('123'), 'Greta', GEOMETRY(POINT (1, 1)), '6995313264444399', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6658949', md5('123'), 'Joline', GEOMETRY(POINT (1, 1)), '9997695973158501', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1936094', md5('123'), 'Brigida', GEOMETRY(POINT (1, 1)), '8086410467816373', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9066562', md5('123'), 'Theodoric', GEOMETRY(POINT (1, 1)), '8849031894936047', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3992061', md5('123'), 'Bernete', GEOMETRY(POINT (1, 1)), '4562104147040589', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1717317', md5('123'), 'Chryste', GEOMETRY(POINT (1, 1)), '1870502928758657', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6970961', md5('123'), 'Correy', GEOMETRY(POINT (1, 1)), '2826447381103405', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6587915', md5('123'), 'Ronni', GEOMETRY(POINT (1, 1)), '0695506381502229', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1906014', md5('123'), 'Meg', GEOMETRY(POINT (1, 1)), '3675624903706022', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0457944', md5('123'), 'Jonathon', GEOMETRY(POINT (1, 1)), '2091219613433599', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0258743', md5('123'), 'Bronny', GEOMETRY(POINT (1, 1)), '3098070224779374', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6013739', md5('123'), 'Darin', GEOMETRY(POINT (1, 1)), '3546095981355712', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3203878', md5('123'), 'Levy', GEOMETRY(POINT (1, 1)), '8662760104916928', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9701719', md5('123'), 'Hetty', GEOMETRY(POINT (1, 1)), '7256553031600545', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3330408', md5('123'), 'Corrie', GEOMETRY(POINT (1, 1)), '4680693295725155', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9699258', md5('123'), 'Laurens', GEOMETRY(POINT (1, 1)), '4269934459673813', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3987591', md5('123'), 'Waylin', GEOMETRY(POINT (1, 1)), '3635229793825238', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6811369', md5('123'), 'Colas', GEOMETRY(POINT (1, 1)), '7488290461176011', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7887084', md5('123'), 'Sibyl', GEOMETRY(POINT (1, 1)), '4749090870829867', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8717144', md5('123'), 'Cicily', GEOMETRY(POINT (1, 1)), '5807723662272406', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0425848', md5('123'), 'Dana', GEOMETRY(POINT (1, 1)), '8575920949384774', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7201176', md5('123'), 'Peggy', GEOMETRY(POINT (1, 1)), '6238207416386862', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3670945', md5('123'), 'Diane-marie', GEOMETRY(POINT (1, 1)), '3152014348621404', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1353030', md5('123'), 'Carlo', GEOMETRY(POINT (1, 1)), '3748180698350136', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8728919', md5('123'), 'Cherise', GEOMETRY(POINT (1, 1)), '7186958385010689', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6875117', md5('123'), 'Heinrik', GEOMETRY(POINT (1, 1)), '7093473513586578', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7140849', md5('123'), 'Kit', GEOMETRY(POINT (1, 1)), '4335548089910646', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6666600', md5('123'), 'Carter', GEOMETRY(POINT (1, 1)), '8384219883895244', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1760662', md5('123'), 'Marve', GEOMETRY(POINT (1, 1)), '3010226628908303', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1768796', md5('123'), 'Lyle', GEOMETRY(POINT (1, 1)), '6895152568940786', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2692966', md5('123'), 'Loralee', GEOMETRY(POINT (1, 1)), '6697459680232815', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1232847', md5('123'), 'Alfonso', GEOMETRY(POINT (1, 1)), '0899152788554583', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1349005', md5('123'), 'Farrel', GEOMETRY(POINT (1, 1)), '1990882854530157', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8157299', md5('123'), 'Carlos', GEOMETRY(POINT (1, 1)), '1317069300727578', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5972058', md5('123'), 'Lorianne', GEOMETRY(POINT (1, 1)), '4413940270343722', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8894822', md5('123'), 'Johanna', GEOMETRY(POINT (1, 1)), '3540711956269296', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6833405', md5('123'), 'Brenden', GEOMETRY(POINT (1, 1)), '5462129000399410', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3196794', md5('123'), 'Sonja', GEOMETRY(POINT (1, 1)), '9001992987359486', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7074377', md5('123'), 'Samantha', GEOMETRY(POINT (1, 1)), '7838516454225981', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3404033', md5('123'), 'Syd', GEOMETRY(POINT (1, 1)), '2466932629627346', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1483060', md5('123'), 'Rice', GEOMETRY(POINT (1, 1)), '9001835327771277', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4075539', md5('123'), 'Neile', GEOMETRY(POINT (1, 1)), '5112925949664914', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0566624', md5('123'), 'Gretel', GEOMETRY(POINT (1, 1)), '1384597513849567', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6649844', md5('123'), 'Seamus', GEOMETRY(POINT (1, 1)), '9663989908257567', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1497488', md5('123'), 'Ravi', GEOMETRY(POINT (1, 1)), '4858802999010499', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7695783', md5('123'), 'Abelard', GEOMETRY(POINT (1, 1)), '7223809591548728', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0157685', md5('123'), 'Sam', GEOMETRY(POINT (1, 1)), '5031411721913800', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1424142', md5('123'), 'Jacquette', GEOMETRY(POINT (1, 1)), '5337150448786468', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8205056', md5('123'), 'Whittaker', GEOMETRY(POINT (1, 1)), '3867746077642844', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5818323', md5('123'), 'Amerigo', GEOMETRY(POINT (1, 1)), '1200037328985183', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4465852', md5('123'), 'Doroteya', GEOMETRY(POINT (1, 1)), '7195292380840431', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5845046', md5('123'), 'Jamesy', GEOMETRY(POINT (1, 1)), '7908905667603534', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1269407', md5('123'), 'Jamie', GEOMETRY(POINT (1, 1)), '1890293423137364', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9165936', md5('123'), 'Luella', GEOMETRY(POINT (1, 1)), '0712313082999649', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7113742', md5('123'), 'Carissa', GEOMETRY(POINT (1, 1)), '0524310192942540', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2372432', md5('123'), 'Isidora', GEOMETRY(POINT (1, 1)), '3973864238504791', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2645452', md5('123'), 'Wilton', GEOMETRY(POINT (1, 1)), '3479246384272997', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4127805', md5('123'), 'Rosemonde', GEOMETRY(POINT (1, 1)), '7197419751694827', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0379074', md5('123'), 'Kristel', GEOMETRY(POINT (1, 1)), '6712086098859498', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9844748', md5('123'), 'Giacopo', GEOMETRY(POINT (1, 1)), '3447619012718016', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6651485', md5('123'), 'Dugald', GEOMETRY(POINT (1, 1)), '9616422455280596', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0292865', md5('123'), 'Raquel', GEOMETRY(POINT (1, 1)), '7903803954148311', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7509865', md5('123'), 'Konstanze', GEOMETRY(POINT (1, 1)), '5330795480059097', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9894540', md5('123'), 'Euphemia', GEOMETRY(POINT (1, 1)), '2602135006940753', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3349871', md5('123'), 'Lorettalorna', GEOMETRY(POINT (1, 1)), '4106200859715164', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2770176', md5('123'), 'Bea', GEOMETRY(POINT (1, 1)), '7950094024574881', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0746378', md5('123'), 'Judon', GEOMETRY(POINT (1, 1)), '3415992065425661', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0524937', md5('123'), 'Sarine', GEOMETRY(POINT (1, 1)), '6304264009223112', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3544392', md5('123'), 'Valene', GEOMETRY(POINT (1, 1)), '6338922273520524', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1708811', md5('123'), 'Elton', GEOMETRY(POINT (1, 1)), '4011427268796542', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0529143', md5('123'), 'Payton', GEOMETRY(POINT (1, 1)), '1910467980123093', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8143018', md5('123'), 'Deva', GEOMETRY(POINT (1, 1)), '6000376414098426', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7405028', md5('123'), 'Sunny', GEOMETRY(POINT (1, 1)), '6966514677891974', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9751622', md5('123'), 'Clint', GEOMETRY(POINT (1, 1)), '5884046941905270', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8380450', md5('123'), 'Latia', GEOMETRY(POINT (1, 1)), '8233144114274223', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0581190', md5('123'), 'Jimmy', GEOMETRY(POINT (1, 1)), '9913988822469725', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0950493', md5('123'), 'Judd', GEOMETRY(POINT (1, 1)), '2031050262127766', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1189487', md5('123'), 'Salmon', GEOMETRY(POINT (1, 1)), '1149183501936794', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0701557', md5('123'), 'Selia', GEOMETRY(POINT (1, 1)), '3750565174863001', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5926372', md5('123'), 'Nicole', GEOMETRY(POINT (1, 1)), '3559127547656665', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4274573', md5('123'), 'Palm', GEOMETRY(POINT (1, 1)), '5782446540405265', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2032290', md5('123'), 'Lodovico', GEOMETRY(POINT (1, 1)), '5323024654361457', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9202533', md5('123'), 'Gil', GEOMETRY(POINT (1, 1)), '1437164960570804', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2624122', md5('123'), 'Davita', GEOMETRY(POINT (1, 1)), '6566066120627930', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0875386', md5('123'), 'Ermina', GEOMETRY(POINT (1, 1)), '7249516481128538', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4047576', md5('123'), 'Saunders', GEOMETRY(POINT (1, 1)), '4690497616591248', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9859035', md5('123'), 'Aurlie', GEOMETRY(POINT (1, 1)), '1364702170998943', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9053762', md5('123'), 'Carmella', GEOMETRY(POINT (1, 1)), '4146728882298968', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1224719', md5('123'), 'Geri', GEOMETRY(POINT (1, 1)), '4424675172179299', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8212555', md5('123'), 'Abbi', GEOMETRY(POINT (1, 1)), '8832110040588691', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4781335', md5('123'), 'Lori', GEOMETRY(POINT (1, 1)), '7443455042317578', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6721841', md5('123'), 'Tann', GEOMETRY(POINT (1, 1)), '8980934930771224', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6854347', md5('123'), 'Dorris', GEOMETRY(POINT (1, 1)), '6406035462619574', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9373829', md5('123'), 'Cassey', GEOMETRY(POINT (1, 1)), '7679423289837094', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9288922', md5('123'), 'Keith', GEOMETRY(POINT (1, 1)), '6775493589374814', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8740215', md5('123'), 'Netty', GEOMETRY(POINT (1, 1)), '3686666333586392', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8471488', md5('123'), 'Leah', GEOMETRY(POINT (1, 1)), '2658779745440419', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8604616', md5('123'), 'Roanna', GEOMETRY(POINT (1, 1)), '9403453914798120', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9276061', md5('123'), 'Ann', GEOMETRY(POINT (1, 1)), '8079104820035594', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5930675', md5('123'), 'Alistair', GEOMETRY(POINT (1, 1)), '9760408041398571', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0018178', md5('123'), 'Jaclin', GEOMETRY(POINT (1, 1)), '9055441847735820', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6161985', md5('123'), 'Corbett', GEOMETRY(POINT (1, 1)), '1672997991584316', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1425342', md5('123'), 'Gardiner', GEOMETRY(POINT (1, 1)), '9483223305818615', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8724368', md5('123'), 'Kristian', GEOMETRY(POINT (1, 1)), '3259393763599845', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6484495', md5('123'), 'Kev', GEOMETRY(POINT (1, 1)), '9510203358125543', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1439323', md5('123'), 'Lyndy', GEOMETRY(POINT (1, 1)), '3179749950413755', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4424305', md5('123'), 'Marcos', GEOMETRY(POINT (1, 1)), '1321372944430935', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3391299', md5('123'), 'Kathryn', GEOMETRY(POINT (1, 1)), '8187694645493525', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4913759', md5('123'), 'Barry', GEOMETRY(POINT (1, 1)), '6743967741141366', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6458649', md5('123'), 'Ashlan', GEOMETRY(POINT (1, 1)), '8116274137220232', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5776026', md5('123'), 'Nealson', GEOMETRY(POINT (1, 1)), '0419121377831381', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8265821', md5('123'), 'Aubert', GEOMETRY(POINT (1, 1)), '1795049586710212', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8546307', md5('123'), 'Doris', GEOMETRY(POINT (1, 1)), '4680186079269927', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5089469', md5('123'), 'Crysta', GEOMETRY(POINT (1, 1)), '9590930289038991', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8692994', md5('123'), 'Jilli', GEOMETRY(POINT (1, 1)), '5886231771363661', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5735509', md5('123'), 'Kylie', GEOMETRY(POINT (1, 1)), '7905770581471429', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2276573', md5('123'), 'Bjorn', GEOMETRY(POINT (1, 1)), '3321576942510281', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3747808', md5('123'), 'Michel', GEOMETRY(POINT (1, 1)), '3651525500196546', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9441376', md5('123'), 'Gerik', GEOMETRY(POINT (1, 1)), '1709976231855415', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2620562', md5('123'), 'Whitaker', GEOMETRY(POINT (1, 1)), '5505637822851026', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6134556', md5('123'), 'Ced', GEOMETRY(POINT (1, 1)), '0668807527453400', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0456541', md5('123'), 'Lory', GEOMETRY(POINT (1, 1)), '8186723773259313', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8182063', md5('123'), 'Valentin', GEOMETRY(POINT (1, 1)), '8216856051721619', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4125913', md5('123'), 'Erinna', GEOMETRY(POINT (1, 1)), '1409238783861582', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2891452', md5('123'), 'Nestor', GEOMETRY(POINT (1, 1)), '3385271351753494', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5514370', md5('123'), 'Gale', GEOMETRY(POINT (1, 1)), '7787003591155907', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0054309', md5('123'), 'Otto', GEOMETRY(POINT (1, 1)), '4741700367463906', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5968679', md5('123'), 'Jed', GEOMETRY(POINT (1, 1)), '7163363690594820', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4024455', md5('123'), 'Berti', GEOMETRY(POINT (1, 1)), '9549181518155287', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9338733', md5('123'), 'Franklin', GEOMETRY(POINT (1, 1)), '7167148407346551', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6935082', md5('123'), 'Mariel', GEOMETRY(POINT (1, 1)), '6269884464722309', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5962782', md5('123'), 'Albertine', GEOMETRY(POINT (1, 1)), '2003468954999302', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5680849', md5('123'), 'Anthiathia', GEOMETRY(POINT (1, 1)), '8399433438435815', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9396957', md5('123'), 'Lucien', GEOMETRY(POINT (1, 1)), '8661727657706813', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7703765', md5('123'), 'Arlyn', GEOMETRY(POINT (1, 1)), '2760846341967076', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2191137', md5('123'), 'Vilma', GEOMETRY(POINT (1, 1)), '6274575655091169', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6489896', md5('123'), 'Lothario', GEOMETRY(POINT (1, 1)), '3899572860712381', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9031448', md5('123'), 'Carlee', GEOMETRY(POINT (1, 1)), '0933272203007690', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2840506', md5('123'), 'Beatriz', GEOMETRY(POINT (1, 1)), '3700731872521659', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4507886', md5('123'), 'Frederik', GEOMETRY(POINT (1, 1)), '4131140203429625', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6380077', md5('123'), 'Markus', GEOMETRY(POINT (1, 1)), '4348145238669729', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1286168', md5('123'), 'Gabrila', GEOMETRY(POINT (1, 1)), '6517967440837547', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7201984', md5('123'), 'Luther', GEOMETRY(POINT (1, 1)), '2660887100623033', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7818980', md5('123'), 'Ario', GEOMETRY(POINT (1, 1)), '0015954300496943', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2823937', md5('123'), 'Chase', GEOMETRY(POINT (1, 1)), '2286860713951318', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2872406', md5('123'), 'Donia', GEOMETRY(POINT (1, 1)), '0548763650845922', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7736708', md5('123'), 'Izaak', GEOMETRY(POINT (1, 1)), '3305204210408853', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9657172', md5('123'), 'Harlin', GEOMETRY(POINT (1, 1)), '2121701761402519', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2709963', md5('123'), 'Allyson', GEOMETRY(POINT (1, 1)), '0875328205847631', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9231502', md5('123'), 'Orv', GEOMETRY(POINT (1, 1)), '3359386794861956', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2992490', md5('123'), 'Giulio', GEOMETRY(POINT (1, 1)), '8299879664710445', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2357245', md5('123'), 'Bernice', GEOMETRY(POINT (1, 1)), '9919288966846125', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6674283', md5('123'), 'Haydon', GEOMETRY(POINT (1, 1)), '7103758287744409', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9632855', md5('123'), 'Jody', GEOMETRY(POINT (1, 1)), '1963336044717973', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3787509', md5('123'), 'Roobbie', GEOMETRY(POINT (1, 1)), '2267916041153418', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9689485', md5('123'), 'Beilul', GEOMETRY(POINT (1, 1)), '3780433794207012', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8417124', md5('123'), 'Salomone', GEOMETRY(POINT (1, 1)), '0026817569925710', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9102325', md5('123'), 'Dieter', GEOMETRY(POINT (1, 1)), '3063451402746239', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6351032', md5('123'), 'Glenda', GEOMETRY(POINT (1, 1)), '0978962181676989', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1379168', md5('123'), 'Dayna', GEOMETRY(POINT (1, 1)), '9093668573723479', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9590767', md5('123'), 'Elnora', GEOMETRY(POINT (1, 1)), '0471856942842068', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7063781', md5('123'), 'Alessandro', GEOMETRY(POINT (1, 1)), '7557309555642372', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0667538', md5('123'), 'Inesita', GEOMETRY(POINT (1, 1)), '2971055171710295', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2916154', md5('123'), 'Berthe', GEOMETRY(POINT (1, 1)), '2947149784915933', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3965380', md5('123'), 'Symon', GEOMETRY(POINT (1, 1)), '0472531983987352', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3549458', md5('123'), 'Heidie', GEOMETRY(POINT (1, 1)), '6892615180458957', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1306385', md5('123'), 'Abramo', GEOMETRY(POINT (1, 1)), '8734262890801895', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6978331', md5('123'), 'Mauricio', GEOMETRY(POINT (1, 1)), '9425108924848410', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6656539', md5('123'), 'Claybourne', GEOMETRY(POINT (1, 1)), '4733739606061506', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9460575', md5('123'), 'Waldemar', GEOMETRY(POINT (1, 1)), '4837776211420357', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1729412', md5('123'), 'Horton', GEOMETRY(POINT (1, 1)), '6069909452420542', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1894143', md5('123'), 'Ricoriki', GEOMETRY(POINT (1, 1)), '2625183019135967', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4095272', md5('123'), 'Leia', GEOMETRY(POINT (1, 1)), '4801402628641320', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6786306', md5('123'), 'Evaleen', GEOMETRY(POINT (1, 1)), '7500556752925635', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7771039', md5('123'), 'Amelie', GEOMETRY(POINT (1, 1)), '4169055726835710', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6005116', md5('123'), 'Willy', GEOMETRY(POINT (1, 1)), '5228665165223242', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0039742', md5('123'), 'Cos', GEOMETRY(POINT (1, 1)), '3724906143829386', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6827295', md5('123'), 'Thaddus', GEOMETRY(POINT (1, 1)), '7544797963526225', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3576255', md5('123'), 'Lyman', GEOMETRY(POINT (1, 1)), '1522511193444193', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7168733', md5('123'), 'Donalt', GEOMETRY(POINT (1, 1)), '3576751727840632', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0695283', md5('123'), 'Maynard', GEOMETRY(POINT (1, 1)), '7320245058755881', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4483495', md5('123'), 'Roobbie', GEOMETRY(POINT (1, 1)), '6123500295027526', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4474239', md5('123'), 'Mada', GEOMETRY(POINT (1, 1)), '1336803704906921', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9193097', md5('123'), 'Fons', GEOMETRY(POINT (1, 1)), '1143422280816944', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6397218', md5('123'), 'Corabelle', GEOMETRY(POINT (1, 1)), '2492228707792167', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6555305', md5('123'), 'Vernon', GEOMETRY(POINT (1, 1)), '7607416064332619', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2734346', md5('123'), 'Bernie', GEOMETRY(POINT (1, 1)), '3304779330913013', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6316696', md5('123'), 'Darryl', GEOMETRY(POINT (1, 1)), '9902157711405889', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8263922', md5('123'), 'Hartwell', GEOMETRY(POINT (1, 1)), '3656115486377924', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3974829', md5('123'), 'Sonni', GEOMETRY(POINT (1, 1)), '2856272890547007', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9472670', md5('123'), 'Lon', GEOMETRY(POINT (1, 1)), '3323136958299141', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7905193', md5('123'), 'Petronilla', GEOMETRY(POINT (1, 1)), '9435189259081658', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6596171', md5('123'), 'Lyndel', GEOMETRY(POINT (1, 1)), '3924727718204251', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9231598', md5('123'), 'Simone', GEOMETRY(POINT (1, 1)), '9335162596912667', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6595666', md5('123'), 'Joceline', GEOMETRY(POINT (1, 1)), '5484706142374833', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9777925', md5('123'), 'Dido', GEOMETRY(POINT (1, 1)), '9558937950490909', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9961602', md5('123'), 'Morganne', GEOMETRY(POINT (1, 1)), '6454833416656231', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7916699', md5('123'), 'Olag', GEOMETRY(POINT (1, 1)), '3816362388731406', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6767309', md5('123'), 'Harper', GEOMETRY(POINT (1, 1)), '5606573428735848', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4370737', md5('123'), 'Gavra', GEOMETRY(POINT (1, 1)), '4459212799526937', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6447462', md5('123'), 'Vernice', GEOMETRY(POINT (1, 1)), '4373298333028200', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7440924', md5('123'), 'Josy', GEOMETRY(POINT (1, 1)), '4869609428913700', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2250221', md5('123'), 'Loutitia', GEOMETRY(POINT (1, 1)), '5802360436459149', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2901527', md5('123'), 'Abie', GEOMETRY(POINT (1, 1)), '4285615964302980', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4759545', md5('123'), 'Phylys', GEOMETRY(POINT (1, 1)), '7355395071027120', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1840442', md5('123'), 'Donielle', GEOMETRY(POINT (1, 1)), '7202816509683910', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8983515', md5('123'), 'Blakelee', GEOMETRY(POINT (1, 1)), '9622773355643668', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1288672', md5('123'), 'Dunstan', GEOMETRY(POINT (1, 1)), '2509800120561353', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7416000', md5('123'), 'Tull', GEOMETRY(POINT (1, 1)), '7837808645305282', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5963018', md5('123'), 'Henrie', GEOMETRY(POINT (1, 1)), '0287760312746603', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9756668', md5('123'), 'Shela', GEOMETRY(POINT (1, 1)), '7725989431788690', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0950643', md5('123'), 'Riccardo', GEOMETRY(POINT (1, 1)), '1404215856696088', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8087971', md5('123'), 'Geoffry', GEOMETRY(POINT (1, 1)), '3351727585855605', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2214559', md5('123'), 'Lise', GEOMETRY(POINT (1, 1)), '3671408148755119', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8156018', md5('123'), 'Leyla', GEOMETRY(POINT (1, 1)), '0609434216565712', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9712480', md5('123'), 'Gillian', GEOMETRY(POINT (1, 1)), '8885398405046324', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7396893', md5('123'), 'Sim', GEOMETRY(POINT (1, 1)), '8158292852140195', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6372123', md5('123'), 'Sutherland', GEOMETRY(POINT (1, 1)), '3871360988656202', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9645555', md5('123'), 'Gill', GEOMETRY(POINT (1, 1)), '9648305189856982', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3824638', md5('123'), 'Raoul', GEOMETRY(POINT (1, 1)), '1775882359840739', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5953761', md5('123'), 'Shelli', GEOMETRY(POINT (1, 1)), '6257192788533943', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1723859', md5('123'), 'Angelo', GEOMETRY(POINT (1, 1)), '1174591374289023', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4283560', md5('123'), 'Cullie', GEOMETRY(POINT (1, 1)), '1606367212888261', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6573509', md5('123'), 'Jae', GEOMETRY(POINT (1, 1)), '2500795926464088', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0251957', md5('123'), 'Tyler', GEOMETRY(POINT (1, 1)), '1196656189772827', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9025344', md5('123'), 'Matilde', GEOMETRY(POINT (1, 1)), '8679268707172253', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2930266', md5('123'), 'Prisca', GEOMETRY(POINT (1, 1)), '3232434535634003', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8634481', md5('123'), 'Sharon', GEOMETRY(POINT (1, 1)), '4560269704797849', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1815080', md5('123'), 'Estevan', GEOMETRY(POINT (1, 1)), '2072803341824526', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5287191', md5('123'), 'Ganny', GEOMETRY(POINT (1, 1)), '8961473551990547', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8605572', md5('123'), 'Demetris', GEOMETRY(POINT (1, 1)), '3892959996907722', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9551110', md5('123'), 'Yevette', GEOMETRY(POINT (1, 1)), '8546247801378313', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1487411', md5('123'), 'Sandi', GEOMETRY(POINT (1, 1)), '5877854775469879', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1922020', md5('123'), 'Chrystel', GEOMETRY(POINT (1, 1)), '6147549279855228', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6296792', md5('123'), 'Arlana', GEOMETRY(POINT (1, 1)), '6168681941095197', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2994134', md5('123'), 'Tabbie', GEOMETRY(POINT (1, 1)), '0068256190712003', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7673496', md5('123'), 'Bartlet', GEOMETRY(POINT (1, 1)), '6875820185426638', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0017710', md5('123'), 'Anica', GEOMETRY(POINT (1, 1)), '6581288314250729', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5664890', md5('123'), 'Dame', GEOMETRY(POINT (1, 1)), '5361263941256894', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6214569', md5('123'), 'Rik', GEOMETRY(POINT (1, 1)), '5954731396269048', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1416502', md5('123'), 'Vanny', GEOMETRY(POINT (1, 1)), '6894051079309698', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2696821', md5('123'), 'Crysta', GEOMETRY(POINT (1, 1)), '1608624094613938', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2594805', md5('123'), 'Sibyl', GEOMETRY(POINT (1, 1)), '6525832471855084', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9358648', md5('123'), 'Carolyne', GEOMETRY(POINT (1, 1)), '8847565484502539', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6387610', md5('123'), 'Marguerite', GEOMETRY(POINT (1, 1)), '9611435730770719', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9412627', md5('123'), 'Iorgos', GEOMETRY(POINT (1, 1)), '6250740881957587', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5069406', md5('123'), 'Ab', GEOMETRY(POINT (1, 1)), '6007152112715132', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4872554', md5('123'), 'Jourdain', GEOMETRY(POINT (1, 1)), '4248108258498057', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5694896', md5('123'), 'Jori', GEOMETRY(POINT (1, 1)), '7008966590612262', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8358323', md5('123'), 'Berkie', GEOMETRY(POINT (1, 1)), '3098647461374313', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9688718', md5('123'), 'Kelcie', GEOMETRY(POINT (1, 1)), '2966180590555709', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3794000', md5('123'), 'Hatty', GEOMETRY(POINT (1, 1)), '3574884563198079', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0064053', md5('123'), 'Elisha', GEOMETRY(POINT (1, 1)), '3284715273054125', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7335356', md5('123'), 'Brendis', GEOMETRY(POINT (1, 1)), '7802356056036424', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9001881', md5('123'), 'Brit', GEOMETRY(POINT (1, 1)), '2605336689472958', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9488725', md5('123'), 'Devy', GEOMETRY(POINT (1, 1)), '7813904932585112', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8142623', md5('123'), 'Dreddy', GEOMETRY(POINT (1, 1)), '4874287436293590', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6845763', md5('123'), 'Gaspard', GEOMETRY(POINT (1, 1)), '7770635484722557', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9658769', md5('123'), 'Jolyn', GEOMETRY(POINT (1, 1)), '6882578842807032', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7962143', md5('123'), 'Valencia', GEOMETRY(POINT (1, 1)), '8774557628827507', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1262462', md5('123'), 'Win', GEOMETRY(POINT (1, 1)), '8658405405255184', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1224220', md5('123'), 'Kassie', GEOMETRY(POINT (1, 1)), '7740998585827006', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8802149', md5('123'), 'Ana', GEOMETRY(POINT (1, 1)), '7911362456107512', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8775449', md5('123'), 'Gussie', GEOMETRY(POINT (1, 1)), '9164700399314642', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1399917', md5('123'), 'Marius', GEOMETRY(POINT (1, 1)), '5388121857354026', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8771212', md5('123'), 'Dollie', GEOMETRY(POINT (1, 1)), '2667432819882492', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8094226', md5('123'), 'Costa', GEOMETRY(POINT (1, 1)), '0937232860621769', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8951629', md5('123'), 'Claribel', GEOMETRY(POINT (1, 1)), '4579105421056432', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8607635', md5('123'), 'Alena', GEOMETRY(POINT (1, 1)), '1979471164684589', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1677514', md5('123'), 'Sutherlan', GEOMETRY(POINT (1, 1)), '5321479747125075', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8219647', md5('123'), 'Cindie', GEOMETRY(POINT (1, 1)), '7875453121421675', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7924477', md5('123'), 'Willi', GEOMETRY(POINT (1, 1)), '2978081446059115', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9576779', md5('123'), 'Bank', GEOMETRY(POINT (1, 1)), '5942100437657179', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5292466', md5('123'), 'Bernelle', GEOMETRY(POINT (1, 1)), '9799553731893157', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1696042', md5('123'), 'Jillayne', GEOMETRY(POINT (1, 1)), '2845087747836234', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6100761', md5('123'), 'Eb', GEOMETRY(POINT (1, 1)), '0566414668132593', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2402743', md5('123'), 'Killy', GEOMETRY(POINT (1, 1)), '3720041440116279', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3916859', md5('123'), 'Verna', GEOMETRY(POINT (1, 1)), '7680401904032295', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8994671', md5('123'), 'Ailyn', GEOMETRY(POINT (1, 1)), '0617453174651980', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4419914', md5('123'), 'Gretna', GEOMETRY(POINT (1, 1)), '2935636748082086', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0872041', md5('123'), 'Freddie', GEOMETRY(POINT (1, 1)), '5821216109722610', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4386809', md5('123'), 'Brittany', GEOMETRY(POINT (1, 1)), '5286564082439290', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0471001', md5('123'), 'Abby', GEOMETRY(POINT (1, 1)), '6477577297308135', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6152065', md5('123'), 'Caty', GEOMETRY(POINT (1, 1)), '8434115526682992', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8451016', md5('123'), 'Ania', GEOMETRY(POINT (1, 1)), '4211925994867599', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8093279', md5('123'), 'Alexandrina', GEOMETRY(POINT (1, 1)), '5975893307840407', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2858376', md5('123'), 'Teddy', GEOMETRY(POINT (1, 1)), '1620357093704712', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3543315', md5('123'), 'Devondra', GEOMETRY(POINT (1, 1)), '5994399229544293', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2972910', md5('123'), 'Ring', GEOMETRY(POINT (1, 1)), '1598950403328380', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1396045', md5('123'), 'Sondra', GEOMETRY(POINT (1, 1)), '0695814467140740', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6144612', md5('123'), 'Leesa', GEOMETRY(POINT (1, 1)), '3237629351114571', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9130554', md5('123'), 'Robbie', GEOMETRY(POINT (1, 1)), '1135146572364633', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6740109', md5('123'), 'Graeme', GEOMETRY(POINT (1, 1)), '1227979919407215', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4731904', md5('123'), 'Hyacinth', GEOMETRY(POINT (1, 1)), '0806213407855853', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0295903', md5('123'), 'Kimberly', GEOMETRY(POINT (1, 1)), '0138453146457671', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3464554', md5('123'), 'Antonie', GEOMETRY(POINT (1, 1)), '6275796027680632', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0552433', md5('123'), 'Sharity', GEOMETRY(POINT (1, 1)), '5868901617852726', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6833563', md5('123'), 'Mathew', GEOMETRY(POINT (1, 1)), '2655460632281417', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4258822', md5('123'), 'Veda', GEOMETRY(POINT (1, 1)), '2103883121988637', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5309455', md5('123'), 'Freddie', GEOMETRY(POINT (1, 1)), '0761301559388373', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5130604', md5('123'), 'Charles', GEOMETRY(POINT (1, 1)), '5853584259472027', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0275168', md5('123'), 'Zaccaria', GEOMETRY(POINT (1, 1)), '9466065293729411', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2741948', md5('123'), 'Martha', GEOMETRY(POINT (1, 1)), '9384024758375981', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8797037', md5('123'), 'Anneliese', GEOMETRY(POINT (1, 1)), '7379029024500379', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7642671', md5('123'), 'Harbert', GEOMETRY(POINT (1, 1)), '1470961902493894', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9294494', md5('123'), 'Kirsti', GEOMETRY(POINT (1, 1)), '7348989043316627', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2889349', md5('123'), 'Rosy', GEOMETRY(POINT (1, 1)), '4068787556726658', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0746338', md5('123'), 'Peterus', GEOMETRY(POINT (1, 1)), '9396389007373021', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6899982', md5('123'), 'Arlena', GEOMETRY(POINT (1, 1)), '9934691386273331', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9404894', md5('123'), 'Saunders', GEOMETRY(POINT (1, 1)), '3803333608416134', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0530349', md5('123'), 'Reilly', GEOMETRY(POINT (1, 1)), '6246072782994695', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9480422', md5('123'), 'Valerie', GEOMETRY(POINT (1, 1)), '6769003389160512', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3353824', md5('123'), 'Carlynn', GEOMETRY(POINT (1, 1)), '2093541842359571', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6568389', md5('123'), 'Clareta', GEOMETRY(POINT (1, 1)), '6397001025115871', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7089248', md5('123'), 'Cull', GEOMETRY(POINT (1, 1)), '5385206147385870', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3312545', md5('123'), 'Greg', GEOMETRY(POINT (1, 1)), '3942302023429271', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0581677', md5('123'), 'Nerti', GEOMETRY(POINT (1, 1)), '5805043290607826', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4523877', md5('123'), 'Marlow', GEOMETRY(POINT (1, 1)), '0256461666019730', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7052404', md5('123'), 'Ahmed', GEOMETRY(POINT (1, 1)), '2898680028792584', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7070024', md5('123'), 'Ramsay', GEOMETRY(POINT (1, 1)), '3622667954929656', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1119150', md5('123'), 'Manuel', GEOMETRY(POINT (1, 1)), '7938358058113614', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8995485', md5('123'), 'Rudolf', GEOMETRY(POINT (1, 1)), '1795571751195875', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1064650', md5('123'), 'Reeba', GEOMETRY(POINT (1, 1)), '5885521448118805', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2256046', md5('123'), 'Barnie', GEOMETRY(POINT (1, 1)), '5595905305216174', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4890693', md5('123'), 'Winny', GEOMETRY(POINT (1, 1)), '6054543155237419', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6307620', md5('123'), 'Chaunce', GEOMETRY(POINT (1, 1)), '4743176811040474', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7446961', md5('123'), 'Chet', GEOMETRY(POINT (1, 1)), '0680508508660940', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1191539', md5('123'), 'Harwell', GEOMETRY(POINT (1, 1)), '0600141019019596', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3823624', md5('123'), 'Robbert', GEOMETRY(POINT (1, 1)), '1371907624375047', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6323405', md5('123'), 'Faye', GEOMETRY(POINT (1, 1)), '4630042427148218', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4180033', md5('123'), 'Erma', GEOMETRY(POINT (1, 1)), '7326141273760423', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3314979', md5('123'), 'Winn', GEOMETRY(POINT (1, 1)), '3541075999849109', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9665603', md5('123'), 'Jennilee', GEOMETRY(POINT (1, 1)), '6175932865466977', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8479975', md5('123'), 'Ives', GEOMETRY(POINT (1, 1)), '4149275387145637', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3559048', md5('123'), 'Nerita', GEOMETRY(POINT (1, 1)), '1336126641787284', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6131679', md5('123'), 'Roberto', GEOMETRY(POINT (1, 1)), '6123140919733512', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1656161', md5('123'), 'Gail', GEOMETRY(POINT (1, 1)), '3465222467836132', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0828416', md5('123'), 'Genevra', GEOMETRY(POINT (1, 1)), '8536423200476447', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6335174', md5('123'), 'Bartholomeo', GEOMETRY(POINT (1, 1)), '4410051964192440', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2728422', md5('123'), 'Kippie', GEOMETRY(POINT (1, 1)), '3134929064383287', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3649228', md5('123'), 'Glori', GEOMETRY(POINT (1, 1)), '5711160145044737', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8788896', md5('123'), 'Marsh', GEOMETRY(POINT (1, 1)), '5934699892376392', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9757779', md5('123'), 'Carmencita', GEOMETRY(POINT (1, 1)), '8641742869325616', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0489399', md5('123'), 'Rudy', GEOMETRY(POINT (1, 1)), '4404174835227629', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7346597', md5('123'), 'Edik', GEOMETRY(POINT (1, 1)), '1225143555532574', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0460764', md5('123'), 'Dallon', GEOMETRY(POINT (1, 1)), '1437857673918627', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7718253', md5('123'), 'Karry', GEOMETRY(POINT (1, 1)), '1656297814700102', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6164449', md5('123'), 'Malvin', GEOMETRY(POINT (1, 1)), '8790444730296053', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4475531', md5('123'), 'Romola', GEOMETRY(POINT (1, 1)), '9758639899143735', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4449915', md5('123'), 'Somerset', GEOMETRY(POINT (1, 1)), '1537465149340992', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6162265', md5('123'), 'Ralina', GEOMETRY(POINT (1, 1)), '5205485644923742', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9403245', md5('123'), 'Babbette', GEOMETRY(POINT (1, 1)), '5506637689994996', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7884409', md5('123'), 'Kristal', GEOMETRY(POINT (1, 1)), '8804861031321999', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6112508', md5('123'), 'Fredrick', GEOMETRY(POINT (1, 1)), '2349584112689287', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6860535', md5('123'), 'Twyla', GEOMETRY(POINT (1, 1)), '4655104200906840', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6382576', md5('123'), 'Jared', GEOMETRY(POINT (1, 1)), '3398768515680785', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0730253', md5('123'), 'Aura', GEOMETRY(POINT (1, 1)), '8908640821219171', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4159086', md5('123'), 'Hazel', GEOMETRY(POINT (1, 1)), '3320582805751572', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2435846', md5('123'), 'Camala', GEOMETRY(POINT (1, 1)), '6515671373898357', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1409181', md5('123'), 'Randi', GEOMETRY(POINT (1, 1)), '1523094737669012', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8215842', md5('123'), 'Prudi', GEOMETRY(POINT (1, 1)), '2056727664353281', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7293243', md5('123'), 'Jeffrey', GEOMETRY(POINT (1, 1)), '0673989232337038', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5644732', md5('123'), 'Bradly', GEOMETRY(POINT (1, 1)), '4736098560283889', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7039845', md5('123'), 'Adah', GEOMETRY(POINT (1, 1)), '6306994404812945', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8602679', md5('123'), 'Celesta', GEOMETRY(POINT (1, 1)), '9013259447621522', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8244713', md5('123'), 'Hinze', GEOMETRY(POINT (1, 1)), '0522138493934575', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6233144', md5('123'), 'Jaquelyn', GEOMETRY(POINT (1, 1)), '9966627492101079', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1832210', md5('123'), 'Hallie', GEOMETRY(POINT (1, 1)), '3077688390590277', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1508116', md5('123'), 'Gerianne', GEOMETRY(POINT (1, 1)), '9671800421443800', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9905642', md5('123'), 'Rey', GEOMETRY(POINT (1, 1)), '5138614657238306', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5696338', md5('123'), 'Roslyn', GEOMETRY(POINT (1, 1)), '5085128549567137', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6261677', md5('123'), 'Emmy', GEOMETRY(POINT (1, 1)), '7794320233817653', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1013968', md5('123'), 'Tull', GEOMETRY(POINT (1, 1)), '9884918107958183', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0350126', md5('123'), 'Sib', GEOMETRY(POINT (1, 1)), '5546126796861705', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8422974', md5('123'), 'Benedikt', GEOMETRY(POINT (1, 1)), '9688687749168119', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8094944', md5('123'), 'Kariotta', GEOMETRY(POINT (1, 1)), '7181653870790694', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2664128', md5('123'), 'Elianora', GEOMETRY(POINT (1, 1)), '3543260633033548', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2147805', md5('123'), 'Arleta', GEOMETRY(POINT (1, 1)), '2044620333580245', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9974570', md5('123'), 'Bernadene', GEOMETRY(POINT (1, 1)), '3109698376634602', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4035861', md5('123'), 'Perl', GEOMETRY(POINT (1, 1)), '7246962856994012', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7567909', md5('123'), 'Ryan', GEOMETRY(POINT (1, 1)), '0102616919524573', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0195628', md5('123'), 'Daphna', GEOMETRY(POINT (1, 1)), '9225998151971760', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6689501', md5('123'), 'Jordain', GEOMETRY(POINT (1, 1)), '3873610222664889', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7857634', md5('123'), 'My', GEOMETRY(POINT (1, 1)), '4995643466818539', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9408697', md5('123'), 'Larine', GEOMETRY(POINT (1, 1)), '1185057851539406', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8224107', md5('123'), 'Katerine', GEOMETRY(POINT (1, 1)), '3109178294105272', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9826427', md5('123'), 'Massimo', GEOMETRY(POINT (1, 1)), '6479227384194812', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8016665', md5('123'), 'Rhianon', GEOMETRY(POINT (1, 1)), '1808292817183295', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8145272', md5('123'), 'Eyde', GEOMETRY(POINT (1, 1)), '0605545078681238', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2024127', md5('123'), 'Parke', GEOMETRY(POINT (1, 1)), '6975220348273977', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9410130', md5('123'), 'Micky', GEOMETRY(POINT (1, 1)), '3113669193220221', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1590064', md5('123'), 'Herb', GEOMETRY(POINT (1, 1)), '3947755840696401', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3086596', md5('123'), 'Gerri', GEOMETRY(POINT (1, 1)), '2609498511049329', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7674124', md5('123'), 'Clementia', GEOMETRY(POINT (1, 1)), '5022489644493032', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2627194', md5('123'), 'Lon', GEOMETRY(POINT (1, 1)), '1631734738640418', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2532515', md5('123'), 'Eliot', GEOMETRY(POINT (1, 1)), '5131408678442671', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0159280', md5('123'), 'Umeko', GEOMETRY(POINT (1, 1)), '2203193044451675', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6411494', md5('123'), 'Dionis', GEOMETRY(POINT (1, 1)), '7866722089100603', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8506634', md5('123'), 'Chico', GEOMETRY(POINT (1, 1)), '5501639700668851', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6616545', md5('123'), 'Manya', GEOMETRY(POINT (1, 1)), '5516217727245575', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4908945', md5('123'), 'Yasmin', GEOMETRY(POINT (1, 1)), '4508329444163843', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9930317', md5('123'), 'Noam', GEOMETRY(POINT (1, 1)), '7167145730049077', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9596391', md5('123'), 'Peter', GEOMETRY(POINT (1, 1)), '5279981160831852', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8329200', md5('123'), 'Fanya', GEOMETRY(POINT (1, 1)), '6612132329560557', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0297977', md5('123'), 'Menard', GEOMETRY(POINT (1, 1)), '4972482734941632', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8349083', md5('123'), 'Becki', GEOMETRY(POINT (1, 1)), '7725628526224571', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7355256', md5('123'), 'Durand', GEOMETRY(POINT (1, 1)), '2345177987893387', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3678468', md5('123'), 'Dana', GEOMETRY(POINT (1, 1)), '6585285720322690', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7933603', md5('123'), 'Mada', GEOMETRY(POINT (1, 1)), '3721795833800836', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5772725', md5('123'), 'Kipp', GEOMETRY(POINT (1, 1)), '4308231417625977', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0604147', md5('123'), 'Allayne', GEOMETRY(POINT (1, 1)), '2298854015956217', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7576717', md5('123'), 'Carie', GEOMETRY(POINT (1, 1)), '1800561766932902', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1910659', md5('123'), 'Skip', GEOMETRY(POINT (1, 1)), '0822679438428008', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6653400', md5('123'), 'Cecil', GEOMETRY(POINT (1, 1)), '5878100476382877', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5291132', md5('123'), 'Prisca', GEOMETRY(POINT (1, 1)), '0855632770286870', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1148329', md5('123'), 'Dodie', GEOMETRY(POINT (1, 1)), '7663355273786834', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6349139', md5('123'), 'Jermaine', GEOMETRY(POINT (1, 1)), '7926019496280546', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0780290', md5('123'), 'Dexter', GEOMETRY(POINT (1, 1)), '6202556495898121', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2521270', md5('123'), 'Inger', GEOMETRY(POINT (1, 1)), '8419623903543416', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0971878', md5('123'), 'Barbaraanne', GEOMETRY(POINT (1, 1)), '7858559359093600', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1309570', md5('123'), 'Dinny', GEOMETRY(POINT (1, 1)), '2911455518055069', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3699300', md5('123'), 'Wayland', GEOMETRY(POINT (1, 1)), '7372139035064017', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0313227', md5('123'), 'Koral', GEOMETRY(POINT (1, 1)), '1001228772625836', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7942201', md5('123'), 'Vern', GEOMETRY(POINT (1, 1)), '6126760963318904', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7314175', md5('123'), 'Roxane', GEOMETRY(POINT (1, 1)), '4061270619570134', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0638819', md5('123'), 'Renate', GEOMETRY(POINT (1, 1)), '5101701800982063', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1636955', md5('123'), 'Katrinka', GEOMETRY(POINT (1, 1)), '5784785592149485', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2035480', md5('123'), 'Kingsley', GEOMETRY(POINT (1, 1)), '4219986104410219', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3557125', md5('123'), 'Micheal', GEOMETRY(POINT (1, 1)), '0114941271409907', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4756194', md5('123'), 'Kenyon', GEOMETRY(POINT (1, 1)), '7170936408009121', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8562713', md5('123'), 'Jaquelin', GEOMETRY(POINT (1, 1)), '6646100196080499', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2205172', md5('123'), 'Pam', GEOMETRY(POINT (1, 1)), '3837784977131333', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9636447', md5('123'), 'Coretta', GEOMETRY(POINT (1, 1)), '8200063907041998', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9736117', md5('123'), 'Nari', GEOMETRY(POINT (1, 1)), '7353768695364958', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0505908', md5('123'), 'Lanette', GEOMETRY(POINT (1, 1)), '8562466422699268', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1781629', md5('123'), 'Turner', GEOMETRY(POINT (1, 1)), '3851467334355839', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2179193', md5('123'), 'Jewelle', GEOMETRY(POINT (1, 1)), '4409117404111806', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8636381', md5('123'), 'Haley', GEOMETRY(POINT (1, 1)), '6195588768657338', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8487644', md5('123'), 'Eugene', GEOMETRY(POINT (1, 1)), '1913728426047048', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1675696', md5('123'), 'Liz', GEOMETRY(POINT (1, 1)), '0323038085377042', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0276807', md5('123'), 'Jyoti', GEOMETRY(POINT (1, 1)), '8594238567096431', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5820219', md5('123'), 'Ethyl', GEOMETRY(POINT (1, 1)), '1678727359529516', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4061607', md5('123'), 'Zollie', GEOMETRY(POINT (1, 1)), '2671960765021090', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8524276', md5('123'), 'Oswald', GEOMETRY(POINT (1, 1)), '1811628201496693', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7556244', md5('123'), 'Fitz', GEOMETRY(POINT (1, 1)), '3826576405476695', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8953709', md5('123'), 'Adina', GEOMETRY(POINT (1, 1)), '1698864101518700', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1465990', md5('123'), 'Dewie', GEOMETRY(POINT (1, 1)), '5689801640130002', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0878979', md5('123'), 'Justin', GEOMETRY(POINT (1, 1)), '7717615440443933', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0239243', md5('123'), 'Alvira', GEOMETRY(POINT (1, 1)), '3606450683507887', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6678774', md5('123'), 'Dulcia', GEOMETRY(POINT (1, 1)), '3742074666046384', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2223138', md5('123'), 'Jorrie', GEOMETRY(POINT (1, 1)), '8115476073943157', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0056272', md5('123'), 'Donaugh', GEOMETRY(POINT (1, 1)), '6778464667616331', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0019818', md5('123'), 'Pauli', GEOMETRY(POINT (1, 1)), '9803573221364388', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6976304', md5('123'), 'Izak', GEOMETRY(POINT (1, 1)), '2319262872524839', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1431377', md5('123'), 'Selby', GEOMETRY(POINT (1, 1)), '4877200580987629', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3577279', md5('123'), 'Walt', GEOMETRY(POINT (1, 1)), '5845381919601225', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1208432', md5('123'), 'Kylila', GEOMETRY(POINT (1, 1)), '9419683188717028', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9937624', md5('123'), 'Reamonn', GEOMETRY(POINT (1, 1)), '1424942907917312', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7984162', md5('123'), 'Terry', GEOMETRY(POINT (1, 1)), '5323666108017933', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8538919', md5('123'), 'Kayla', GEOMETRY(POINT (1, 1)), '4151324937068815', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1165056', md5('123'), 'Vanya', GEOMETRY(POINT (1, 1)), '5229448324539109', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7607976', md5('123'), 'Hilda', GEOMETRY(POINT (1, 1)), '2617509740343039', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1335069', md5('123'), 'Darice', GEOMETRY(POINT (1, 1)), '6186712269737198', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1381907', md5('123'), 'Krishnah', GEOMETRY(POINT (1, 1)), '3122671016733954', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4229153', md5('123'), 'Geoff', GEOMETRY(POINT (1, 1)), '3249946121025173', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6861416', md5('123'), 'Philippe', GEOMETRY(POINT (1, 1)), '7869791027035165', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0557242', md5('123'), 'Hyacinthie', GEOMETRY(POINT (1, 1)), '1836796134561830', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7975269', md5('123'), 'Corene', GEOMETRY(POINT (1, 1)), '1553663869935181', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9033172', md5('123'), 'Filmore', GEOMETRY(POINT (1, 1)), '1630804857649464', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2872903', md5('123'), 'Esteban', GEOMETRY(POINT (1, 1)), '4019352888908733', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4673016', md5('123'), 'Farr', GEOMETRY(POINT (1, 1)), '2095953232419877', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7013707', md5('123'), 'Ignacio', GEOMETRY(POINT (1, 1)), '7047476106854109', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6624120', md5('123'), 'Fowler', GEOMETRY(POINT (1, 1)), '4954855559344976', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4555279', md5('123'), 'Venus', GEOMETRY(POINT (1, 1)), '6830680483104720', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6284657', md5('123'), 'Shelton', GEOMETRY(POINT (1, 1)), '5845909818246987', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9724935', md5('123'), 'Naoma', GEOMETRY(POINT (1, 1)), '4166952004696027', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2392948', md5('123'), 'Monique', GEOMETRY(POINT (1, 1)), '2912380516229263', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3076985', md5('123'), 'Shepperd', GEOMETRY(POINT (1, 1)), '6848793205996536', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6791434', md5('123'), 'Rubina', GEOMETRY(POINT (1, 1)), '9966774332711597', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2901040', md5('123'), 'Violette', GEOMETRY(POINT (1, 1)), '7728983999548746', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1844829', md5('123'), 'Bryn', GEOMETRY(POINT (1, 1)), '1149012490035651', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2759665', md5('123'), 'Fabien', GEOMETRY(POINT (1, 1)), '2645395265902652', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('3376197', md5('123'), 'Vernon', GEOMETRY(POINT (1, 1)), '9032177716082972', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5386036', md5('123'), 'Mozelle', GEOMETRY(POINT (1, 1)), '2552265358507380', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5930057', md5('123'), 'Cris', GEOMETRY(POINT (1, 1)), '5803313043861114', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9921366', md5('123'), 'Zachery', GEOMETRY(POINT (1, 1)), '0148166944576870', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1187331', md5('123'), 'Corrie', GEOMETRY(POINT (1, 1)), '1114295148686427', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('7962500', md5('123'), 'Sandi', GEOMETRY(POINT (1, 1)), '4474093952827555', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5649010', md5('123'), 'Luisa', GEOMETRY(POINT (1, 1)), '4512077292621692', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6584747', md5('123'), 'Sterne', GEOMETRY(POINT (1, 1)), '4410605658748727', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6572989', md5('123'), 'Merl', GEOMETRY(POINT (1, 1)), '2444959684733735', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6583126', md5('123'), 'Taite', GEOMETRY(POINT (1, 1)), '5159203732622832', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8769573', md5('123'), 'Marylee', GEOMETRY(POINT (1, 1)), '4811633258648934', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2291536', md5('123'), 'Joane', GEOMETRY(POINT (1, 1)), '3010113990039740', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9078234', md5('123'), 'Falito', GEOMETRY(POINT (1, 1)), '1418462649594939', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1973416', md5('123'), 'Tymon', GEOMETRY(POINT (1, 1)), '7742086941172097', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2138415', md5('123'), 'Mora', GEOMETRY(POINT (1, 1)), '3540073471491417', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9356323', md5('123'), 'Dorie', GEOMETRY(POINT (1, 1)), '2248819321230398', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('9670608', md5('123'), 'Isa', GEOMETRY(POINT (1, 1)), '4084626675645194', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('8520120', md5('123'), 'Brendon', GEOMETRY(POINT (1, 1)), '5961093885070963', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('5998535', md5('123'), 'Randene', GEOMETRY(POINT (1, 1)), '5940560692519540', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('0000808', md5('123'), 'Sabrina', GEOMETRY(POINT (1, 1)), '9583182728693773', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6176166', md5('123'), 'Carver', GEOMETRY(POINT (1, 1)), '3434705560260516', true);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('2228115', md5('123'), 'Keefer', GEOMETRY(POINT (1, 1)), '6937524825185573', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('4954850', md5('123'), 'Towny', GEOMETRY(POINT (1, 1)), '6614911282499069', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('6702223', md5('123'), 'Vina', GEOMETRY(POINT (1, 1)), '0516388281423573', false);
insert into Client (cellphoneClient, passwordClient, nameClient, address, creditCard, status) values ('1645323', md5('123'), 'Morgen', GEOMETRY(POINT (1, 1)), '3667121207294898', true);

 explain select * from client where cellphoneClient = '6176166' and status = true
