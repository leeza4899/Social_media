var express = require("express");
var router = express.Router();
var passport = require("passport");
var bcrypt = require("bcryptjs");
var User = require("../models/user");


//landing route
router.get("/", function (req, res) {
	res.render("landing");
});

//signup routes
router.get("/signup", function (req, res) {
	res.render("signup");
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
						  newUser.save()
							.then(user => {
                                req.flash('success_msg',"Successfully signed up. Please login to continue.");
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

//logout route
router.get("/logout", function(req,res){
	req.logout();
	res.send("logout done");
});


module.exports = router;