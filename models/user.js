const { Mongoose } = require("mongoose");

const Mongoose =require('mongoose');

const  UserSchema= new Mongoose.Sechema({
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
       type:date,
       default:Date.now
   }

});
const User =Mongoose.model('User',UserSchema);
module.exports = User;