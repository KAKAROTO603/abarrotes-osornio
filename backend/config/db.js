const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'gateway01.us-east-1.prod.aws.tidbcloud.com',
  user: process.env.DB_USER || 'AA5AUcKnkSPBVGW.root',
  password: process.env.DB_PASSWORD || 'X99FH8IMyDrV6gPE',
  database: process.env.DB_NAME || 'test',
  port: process.env.DB_PORT || 4000,
  ssl: { 
    rejectUnauthorized: false  // ← NECESARIO PARA TIDB CLOUD
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const promisePool = pool.promise();

// Probar conexión
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Error conectando a TiDB Cloud:', err.message);
  } else {
    console.log('✅ Conectado a TiDB Cloud exitosamente');
    console.log(' Base de datos:', process.env.DB_NAME || 'test');
    connection.release();
  }
});

module.exports = promisePool;