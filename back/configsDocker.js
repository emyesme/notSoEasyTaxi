
const configAdmin = {
	user: 'postgres',
	password: 'root',
	host: 'db',
	port: '5432',
	database: 'easyTaxiDB',
	SSL: true,
	sslmode: require,
	max: 10,
	min: 2,
	idleTimeputMillis: 1000
};

const configUserClient = {
	user: 'clientrole',
	password: '123',
	host: 'db',
	port: '5432',
	database: 'easyTaxiDB',
	SSL: true,
	sslmode: require,
	max: 10,
	min: 2,
	idleTimeputMillis: 1000
};


const configUserDriver = {
	user: 'driverrole',
	password: '123',
	host: 'db',
	port: '5432',
	database: 'easyTaxiDB',
	SSL: true,
	sslmode: require,
	max: 10,
	min: 2,
	idleTimeputMillis: 1000
};


module.exports = {
	configAdmin,
	configUserClient,
	configUserDriver
}
