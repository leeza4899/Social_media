var express = require("express");
var app = express();
var path = require("path");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var passport      = require("passport");
var LocalStrategy = require("passport-local");


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));


//PASSPORT CONFIG
app.use(require("express-session")({
	secret: "leeza4899",
	resave: false,
	saveUninitialized: false
}));

//acquiring the db models
const User = require("./models/user");

app.use(passport.initialize());
app.use(passport.session());
//middleware for login
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.get("/", function (req, res) {
	res.render("landing");
});

app.get("/signup", function (req, res) {
	res.render("signup");
});

app.post("/login", function (req, res) {

	const {email,password} =req.body;
	let errors =[];
		if( !email || !password){
			errors.push({msg : "Fill all fields"})
		}

		if(errors.length>0){
			res.render('signup',{
				errors,
				email
			});
		}
		else {
			res.send("done");
		}
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
		} else { 	//registering new user
		var newUser = new User({ 
			name: req.body.signname,
			email: req.body.emailid,
			username: req.body.nickname,
			date: req.body.dob
			});
		User.register(newUser, req.body.password, function(err, user){
			if(err){
				res.redirect("signup");
			} else {
				console.log(newUser);
				return res.render("landing");
			}
			passport.authenticate("local")(req, res, function(){
				res.render("landing"); 
			 });
		});
	}
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

