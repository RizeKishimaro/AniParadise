import mysql from "mysql2";
import bcrypt from "bcrypt";
class MYSQL {
  connectPool(limit, time = null) {
    const pool = mysql.createPool({
      database: "Ani_users",
      host: "127.0.0.1",
      user: "Rize",
      password: "lazy",
      connectionLimit: limit,
    });
    pool.on("connection", () => {
      console.log("mysql connected!");
    });
    return pool
}
signUpUsers(data,resultFunc){
  const connection = this.connectPool(10);
  connection.query(`SELECT full_name FROM users WHERE full_name=?`,data[2],(error,result,fields)=>{
    if(result.length===0){
      connection.query(`INSERT INTO users(first_name,last_name,full_name,password) VALUES(?,?,?,?)`,data,(err,result,fields)=>{
        try{
          if(!err){
            resultFunc(true,"Sign Up Success")
          }else{
            resultFunc(false,`Database Error ${err}`);
          }
        }catch(error){
          console.log(error);
          resultFunc(false,error);
        }
      })
    }else{
      resultFunc(false,"User ALREADY EXIST PLEASE LOGIN");
    }
  })
}
getData(query,callback){
  const connection = this.connectPool(1);
  connection.query(query,(error,result,fields)=>{
    callback(error,result,fields);
  });
}
getQueryData(query,value,callback){
  const connection = this.connectPool(10);
  connection.query(query,value,(error,result,fields)=>{
    callback(error,result,fields);
    // console.log(result+ value+"mysql");
    // console.log(query);
    console.log(result);
    
  });
}
checkLogin(username,password,resultFunc){
    const connection = this.connectPool(10);
   connection.query("SELECT full_name,password FROM users WHERE full_name=?",[username],(error,result,fields)=>{
    try{
      if(result.length ===0){
        console.log(result.length);
        resultFunc(false, "Mate!Your Username Does Not Exist") 
      }
      if(error){
        resultFunc(false,{"reason": "Hoorh!Pirate Database Has Rats"});
      }
      if(result.length !== 0){
      // console.log(password);
        bcrypt.compare(password,result[0].password,(err,isPass)=>{
          // console.log(isPass);
          if(isPass){
            resultFunc(true,"Horrah!Login Successfully!");
          }else{
            resultFunc(false,"Ahoy!Your Pirate Password Is Wrong")
          }
        })
      }
    }catch(err){
      resultFunc(err,"Grrgh!Ship Database Have RATS(ERRORS)");
      throw error
    }
   })
}
}
export default MYSQL;
