const { Pool } = require("pg");

require('dotenv').config({path: `${__dirname}/../.env.${ENV}`})

const ENV = process.env.NODE_ENV || 'development'

const config = {}

if (ENV === "production") {
    config.connectionString = process.env.DATABASE_URL;
    config.max = 2;
  }

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
    throw new Error("PGDATABASE or DATABASE_URL not configured")
} else { 
    console.log(`Connected to ${process.env.PGDATABASE}`)
}

const db = new Pool(config)

module.exports = db;