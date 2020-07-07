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


//Requiring essential models
const User = require("../models/user");
const blog = require("../models/blog");


////////////BLOG ROUTES///////////////////
//enterance
router.get("/blog/entry", function(req,res){
    res.render("blog/entry");
});

//CRUD ROUTES



module.exports = router;