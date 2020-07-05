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


//requiring the models
var User = require("../models/user");


//requiring the middlwares
var middleware = require("../middleware");

//User routes
router.get("/user/:id", function(req,res){

    User.findById(req.params.id, function(err, foundUser) {

        if(err) {
          req.flash("error_msg", "Something went wrong.");
          return res.redirect("/");
        } else {
            res.render("profile",{user: foundUser});
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
res.redirect("/user/:id");
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

res.redirect("/user/:id");
});


















module.exports = router;


