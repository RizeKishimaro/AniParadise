const express = require("express");
const Events = require("events");
const mysql = require("mysql2");
const env = require("dotenv");
const app = express();
const path = require("path")
//configuration for security with dot env
env.config();

//setting routs with express
app.set("views",path.join(__dirname,"views"));
app.set("view-engine","ejs")
//routes in express
app.use(express.static("public"));
//filesystem configurations
app.get("/",(request,response)=>{
    response.render("index.ejs",{name: "Kyaw Gyi"})
});
app.get("/signup",(request,response)=>{
    response.render("signup.ejs")
});
app.get("/login",(request,response)=>{
    response.render("signin.ejs")
});
app.get("*",(request,response)=>{
    response.render("error.ejs")
})
//start application
app.listen(3000);
