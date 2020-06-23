var express = require("express");
var router = express.Router();
var passport = require("passport");
var bcrypt = require("bcryptjs");
var User = require("../models/user");
const randomstring =require('randomstring');
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const LocalStrategy = require("passport-local");
const flash = require("connect-flash");
// const mailer = require('../models/mail');




//landing route
router.get("/", function (req, res) {
	res.render("landing");
});

//signup routes
router.get("/signup", function (req, res) {
	res.render("signup");
});
//verify routes
router.get("/verify", function (req, res) {
	res.render("verify");
});



router.post("/signup", function (req, res) {
	//check required
	const {signname, username, emailid, pass, dob} =req.body;
	let errors =[];
		if( !signname || !username || !emailid || !pass || !dob){
			errors.push({msg : "All fields are Required."})
		}
		if(errors.length > 0){
			console.log(errors)
			res.render('signup',{
				errors,
				signname,
				username,
				emailid,
				dob			
			});
		} else { 	
			//registering new user\
			User.findOne({email : emailid})
			.then(user =>{
				if(user){
					errors.push({msg:"Email Already Exists"})
					res.render('signup',{
				errors,
				signname,
				username,
				emailid,
				dob			
			});
				} else{
					const newUser = new User({ 
					name: req.body.signname,
					email: req.body.emailid,
					password:req.body.pass,
					username: req.body.username,
					date: req.body.dob
					});

					bcrypt.genSalt(10, (err, salt) => {
						bcrypt.hash(newUser.password, salt, (err, hash) => {
						  if (err) throw err;
						  newUser.password = hash;
///////////////////////////////adding string to send to verify Email id
 						  const secretToken =randomstring.generate(10);
						  newUser.secretToken=secretToken;
/////////////////////////////// bool function to check if email is verified or not
						  newUser.active=false;
						  const html = secretToken;
						  mailer.sendEmail('friendsBlog.in',emailid,'please verify your email',html);
						  newUser.save()
						  
							.then(user => {
                                req.flash('success_msg',"Successfully signed up. Please Check your email.");
                                res.redirect('/signup');
							})
							.catch(err => console.log(err));
						});	
					});	
				}
	});
}
});

//login route
router.post('/login', (req, res, next) => {
	const{email,password} =req.body;
	passport.authenticate("local",{
		successRedirect:'/',
		failureRedirect:'/signup',
		failureFlash:true
	})(req,res,next);
	
});


//verify post function
router.post('/verify',(async (req,res,next) =>{

	try{
		var {SecretToken}=req.body;
		if(SecretToken==''){
			req.flash('error','Try again no user found');
			res.redirect('/verify');
		}
		const user = await User.findOne({'secretToken': SecretToken});
		///find which user does the token belongs to
		if(!user){
			
			req.flash('error','Try again no user found');
			res.redirect('/verify');
			return;
		}
		console.log(user);
		user.active =true;
		user.secretToken='';
		await user.save();
		req.flash('success','Good Now you may login');
		res.redirect('/signup');
	}
	catch(err){
		next(err);
	}
	
}));

//logout route
router.get("/logout", function(req,res){
	req.logout();
	res.send("logout done");
});


module.exports = router;