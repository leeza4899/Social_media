const Mongoose =require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose");
const { isDate } = require('moment');
const {ObjectId} = Mongoose.Schema.Types;

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
       type:String,
       unique: true
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
   },
   bio:{
       type:String,
   },
   image:{
       type:String,
   },   
   followers:[{
       type: ObjectId,
       ref: "User"
   }],
   following:[{
    type: ObjectId,
    ref: "User"
}],

    food:{
        type:Number
    },
    pets:{
        type:Number
    },
    drinks: {
        type: Number
    },
    plants: {
        type: Number
    },
    professional: {
        type: Number
    },
    avatar: {
        type: Number
    },

    music: {
        type: Number
    },

    instagram:{
        type:String,
    },
    twitter:{
        type:String
    },
    linkedin:{
        type:String,
    },
    facebook:{
        type:String
    },
    gmail:{
        type:String
    },


});
UserSchema.plugin(passportLocalMongoose);
const User = Mongoose.model('User',UserSchema);
module.exports = User;