const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 5
});

(async () => {
    try {
        const conn = await mysql.createConnection({ host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD });
        await conn.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
        await conn.query(`USE ${process.env.DB_NAME}`);
        
        await conn.query(`CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, email VARCHAR(255) UNIQUE NOT NULL, password_hash VARCHAR(255) NOT NULL, name VARCHAR(100) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
        
        await conn.query(`CREATE TABLE IF NOT EXISTS history (
            id INT AUTO_INCREMENT PRIMARY KEY, 
            user_id INT NOT NULL, 
            type VARCHAR(50) NOT NULL, 
            data JSON NOT NULL, 
            is_favorite BOOLEAN DEFAULT FALSE,
            rating INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )`);
        
        await conn.end();
        console.log('✅ MySQL Ready for Lab 3');
    } catch (err) { console.error('❌ DB Error:', err); }
})();

module.exports = pool;