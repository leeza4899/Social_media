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



router.get("/chatroom", function (req, res) {
    res.render("ChatRoom/chatroom");
});



module.exports = router;