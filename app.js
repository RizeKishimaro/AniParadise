const express = require("express");
const Events = require("events");
const mysql = require("mysql2");
const env = require("dotenv");
const app = express();
const path = require("path");
const bcrypt = require("bcrypt");
const dbconf = require("./db.conf");
const session = require("express-session");
// const validate = require("./api/authnicate");
// const checkUser = require("./api/insertUsers");

//functions
function validate(authUserName, authUserPassword, mysql, req, res, bcrypt) {
  mysql.query(
    `SELECT full_name,password from users where full_name=?`,
    authUserName,
    async (error, result, fields) => {
      console.log(result.length)
      if(result.length > 0){
        if (error) {
          console.log("login failed" + error);
        } else {
          try {
            await bcrypt.compare(
              authUserPassword,
              result[0].password,
              (err, result) => {
                if (result) {
                  success = true;
                  req.session.logged = true;
                  res.redirect("/");
                } else {
                  res.send(
                    "User Name or Password is wrong Or doesn't exist in the database!"
                  );
                }
              }
            );
          } catch (error) {
            if (error) {
              const message = error;
              err_message = message;
              res.redirect("/error/" + message);
            }
          }
        }
      }else{
        const data = {error: 'Database error occured'};
        res.status(500).json(data);
      }
    }
  );
}

function checkUser(
  cusFirstName,
  cusLastName,
  cusUserName,
  hashedPassword,
  request,
  response,
  mysql
) {
  mysql.query(
    `SELECT full_name FROM users WHERE full_name = ?`,
    cusUserName,
    (error, result, fields) => {
      try {
        if (result.length === 0) {
          mysql.query(
            `INSERT INTO users (first_name,last_name,full_name,password) VALUES (?,?,?,"${hashedPassword}");`,
            [cusFirstName, cusLastName, cusUserName],
            (error, result, feilds) => {
              if (!error) {
                response.redirect("/login");
                login_true = true;
                console.log(request.session.logged);
              } else {
                const message = error.code;
                err_message = message;
                response.redirect("/error/" + message);
              }
              console.log(result);
            }
          );
          console.log("signUp success");
        } else {
          console.log(result.length);
          response.redirect("/signup");
          failed = true;
        }
      } catch (error) {
        const message = error.code;
        err_message = message;
        response.redirect("/error/" + message);
      }
    }
  );
}

// some configs
success = false;
login_true = false;
failed = false;
err_message = null;
//configuration for security with dot env
env.config();

//accept in plain text not urlencoded
app.use(express.urlencoded({ extended: true }));

//setting statc and view engine with express
//create session in node js
app.use(express.json());
app.use(
  session({
    secret: process.env.Key,
    resave: true,
    saveUninitialized: false,
    cookie: {
      secure: false,
    },
  })
);
app.set("views", path.join(__dirname, "views"));
app.set("view-engine", "ejs");

//routes in express
//handle the requests and store data in database using pool connection
app.post("/signup", async (request, response) => {
  try {
    //connect to mysql database
    const connection = mysql.createConnection({
      host: "127.0.0.1",
      user: "Rize",
      password: "lazy",
      database: "Ani_users",
    });

    const firstName = request.body.user_f_name;
    const lastName = request.body.user_l_name;
    const userName = request.body.user_name;
    const securedPassword = await bcrypt.hash(request.body.user_password, 10);
    checkUser(
      firstName,
      lastName,
      userName,
      securedPassword,
      request,
      response,
      dbconf
    );
  } catch (error) {
    throw error;
    console.log(error);
  }
});

//set default
failed = false;
login_true = false;
app.post("/login", async (req, res) => {
  try {
    const userName = req.body.userName;
    const userPassword = req.body.userPassword;
    //csrf protection
    validate(userName, userPassword, dbconf, req, res, bcrypt);
  } catch (error) {
    const message = error.code;
    err_message = message;
    res.redirect("/error/" + message);
  }
});

//set static
app.use(express.static("public"));

//filesystem configurations
app.get("/", (request, response) => {
  if (request.session.logged) {
    response.render("index.ejs");
  } else {
    response.send(
      "<h1>403 FORBIDDEN!</h1><p>You don't have any permission to ask this url you sussy baka!</p><a href='/login'>Login Aniparadise</a>"
    );
  }
});

app.get("/signup", (request, response) => {
  if (request.session.logged) {
    response.redirect("/");
  } else {
    response.render("signup.ejs");
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
      response.send(
        "{error: 'ERROR 1064 (42000): You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near 'count() users where 1' at line 1'}"
      );
    } else {
      response.redirect("/login");
    }
  });
});
app.get("/error/:message", (request, response) => {
  response.render("error.ejs");
});
app.get("*", (request, response) => {
  response.render("error.ejs");
  // console.log(request);
});
//reasign global variable

failed = false;
//start application

app.listen(3000);
