var express = require("express");
var app = express();
var path = require("path");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

const db =require('./models/config').MongoURI;
//db config

//connect to db
mongoose.connect(db,{useNewUrlParser:true})
.then(()=> console.log('connected to db'))
.catch(err => console.log(err));


app.get("/", function(req,res){
	res.render("landing");
});

app.get("/signup", function(req,res){
	res.render("signup");
})

app.get("/login", function(req,res){
	res.render("login");
})


const PORT = 3000 || process.env.PORT

app.listen(PORT, process.env.IP, function(){
	console.log("Server has begun!!");
})

