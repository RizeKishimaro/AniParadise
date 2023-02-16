const session = require("express-session");
function checkUser (cusFirstName,cusLastName,cusUserName,hashedPassword,request,response,mysql) {
    mysql.query(
      `SELECT full_name FROM users WHERE full_name = "${cusUserName}"`,
      (error, result, fields) => {
          try{
              if(result.length === 0){
                  mysql.query(
                    `INSERT INTO users (first_name,last_name,full_name,password) VALUES ("${cusFirstName}","${cusLastName}","${cusUserName}","${hashedPassword}");`,
                    (error, result, feilds) => {
                      if (!error) {
                        response.redirect("/login");
                        login_true = true;
                        console.log(request.session.logged);
                      }
                      console.log(result);
                    }
                  );
                  console.log("signUp success");
              }else{
                  console.log(result.length);
                  response.redirect("/signup")
                  failed= true;
                  
              }
          }catch(error){
              if(error) throw error;
          }
      }
    );
  }
module.exports = checkUser;