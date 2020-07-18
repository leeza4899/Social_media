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

router.use(bodyParser.urlencoded({ extended: true }));
router.use(methodOverride("_method"));

//requiring the middlwares
var middleware = require("../middleware");


//comments CRUD routes
// Create&Read Update Delete


//1. Create comment routes
router.post("/blog/:id/comments", middleware.isloggedIn, function(req,res){
	blog.findById(req.params.id,function(err, blog){
		if(err){
			console.log(err);
			res.redirect("/blog");
		}
		else{
			var text = req.body.text;
			const comm ={
				text: text
			}
		Comment.create(comm, function(err, comment){
				if(err){
					req.flash("error_msg", "Something went wrong");
					console.log(err);
				}
				else{
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//save comment
					comment.save();
					blog.comments.push(comment);
					blog.save();
					req.flash("success_msg", "Comment Added Succesfully!");
					res.redirect("/blog/" + blog._id);
				}
			});
		}
	})
});

//2. edit comment route
router.get("/blog/:id/comments/:comments_id/edit",middleware.commentOwner, function(req,res){
	Comment.findById(req.params.comments_id, function(err, foundComment){
            if (!foundComment) {
                    req.flash("error_msg", "Item not found.");
                    return res.redirect("back");
                }
		if(err){
			res.redirect("back");
		} else {
			res.render("comments/edit", {blog_id : req.params.id, comment : foundComment});
		}
	})
});


//update comment route
router.put("/blog/:id/comments/:comments_id", middleware.commentOwner, function(req,res){
	Comment.findByIdAndUpdate(req.params.comments_id, req.body.cooment, function(err, updatedComment){
		if(err){
			req.flash("error_msg", "Something went wrong");
			res.redirect("back");
		} else {
			req.flash("success_msg", "Comment Updated Succesfully!");
			return res.redirect("/blog/" + req.params.id);
		}
	});
});


//3.destroy comment
router.delete("/blog/:id/comments/:comments_id", middleware.commentOwner, function(req,res){
	Comment.findByIdAndDelete(req.params.comments_id, function(err){
		if(err){
			res.redirect("back");
		} else {
			req.flash("success_msg", "Comment Deleted");
			res.redirect("/blog/" + req.params.id);
		}
});	
});

module.exports = router;
