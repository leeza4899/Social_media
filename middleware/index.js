 //require models
var blog = require("../models/blog");

 
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

middlewareObj.blogowner = function(req,res,next){
    if(req.isAuthenticated()){
        blog.findById(req.params.id, function(err, foundBlog){
           if(err){
               req.flash("error_msg", "Blog not found");
               res.redirect("/blog");
           }  else {
			  
            if (!foundBlog) {
                    req.flash("error_msg", "Item not found.");
                    return res.redirect("/blog");
                }
            if(foundBlog.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error_msg", "You don't have permission to do that");
                res.redirect("/signup");
            }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("/signup");
    }
}

module.exports = middlewareObj;


