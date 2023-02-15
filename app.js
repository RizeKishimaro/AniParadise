const express = require("express");
const Events = require("events");
const mysql = require("mysql2");
const env = require("dotenv")
const app = express();
const path = require("path");
const bcrypt = require("bcrypt");
const dbconf = require("./db.conf");
success = false;
//configuration for security with dot env
env.config();

//accept in plain text not urlencoded
app.use(express.urlencoded({extended: false}));
//setting statc and view engine with express
app.set("views",path.join(__dirname,"views"));
app.set("view-engine","ejs")
//routes in express
//handle the requests and store data in database using pool connection
app.post("/signup",async (request,response)=>{
    try{
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
        const securedPassword = await bcrypt.hash(request.body.user_password,10);
        dbconf.query(`INSERT INTO users (first_name,last_name,full_name,password) VALUES ("${firstName}","${lastName}","${userName}","${securedPassword}");`,(error,result,feilds)=>{
            if(!error){
                response.redirect("/login");
            }
            console.log(result)
        });
        console.log("signUp success")
        connection.end();


    }catch(error){
        throw error;
        console.log(error);
    }
});
app.post("/login",async (request,res)=>{
    try{
        const userName = request.body.userName;
        console.log(userName);
        const userPassword = request.body.userPassword;
        dbconf.query(`SELECT full_name,password from users where full_name="${userName}"`,(error,result,fields)=>{
            if(error){
                console.log("login failed"+error);
            }
            // else if(result[0].length === 0){
                //     res.redirect("/error");
                //     res.status(403);
                // }
                else{
                    try{
                         bcrypt.compare(
                        userPassword,
                        result[0].password,
                        (err, result) => {
                            if(result){
                                res.redirect("/?auth=true");
                                success = true;
                            }else{
                                res.send("User Name or Password is wrong Or doesn't exist in the database!");
                            }
                }
                )
                    }catch(error){
                        if(error){
                        res.status(403);
                        res.redirect("/error");
                        }
                    }
                }

        })
    }catch(error){
        throw error;
        console.log(error)
    }
})
// console.log(process.env.HOST_USER);
app.use(express.static("public"));
//filesystem configurations
app.get("/",(request,response)=>{
    response.render("index.ejs",{name: "Kyaw Gyi"});
    success = false;
});
app.get("/signup",(request,response)=>{
    response.render("signup.ejs")
});
app.get("/login",(request,response)=>{
    response.render("signin.ejs")
});
app.get("/error",(request,response)=>{
    response.render("error.ejs");
})
app.get("*",(request,response)=>{
    response.render("error.ejs");
    // console.log(request);
});
//start application

app.listen(3000);
