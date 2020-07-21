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



//requiring the models
var User = require("../models/user");
var blog = require("../models/blog");

router.use(bodyParser.urlencoded({ extended: true }));

//requiring the middlwares
var middleware = require("../middleware");
const { runInNewContext } = require("vm");
const { link } = require("fs");


//multer configuration
const storage = multer.diskStorage({
        destination: './public/images/user_dp',
        filename: function(req,file,next){
            next(null, file.fieldname + '-' + req.user.username + path.extname(file.originalname));
        }
    });

const upload = multer({
    storage: storage,
    limits:{fileSize: 2000000}, //set to 10MB
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


router.get("/users", function(req,res)
{
  if(req.query.search)
  {
    console.log(req.query.search);
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    User.find({
          name: regex,
          active:true
        }, function (err, foundUser) {

      if(err) {
        console.log(err);
        req.flash("error_msg", "Something went wrong.");
        return res.redirect("back");
      }
        blog.find().where('author.id').equals(foundUser._id).exec(function(err, inblogs) {
          if(err) {
            return res.redirect("/");
          }
        res.render("user/show_users", {users: foundUser, blogs: inblogs});
      })
  })
  }  else {
    User.find({} ,function(err, foundUser) {
      if(err) {
        console.log(err);
        req.flash("error_msg", "Something went wrong.");
        return res.redirect("back");
      } 
        blog.find().where('author.id').equals(foundUser._id).exec(function(err, inblogs) { 
          if(err) {
            return res.redirect("/");
          }
        res.render("user/show_users", {users: foundUser, blogs: inblogs});
      })
  }) 
  }
});

//User routes
router.get("/user/:id", function(req,res){
  User.findById(req.params.id, function(err, foundUser) {

        if(err) {
          req.flash("error_msg", "Something went wrong.");
          return res.redirect("/");
        }
        blog.find().where('author.id').equals(foundUser._id).exec(function(err, blogs) {
          if(err) {
            return res.redirect("/");
          }
            res.render("user/profile",{user: foundUser, blogs: blogs});
        })
    })
});



// Follow - Unfollow routes
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
router.get("/editbio", middleware.isloggedIn, function(req,res){
  User.findById(req.user.id, function(err, found){
    if(!found){
        req.flash("error_msg", "User doesn't exist");
        return res.redirect("/user/<%= user._id%>");
    }

    res.render("user/EditBio", {user: found});
})
});

router.post("/biodone",  middleware.isloggedIn, function(req,res){
  upload(req,res,(err) => {
    if(err){
        req.flash("error_msg", err.message);
    } else {
        if(req.file == undefined){
            req.flash("error_msg","Oops! no file selected.");
            res.redirect("back");
        } else {
          console.log(req.file);
          file: `/images/user_dp/${req.file.filename}`;
          var bio = req.body.bio;
          var image = req.file.filename;
          var twitter = req.body.twitter;
          var instagram = req.body.insta;
          var facebook = req.body.fb;
          var gmail = req.body.gmail;
          var linkedin = req.body.linkedin;
          //choices
          var pets = req.body.pet;
          var avatar = req.body.avatar;          
          var professional = req.body.profession;
          var food = req.body.food;
          var drinks = req.body.drinks;
          var plants = req.body.plants;
          var music = req.body.music;

          var updated_prof = {
            bio:bio,
            image:image,
            twitter: twitter,
            instagram: instagram,
            facebook: facebook,
            gmail: gmail,
            linkedin: linkedin,
            //choices
            pets: pets,
            avatar: avatar,
            professional: professional,
            food: food,
            drinks: drinks,
            plants: plants,
            music: music
          };
          console.log(updated_prof);

          User.findByIdAndUpdate(req.user._id,updated_prof, function(err, updatedprof){
              if(err){
                console.log(err);
                }else {
                  req.flash("success_msg", "Profile Updated!");
                  return res.redirect("/user/" + req.user._id);
              }
          })
        }
      }
    });
});





function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;


