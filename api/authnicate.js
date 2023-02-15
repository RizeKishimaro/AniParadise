const session = require("express-session");
const express = require("express");
const app = express();
app.get("/", (request, response) => {
  // console.log(request.session.logged);
  response.send(
    "<h1>403 FORBIDDEN!</h1><p>You don't have any permission to ask this url you sussy baka!</p><a href='/login'>Login Aniparadise</a>"
  );
});
function validate(authUserName, authUserPassword, mysql, req, res, bcrypt) {
  mysql.query(
    `SELECT full_name,password from users where full_name="${authUserName}"`,
    (error, result, fields) => {
      if (error) {
        console.log("login failed" + error);
      } else {
        try {
          bcrypt.compare(
            authUserPassword,
            result[0].password,
            (err, result) => {
              if (result) {
               success = true;
               req.session.logged = true;
               if(req.session.logged){
                res.redirect("/");
                
                console.log("s")
              }else{
                res.redirect("/")
              }
              } else {
                res.send(
                  "User Name or Password is wrong Or doesn't exist in the database!"
                );
              }
            }
          );
        } catch (error) {
          if (error) {
            res.status(403);
            res.redirect("/error");
          }
        }
      }
    }
  );
}
module.exports = validate;
