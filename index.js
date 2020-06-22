var express = require("express");
var app = express();
var path = require("path");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

const er =require("./models/user");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

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
			errors.push({msg : "fill all fields"})
		}

		if(errors.length>0){
			
			res.render('signup',{
				email,password
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
			errors.push({msg : "fill all fields"})
			
		}

		if(errors.length>0){
			console.log(errors)
			res.render('signup',{
				errors,
				signname,
				username,
				emailid,
				dob			
			});
		}
		else {
			res.send("done");
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

