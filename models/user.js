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
       unique: true,
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
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpires:{
        type: Date,
    },
   active:{
       type:Boolean
   }

});
UserSchema.plugin(passportLocalMongoose);
const User = Mongoose.model('User',UserSchema);
module.exports = User;