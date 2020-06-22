const Mongoose =require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose");
const { isDate } = require('moment');

const  UserSchema= new Mongoose.Schema({
   name:{
       type:String,
       required :true
   },
   email:{
       type : String,
       required: true
   },
   password:{
       type:String,
       required:true
   },
   username:{
       required:true,
       type:String
   },
   date:{
       type : Date,
       default:Date.now
   }

});
UserSchema.plugin(passportLocalMongoose);
const User = Mongoose.model('User',UserSchema);
module.exports = User;