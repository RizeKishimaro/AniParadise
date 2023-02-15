module.exports = function checkUser(req,res){
    if(req.session.id = "user"){
        res.redirect("/login");
    }
}