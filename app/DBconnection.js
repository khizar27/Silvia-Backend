const { Client } = require('pg')


const client = new Client({
  ssl: { sslmode: 'require', rejectUnauthorized: false },
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME
})
client.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
module.exports = client;