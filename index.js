var express       = require("express");
var app           = express();
var path          = require("path");
var mongoose      = require("mongoose");
var bodyParser 	  = require("body-parser");
var passport      = require("passport");
var bcrypt 		  = require("bcryptjs");
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
					res.render('./signup',{
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
						  newUser
							.save()
							.then(user => {
							  res.redirect('/');
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
	passport.authenticate('local', {
	  successRedirect: '/',
	  failureRedirect: '/signup',
	})(req, res, next);
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

