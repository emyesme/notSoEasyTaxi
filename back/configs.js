
const configAdmin = {
	user: 'postgres',
	password: 'postgres',
	host: 'localhost',
	port: '5432',
	database: 'easyTaxiDB',
	ssl: true,
	max: 10,
	min: 2,
	idleTimeputMillis: 1000
};

const configUserClient = {
	user: 'clientrole',
	password: '123',
	host: 'localhost',
	port: '5432',
	database: 'easyTaxiDB',
	ssl: true,
	max: 10,
	min: 2,
	idleTimeputMillis: 1000
};


const configUserDriver = {
	user: 'driverrole',
	password: '123',
	host: 'localhost',
	port: '5432',
	database: 'easyTaxiDB',
	ssl: true,
	max: 10,
	min: 2,
	idleTimeputMillis: 1000
};


module.exports = {
	configAdmin,
	configUserClient,
	configUserDriver
}
