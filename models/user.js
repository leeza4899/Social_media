const Mongoose =require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose");
const { isDate } = require('moment');

var  UserSchema= new Mongoose.Schema({
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
   },
   secretToken :{
       type : String
   },
   active:{
       type:Boolean
   }

});
UserSchema.plugin(passportLocalMongoose);
const User = Mongoose.model('User',UserSchema);
module.exports = User;