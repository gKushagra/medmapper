require('dotenv').config();
exports.PORT = process.env.PORT;
// exports.PG_CONNECTION_STRING = process.env.PG_CONNECTION_STRING;
exports.CONNECTION = {
    HOST: process.env.PG_HOST,
    PORT: 5432,
    USER: process.env.PG_USER,
    PASSWORD: process.env.PG_PASS,
    DATABASE: 'medmapper'
}
exports.SCAN_LINK = process.env.SCAN_LINK;