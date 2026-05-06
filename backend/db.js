const pkg = require("pg");
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "Imagens",
  password: "senai",
  port: 5433,
});

pool.connect()
  .then(() => console.log("Conectado ao banco"))
  .catch(err => console.error(err));

module.exports = pool;