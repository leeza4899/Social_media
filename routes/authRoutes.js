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

//requiring models
const Query = require("../models/query");
const User = require("../models/user");


//landing route
router.get("/", function (req, res) {
	res.render("landing");
});

//team page route
router.get("/team", function(req,res){
	res.render("team");
});

//signup routes
router.get("/signup", function (req, res) {
	res.render("Auth/signup");
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
			res.render('Auth/signup',{
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
					res.render('Auth/signup',{
				errors,
				signname,
				username,
				emailid,
				dob			
			});
				} else{
					//const secretToken =randomstring.generate(6);
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
/////////////////////////////GMAIL AUTHENTICATION/////////////////////
		let transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'newfriendsblog@gmail.com', 
			pass: 'friends123blog', 
			},
		tls: {
		// do not fail on invalid certs
			rejectUnauthorized: false
		},
		});
		var str =  "<h4>Welcome to friendsBlog! To verify your email, use the token below.<h4>Token:  " + newUser.secretToken + "<p>Thank you for joining us!<p>"
		//console.log(str); --- for debugging purposes!
///////////////////////////////////// send mail with defined transport object
		const info ={
			from: '"friendsBlog 👻" <newfriendsblog@gmail.com>', // sender address
			to: req.body.emailid, /*'jainnaman335@gmail.com', 'leezaaggarwal1@gmail.com'*/ // list of receivers
			subject: "Email ID validation token", // Subject line
			html: str,  // html body
		};
		transporter.sendMail(info, function(err, data){
		if(err){
				console.log(err);
		} else {
				console.log("Message sent");
			}
		})
		transporter.close();

/////////////////////////////// bool function to check if email is verified or not
		newUser.active=false;
		newUser.save() 
			.then(user => {
				req.flash('success_msg',"Successfully signed up. Please Check your email for the validation token.");
				res.redirect('/verify');
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
		successRedirect:'/blog',
		failureRedirect:'/',
		failureFlash:true
	})(req,res,next);
	
});

//verify routes
router.get("/verify", function (req, res) {
	res.render("auth/verify");
});

//verify post function
router.post('/verify',(async (req,res,next) =>{

	try{
		var {SecretToken}=req.body;
		if(SecretToken==''){
			req.flash('error_msg','Try again! The key you entered is not valid.');
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
		req.flash('success_msg','Good to go, Please login to continue');
		res.redirect('/signup');
	}
	catch(err){
		next(err);
	}
	
}));

///////////Forgot Password
router.get("/forgot", function(req,res){
	res.render("Auth/forgot");
});


router.post('/forgot', function(req, res, next) {
	async.waterfall([
	  function(done) {
		crypto.randomBytes(20, function(err, buf) {
		  var token = buf.toString('hex');
		  done(err, token);
		});
	  },
	  function(token, done) {
		User.findOne({ email: req.body.email }, function(err, user) {
		  if (!user) {
			req.flash('error_msg', 'No account with that email address exists.');
			return res.redirect('/forgot');
		  }
  
		  user.resetPasswordToken = token;
		  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  
		  user.save(function(err) {
			done(err, token, user);
		  });
		});
	  },
	  function(token, user, done) {
		var smtpTransport = nodemailer.createTransport({
		  service: 'Gmail', 
		  auth: {
			user: 'newfriendsblog@gmail.com',
			pass: 'friends123blog'
		  },
		  tls:{
			  rejectUnauthorized: false
		  },
		});
		var mailOptions = {
		  to: req.body.email ,
		  from: '"friendsBlog 👻" <newfriendsblog@gmail.com>',
		  subject: 'friendsBlog Password Reset',
		  text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
			'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
			'http://' + req.headers.host + '/reset/' + token + '\n\n' +
			'If you did not request this, please ignore this email and your password will remain unchanged.\n'
		};
		smtpTransport.sendMail(mailOptions, function(err) {
		  console.log('mail sent');
		  req.flash('success_msg', 'An e-mail has been sent to ' + req.body.email  + ' with further instructions.');
			done(err, 'done');
		});
	  }
	], function(err) {
	  if (err) return next(err);
	  res.redirect('/forgot');
	});
  });
  

  ///Reset routes
  router.get('/reset/:token', function(req, res) {
	User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
	  if (!user) {
		req.flash('error_msg', 'Password reset token is invalid or has expired.');
		return res.redirect('/forgot');
	  }
	  res.render('Auth/reset', {token: req.params.token});
	});
  });

///reset post route
router.post('/reset/:token', function(req, res) {
	async.waterfall([
	  function(done) {
		User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
		  if (!user) {
			req.flash('error_msg', 'Password reset token is invalid or has expired.');
			return res.redirect('back');
		  }
		  if( !req.body.password || !req.body.confirm){
			req.flash('error_msg', 'Please fill in all the fields.');
			return res.redirect('back');
		}
		  else if(req.body.password === req.body.confirm) {
			user.setPassword(req.body.password, function(err) {
			  user.resetPasswordToken = undefined;
			  user.resetPasswordExpires = undefined;
  
			  user.save(function(err) {
				req.logIn(user, function(err) {
				  done(err, user);
				});
			  });
			})
		  } else {
			  req.flash("error_msg", "Passwords do not match.");
			  return res.redirect('back');
		  }
		});
	  },
	  function(user, done) {
		var smtpTransport = nodemailer.createTransport({
		  service: 'Gmail', 
		  auth: {
			user: 'newfriendsblog@gmail.com',
			pass: 'friends123blog'
		  }
		});
		var mailOptions = {
		  to: user.email,
		  from: '"friendsBlog 👻" <newfriendsblog@gmail.com>',
		  subject: 'Your password has been changed',
		  text: 'Hello,\n\n' +
			'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
		};
		smtpTransport.sendMail(mailOptions, function(err) {
		  req.flash('success_msg', 'Success! Your password has been changed.');
		  done(err);
		});
	  }
	], function(err) {
	  res.redirect('/signup');
	});
  });

router.post("/query", function(req,res){
	const {email, message} =req.body;
		let transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: 'newfriendsblog@gmail.com', 
				pass: 'friends123blog', 
				},
			tls: {
			// do not fail on invalid certs
				rejectUnauthorized: false
			},
			});
			const info ={
				from: '"friendsBlog 👻" <newfriendsblog@gmail.com>', // sender address
				to: 'newfriendsblog@gmail.com', /*'jainnaman335@gmail.com', 'leezaaggarwal1@gmail.com'*/ // list of receivers
				subject: "Query Message through website", // Subject line
				text: 'This is a query message sent over through the website query form\n\n' +
			'The message has been sent from email: ' + req.body.email + '\n The query message is:\n' + req.body.message + '\n\n' ,
			};
			transporter.sendMail(info, function(err, data){
			if(err){
					console.log(err);
			} else {
					console.log("Message sent");
					req.flash('success_msg', 'Query sent to the owner. Will get back to you soon.');
					return res.redirect("back");
				}
			})
			transporter.close();
});

// follower//following system



//logout route
router.get("/logout", function(req,res){
	req.logout();
	req.flash('success_msg', 'Logged out Succesfully!');	
	return res.redirect("/signup");
	
});




module.exports = router;