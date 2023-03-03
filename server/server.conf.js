import express, { response } from "express";
import session from "express-session";
import ejs from "ejs";
import url from "url";
import path from "path";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import MYSQL from "./mysql.conf.js";
import API from "../apis/apis.js";
import { stringify } from "querystring";
import { isUndefined } from "util";
//app configuration
dotenv.config();
const mysql = new MYSQL();
const api = new API();
const app = express();
//fix __dir as ES module
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//setting express settings
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("views", path.join(__dirname, "views"));
app.set("view-engine", "ejs");
app.use(express.static("public"));
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 4 * 24 * 60 * 60 * 1000,
    },
  })
);

//define Object for server
class ExpressServer {
  constructor(port) {
    this.port = port;
  }
  routes() {
    app.get("/", (request, response) => {
      if (request.session.logged) {
        response.render("index.ejs");
      } else {
        response.json({
          status: "blocked",
          reason: "You need to Login or Sign Up",
        });
      }
    });
    app.get("/login", (request, response) => {
      if (request.session.logged) {
        response.redirect("/");
      } else {
        response.render("signin.ejs");
      }
    });

    app.get("/logout", (request, response) => {
      request.session.destroy((err) => {
        if (err) {
          response.json({ message: "Database error", reason: err });
        } else {
          response.redirect("/login");
        }
      });
    });
    app.get("/signup", (request, response) => {
      if (request.session.logged) {
        response.redirect("/");
      } else {
        response.render("signup.ejs");
      }
    });
    app.get("*", (request, response) => {
      response.render("error.ejs");
      response.status(404);
    });
  }

  apiRoute() {
    app.get("/api/v1/data/:id", (req, res) => {
      const searchString = url.parse(req.url);
      if (req.params) {
        const sql = `SELECT * FROM students WHERE id= ?`;
        api.getQueryData(sql, req.params.id, (error, result, fields) => {
          if (!result.length == 0) {
            res.setHeader("Content-Type", "Application/JSON");
            res.json(result);
            res.end();
          } else {
            res.json({ message: "error" });
            res.end();
          }
        });
      }
    });
    app.get("/api/v1/data", (req, res) => {
      const sql = `SELECT * FROM students LIMIT 20`;
      api.getData(sql, (error, result) => {
        if (error) {
          console.log(`error ${error}`);
        } else {
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.json(result);
          res.end();
        }
      });
    });
  }

  //setup admin routes

  //post routes for users
  postRoutes() {
    app.post("/api/v1/signup", async (request, response) => {
      if(Object.keys(request.body).length < 4){
        response.setHeader("Content-Type","Application/XML");
        response.end("<Error>The Username and password is empty!</Error>")
      }else{
        const lastname = request.body.user_f_name;
        const firstname = request.body.user_l_name;
        const username = request.body.user_name;
        const password = request.body.user_password;
        const arr = [lastname,firstname,username,password];
        const hashedpass = await bcrypt.hash(password, 10);
        api.signup(
          [firstname.trim(), lastname.trim(), username.trim(), hashedpass],
          (message, reason) => {
            response.json({ message: message, reason: reason });
            setTimeout(response.redirect("/"), 1000);
          }
        );
      }
        
      });
    app.post("/api/v1/auth", (request, response) => {
      const name = request.body.userName;
      const password = request.body.userPassword;
      api.auth(name, password, (returnData, reason) => {
        console.log(request.session.logged);
        if (request.session.logged) {
          response.redirect("/");
        } else {
          request.session.logged = true;
          response.json({ message: returnData, reason: reason });
        }
      });
    });
  }
  adminRoutes() {
    app.get("/admin", (request, response) => {
      response.render("signin.ejs");
    });
    app.get("/admin/index", (request, response) => {
      response.render("admin/dashboard.ejs");
    });
    app.get("/admin/profile", (request, response) => {
      response.render("admin/admin_profile.ejs");
    });
    app.get("/admin/setting", (request, response) => {
      response.render("admin/admin_setting.ejs");
    });
  }
  adminPost() {
    app.post("/admin/login", (request, response) => {});
  }
  create() {
    app.listen(this.port);
  }
}
export default ExpressServer;
