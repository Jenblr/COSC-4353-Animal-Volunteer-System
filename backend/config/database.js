require('dotenv').config();

module.exports = {
	development: {
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		host: process.env.DB_HOST,
		dialect: 'postgres',
		logging: false,
	},

	test: {
		username: process.env.TEST_DB_USENAME,
		password: process.env.TEST_DB_PASSWORD,
		database: process.env.TEST_DB_NAME,
		host: process.env.TEST_DB_HOST,
		dialect: 'postgres',
		logging: false,
	},

	production: {
		username: process.env.PROD_DB_USERNAME,
		password: process.env.PROD_DB_PASSWORD,
		database: process.env.PROD_DB_NAME,
		host: process.env.PROD_DB_HOST,
		dialect: 'postgres',
        logging: false,

		dialectOptions: {
			ssl: {
				require: true,
				rejectUnauthorized: false
			}
		}
	}
};