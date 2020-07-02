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

//follow route
router.post('/follow', async (req, res, next) => {
  const { follower, following, action } = req.body;
  try {
      switch(action) {
          case 'follow':
              await Promise.all([ 
                  users.findByIdAndUpdate(follower, { $push: { following: following }}),
                  users.findByIdAndUpdate(following, { $push: { followers: follower }})
              
              ]);
          break;

          case 'unfollow':
              await Promise.all([ 
                  users.findByIdAndUpdate(follower, { $pull: { following: following }}),
                  users.findByIdAndUpdate(following, { $pull: { followers: follower }})
              
              ]); 
          break;

          default:
              break;
      }

      res.json({ done: true });
      
  } catch(err) {
      res.json({ done: false });
  }
});
















module.exports = router;


