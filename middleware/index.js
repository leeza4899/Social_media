 //all the middlewares go here
 var middlewareObj = {};


 //to check if a user is logged in 
 middlewareObj.isloggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error_msg", "You need to be logged in to do that");
    res.redirect("/signup");
}

module.exports = middlewareObj;


