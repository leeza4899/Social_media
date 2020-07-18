var express = require("express");
var router = express.Router({mergeParams: true});
var passport = require("passport");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const LocalStrategy = require("passport-local");
const flash = require("connect-flash");
const multer = require("multer");
const methodOverride = require("method-override");

//Requiring Models
const blog = require("../models/blog");
const Comment = require("../models/comments");
const reply = require("../models/Replies");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(methodOverride("_method"));

//requiring the middlwares
var middleware = require("../middleware");


//comments CRUD routes
// Create&Read Update Delete


//1. Create comment routes
router.post("/blog/:id/comment/:comment_id/reply", middleware.isloggedIn, function(req,res){
	Comment.findById(req.params.comment_id,function(err, comm){
		if(err){
			console.log(err);
			res.redirect("/blog");
		}
		else{
            var text = req.body.text;
            var repl = {
				text: text,
				
            }
		reply.create(repl, function(err, repli){
				if(err){
					req.flash("error_msg", "Something went wrong");
					console.log(err);
				}
				else{
					// console.log(repli);
                    // console.log(repli);
					//add username and id to comment
					repli.author.id = req.user._id;
					repli.author.admin = req.user.username;
					//save comment
                    repli.save();
                    // console.log(repli);
					comm.replies.push(repli);
                    comm.save();
					req.flash("success_msg", "Reply Added Succesfully!");
					res.redirect("/blog/" + req.params.id);
				}
			});
		}
	})
});


//Delete repply
router.delete("/blog/:id/comments/:comments_id/reply/:reply_id", middleware.replyOwner, function(req,res){
	reply.findByIdAndDelete(req.params.reply_id, function(err){
		if(err){
			res.redirect("back");
		} else {
			req.flash("success_msg", "Reply Deleted");
			res.redirect("/blog/" + req.params.id);
		}
});	
});

module.exports = router;
