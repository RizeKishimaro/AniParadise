import MYSQL from "../server/mysql.conf.js";
import ExpressServer from "../server/server.conf.js";
import session from "express-session";
const mysql = new MYSQL();
class API {
  auth(name, password,authFunc) {
    mysql.checkLogin(name, password, (success, message) => {
      if (success) {
        authFunc(success,message);
      } else {
        authFunc(success,message);
      }
    });
  }
  signup(userData,signUpFunc){
    mysql.signUpUsers([...userData],(message,reason)=>{
      if(message){
        signUpFunc(message,reason);
      }
    })
  }
}
export default API;
