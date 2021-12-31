require('dotenv').config();//instatiate environment variables

let CONFIG = {} //Make this global to use all over the application

CONFIG.app = process.env.APP || 'dev';
CONFIG.port = process.env.PORT || '3000';

CONFIG.db_dialect = process.env.DB_DIALECT || 'mysql';
CONFIG.db_host = process.env.DB_HOST || 'localhost';
CONFIG.db_port = process.env.DB_PORT || '3306';
CONFIG.db_name = process.env.DB_NAME || 'openseaevents';
CONFIG.db_user = process.env.DB_USER || 'upcoming';
CONFIG.db_password = process.env.DB_PASSWORD || 'Wl^V8xvEPonJ';
CONFIG.MONGO_URL = process.env.MONGO_URL ||  "mongodb://localhost:27017/openseaevents";

CONFIG.jwt_encryption = process.env.JWT_ENCRYPTION || 'jwt_please_change';
CONFIG.jwt_expiration = process.env.JWT_EXPIRATION || '10000';
CONFIG.OPENSEA_KEY = process.env.OPENSEA_KEY || '8e1e1f45ad1e4dc5b25e93c735c404d8';
CONFIG.OPENSEA_API1 = process.env.OPENSEA_API1 || 'https://api.opensea.io/api/v1/';
CONFIG.OPENSEA_API2 = process.env.OPENSEA_API2 || '8e1e1f45ad1e4dc5b25e93c735c404d8';

module.exports = CONFIG;
