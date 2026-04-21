const mysql = require('mysql2');
require('dotenv').config();

// Create a connection pool to handle multiple connections efficiently
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Convert the pool to use promises (allows using async/await)
const promisePool = pool.promise();

// Test the connection
promisePool.getConnection()
    .then(connection => {
        console.log("✅ Successfully connected to MySQL Database!");
        connection.release();
    })
    .catch(err => {
        console.error("❌ Database connection failed: ", err);
    });

module.exports = promisePool;
