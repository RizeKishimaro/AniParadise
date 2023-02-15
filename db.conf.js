const mysql = require("mysql2");
const env = require("dotenv");
//create connection
env.config();
const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "Rize",
  password: "lazy",
  database: "Ani_users",
  connectionLimit: 5,
  debug: false,
});
pool.on("connection",(connection)=>{
  console.log("mysql connected!");
})

//module.exports = connection;
module.exports = pool;
