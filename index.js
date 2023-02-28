import dotenv from "dotenv";
import ExpressServer from "./server/server.conf.js";
import MYSQL from "./server/mysql.conf.js";
const server = new ExpressServer(3000);
const mysql = new MYSQL(process.env.MYSQL_DATABASE,process.env.MYSQL_HOSTNAME,process.env.MYSQL_USER,process.env.MYSQL_PASSWORD);
server.adminRoutes();
server.routes();
server.postRoutes();
server.create();