var express = require("express");
var router = express.Router();
var passport = require("passport");
var bcrypt = require("bcryptjs");
const randomstring =require('randomstring');
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const LocalStrategy = require("passport-local");
const flash = require("connect-flash");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const async = require("async");
const multer = require("multer");
const methodOverride = require("method-override");

//Requiring essential models
const User = require("../models/user");
const blog = require("../models/blog");
const Category = require("../models/category");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(methodOverride("_method"));

//requiring the middlwares
var middleware = require("../middleware");

//multer configuration
const storage = multer.diskStorage({
        destination: './public/images/blog_image',
        filename: function(req,file,next){
            next(null, file.fieldname + '-' + req.body.title + path.extname(file.originalname));
        }
    });

const upload = multer({
    storage: storage,
    limits:{fileSize: 10000000}, //set to 10MB
    //to enable only image files to be uploaded
    fileFilter: function(req,file,next){
        checkFileType(file,next);
    }
}).single('blog-image');

//checking file type
function checkFileType(file, next){
    //allowed extensions
    const fileTypes = /jpeg|jpg/;
    //chec ext
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    //check mime
    const mimetype  = fileTypes.test(file.mimetype);

    if(mimetype && extname){
    return next(null,true);
    } else {
        next(req.flash("error_msg", "You can upload images only!"));    
    }
}
/////////////////////////////////

////////////BLOG ROUTES///////////////////
//enterance
router.get("/blog/entry", function(req,res){
    res.render("blog/entry");
});

//1. Create 2. Read 3. Update 4. Delete ROUTES

/////   1. Add a blog post
router.get("/blog/addpost", middleware.isloggedIn, function(req,res){
    res.render("blog/add");
});

router.post("/blog/addpost", middleware.isloggedIn, function(req,res){
    upload(req,res,(err) => {
        if(err){
            req.flash("error_msg", err.message);
        } else {
            if(req.file == undefined){
                req.flash("error_msg","Oops! No file selected.");
                res.redirect("back");
            } else {
                file: `images/blog_image/${req.file.filename}`;
                var title = req.body.title;
                var desc = req.body.desc;
                var image = req.file.filename;
                var author = {
                    id: req.user._id,
                    authorName : req.user.username
                }
                var category = req.body.category;
                if(!title || !desc || !image || !category){
                    req.flash("error_msg","Please fill in all the fields");
                    res.redirect("back");
                }
                
                var newBlog = {
                    title: title,
                    desc: desc,
                    image: image,
                    category: category,
                    author: author
                };

                blog.create(newBlog, function (err, createdblog) {
                    if (err) {
                        console.log(err);

                    } else {
                        blog.findOne({title:title , author:author},function(err,foundBlog){
                        Category.findOne({name: category}, function(err,found){
                            if(err){
                                console.log(err);
                            } else {
                                if(!found){
                                    console.log(found);
                                    const name = req.body.category;
                                    const Categ_id = req.body._id;
                                    var newCat = {name: name,Categ_id : foundBlog._id };
                                    Category.create(newCat, function(err, catCreated){});
                            
                                }

                                    Category.findOneAndUpdate({name : req.body.category},{$push :{Categ_id : foundBlog._id }},{new:true},(err,result)=>{
                                        if(err){
                                        console.log(err);
                                        } else {
                                            req.flash("success_msg", "Blog post created!");
                                            return res.redirect("/blog");

                                        }
                                    }) 
                            }
                        })
                });
                }
                });
                                
            }
        }
    });
});


//// 2. All blogs
router.get("/blog", function(req,res){
        blog.find({}, function(err, inBlog){
            if(err){
                console.log(err);
            }
            else {
                if (!inBlog) {
                        req.flash("error", "Item not found.");
                        return res.redirect("back");
                    }
                res.render("blog/allBlog", {blogs: inBlog});
            }
    
    });
});



///View specific blog page route
router.get("/blog/:id", function(req,res){
    blog.findById(req.params.id, function(err,foundBlog){
		if(err){
			console.log(err);
		}
		else{
			res.render("blog/blogPage",{blog: foundBlog});
		}
	});
});

//// 3. Edit blogPost
router.get("/blog/editpost/:id", middleware.blogowner, function(req,res){
    blog.findById(req.params.id, function(err, found){
        if(!found){
            req.flash("error_msg", "Blog Post you request doesn't exist");
            return res.redirect("/blog");
        }

        res.render("blog/editBlog", {blog: found});
    })
});

router.put("/blog/:id", middleware.blogowner, function(req,res){
    blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, update){
        if(err){
            req.flash("error_msg", "Error");
            res.redirect("/blog");
        } else {
            req.flash("success_msg", "Blog edited successfully!");
            res.redirect("/blog/" + req.params.id); //it has to be redirected to the individual post page.
        }
    });
});


/// 4. Delete the post
router.delete("/blog/:id", middleware.blogowner, function(req,res){
    var foungBlog_id = req.params.id;
        Category.findOneAndUpdate({name : req.body.category},{$pull :{Categ_id : foungBlog_id}},{new:true},(err,result)=>{
            blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/blog/entry");
		} else {
			req.flash("success_msg", "Post Deleted");
			res.redirect("/blog");
		}
	})
});
});



module.exports = router;