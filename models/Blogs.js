const Mongoose =require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose");
const { isDate } = require('moment');
const {ObjectId} = Mongoose.Schema.Types;

const User = require("./models/user");
const Query = require("./models/query");
const Comment = require("./models/comments");

var  BlogSchema= new Mongoose.Schema({
   blog:{
       type:String,
       required :true
   },
   admin:{
       type: ObjectId,
        ref: "User"
   },
   comments:[{
       type:ObjectId,
       ref:'Comment'
   }],

   
});
UserSchema.plugin(passportLocalMongoose);
const Blog = Mongoose.model('Blog',BlogSchema);
module.exports = Blog;