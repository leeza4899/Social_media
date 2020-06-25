const express       = require("express");
const app           = express();
const path          = require("path");
const mongoose      = require("mongoose");
const bodyParser 	= require("body-parser");
const passport      = require("passport");
const bcrypt 		= require("bcryptjs");
const LocalStrategy = require("passport-local");
const flash		    = require("connect-flash");
const randomstring = require('randomstring');



//////ROUTE FILES
var indexRoutes       = require("./routes/authRoutes");

/////MODELS
const User 			  = require("./models/user");

//////moongoose
const db = 'mongodb://localhost:27017/new'
//db config

//connect to db
mongoose.connect( db, {useNewUrlParser:true,useUnifiedTopology: true,useCreateIndex: true})
.then(()=> console.log('connected to db'))
.catch(err => console.log(err));


////additional-------
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.locals.moment = require('moment');


//PASSPORT CONFIG
app.use(require("express-session")({
	secret: "secret",
	resave: true,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
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
						message: 'User not found.'
					});
				}
				//////check email verification

				if(!user.active){
					return done(null,false,{message:'You need to Verify your email'});
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
	User.findById(id, function (err, user) {
		done(err, user);
	});
});


app.use(function(req, res, next){
	res.locals.loggedUser =  req.user;
	next();
});

//flash setup
app.use(flash()); 
app.use((req,res,next)=>{
	res.locals.success_msg=req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	next();
});

////using routes
app.use(indexRoutes);



/////listening ports
const PORT = 3000 || process.env.PORT

app.listen(PORT, process.env.IP, function(){
	console.log("Server has begun!!");
})

