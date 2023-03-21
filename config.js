require('dotenv').config();
exports.PORT = process.env.PORT;
exports.PG_CONNECTION_STRING = process.env.PG_CONNECTION_STRING;
exports.SCAN_LINK = process.env.SCAN_LINK;