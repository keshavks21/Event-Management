const {Pool} = require("pg");
require("dotenv").config();

const db = new Pool({
    connectionString : process.env.DATABASE_SECRET_KEY,
})

module.exports = db;