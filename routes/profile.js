var express = require("express");
var router = express.Router();
var passport = require("passport");
var bcrypt = require("bcryptjs");
const randomstring = require('randomstring');
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const LocalStrategy = require("passport-local");
const flash = require("connect-flash");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const async = require("async");
const multer = require("multer");


//multer configuration
const storage = multer.diskStorage({
        destination: './public/images/user_dp',
        filename: function(req,file,next){
            next(null, file.fieldname + '-' + user.username + path.extname(file.originalname));
        }
    });

const upload = multer({
    storage: storage,
    limits:{fileSize: 10000000}, //set to 10MB
    //to enable only image files to be uploaded
    fileFilter: function(req,file,next){
        checkFileType(file,next);
    }
}).single('profpic');

//checking file type
function checkFileType(file, next){
    //allowed extensions
    const fileTypes = /jpeg|jpg|png/;
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


//requiring the models
var User = require("../models/user");


//requiring the middlwares
var middleware = require("../middleware");
const { runInNewContext } = require("vm");

router.get("/users", function(req,res)
{
  if(req.query.search)
  {
    console.log(req.query.search);
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    User.find({username: regex} ,function(err, foundUser) {

      if(err) {
        console.log(err);
        req.flash("error_msg", "Something went wrong.");
        return res.redirect("back");
      } else {
        res.render("user/show_users", {users: foundUser});
      }
  })
  }  else {
    User.find({} ,function(err, foundUser) {

      if(err) {
        console.log(err);
        req.flash("error_msg", "Something went wrong.");
        return res.redirect("back");
      } else {
        res.render("user/show_users", {users: foundUser});
      }
  }) 
  }
});

//User routes
router.get("/user/:id", function(req,res){
  User.findById(req.params.id, function(err, foundUser) {

        if(err) {
          req.flash("error_msg", "Something went wrong.");
          return res.redirect("/");
        } else {
            res.render("user/profile",{user: foundUser});
        }
    })
});

router.post("/follow", function (req, res) {
  const toFollow = req.body.followId;
  const whoFollow = req.user._id;


  User.findByIdAndUpdate(toFollow, {$push :{followers : whoFollow }
  },
  {new:true
  },(err,result)=>{
    if(err){
      return res.status(422),json({error:err})
    }
  }),
User.findByIdAndUpdate(whoFollow, {$push :{following : toFollow }},{new:true},(err,result)=>{
    if(err){
      return res.status(422),json({error:err})
    }
  })
  // console.log(foundUser);
res.redirect("back");
});

router.post("/unfollow", function (req, res) {
  const toFollow = req.body.followId;
  const whoFollow = req.user._id;

  User.findByIdAndUpdate(toFollow, {$pull :{followers : whoFollow }
  },
  {new:true
  },(err,result)=>{
    if(err){
      return res.status(422),json({error:err})
    }
  }),
User.findByIdAndUpdate(whoFollow, {$pull :{following : toFollow }},{new:true},(err,result)=>{
    if(err){
      return res.status(422),json({error:err})
    }
  })
    // console.log(foundUser);
res.redirect("back");
});

///////Edit bio routes
router.get("/editBio",function(req,res){
  res.render("user/EditBio");
});

router.post("/editBio", function(req,res){
  upload(req,res,(err) => {
    if(err){
        req.flash("error_msg", err.message);
    } else {
        if(req.file == undefined){
            req.flash("error_msg","Oops! no file selected.");
            res.redirect("back");
        } else {
          file: "/images/user_dp/${req.file.filename}";
          
        }
      }
    });
});





function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;


