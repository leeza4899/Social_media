const express       = require("express");
const app           = express();
const path          = require("path");
const mongoose      = require("mongoose");
const bodyParser 	= require("body-parser");
const passport      = require("passport");
const bcrypt 		= require("bcryptjs");
const LocalStrategy = require("passport-local");
const flash		    = require("connect-flash");
const User 			= require("./models/user");
const { Router } = require("express");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));


//PASSPORT CONFIG
app.use(require("express-session")({
	secret: "secret",
	resave: true,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


app.use(flash()); 
app.use((req,res,next)=>{
	res.locals.success_msg=req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	next();
});
///////////////////Authentication stragegy
passport.use(
	new LocalStrategy({
		usernameField: 'email'
	}, (email, password, done) => {
		User.findOne({
				email: email
			})
			.then(user => {
				if (!user) {
					return done(null, false, {
						message: 'not Registered'
					});

				}
				bcrypt.compare(password, user.password, (err, isMatch) => {
					if (err) throw err;

					if (isMatch) {
						return done(null, user);
					} else {
						return done(null, false, {
							message: 'Password incorrerct'
						});
					}
				});

			})
			.catch(err => console.log(err));
	})
);
passport.serializeUser(function (user, done) {
	done(null, user.id);
});
passport.deserializeUser(function (id, done) {
	user.findById(id, function (err, user) {
		done(err, user);
	});
});
//////////////////////////////

//acquiring the db models



//middleware for login


///////#######AUTH ROUTES#######////////
//landing route
app.get("/", function (req, res) {
	res.render("landing");
});

//signup routes
app.get("/signup", function (req, res) {
	res.render("signup");
});

app.post("/signup", function (req, res) {
	//check required
	const {signname, username, emailid, pass, dob} =req.body;
	let errors =[];
		if( !signname || !username || !emailid || !pass || !dob){
			errors.push({msg : "Fill all fields"})
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
					errors.push({msg:"Email Already Exist"})
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
								req.flash('success_msg',"you are now a member please login");
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
app.post('/login', (req, res, next) => {
	const{email,password} =req.body;
	passport.authenticate("local",{
		successRedirect:'/signup',
		failureRedirect:'/landing',
		failureFlash:true
	})(req,res,next);
	
});

//logout route
app.get("/logout", function(req,res){
	req.logout();
	res.send("logout done");
});
/////////////////////////////////////////////////////////// DB

const db = 'mongodb://localhost:27017/Users'
//db config

//connect to db
mongoose.connect( db, {useNewUrlParser:true,useUnifiedTopology: true,useCreateIndex: true})
.then(()=> console.log('connected to db'))
.catch(err => console.log(err));
///////////////////////////////////////////////////////////////SERVERS


const PORT = 3000 || process.env.PORT

app.listen(PORT, process.env.IP, function(){
	console.log("Server has begun!!");
})

