const Mongoose =require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose");
const { isDate } = require('moment');
const {ObjectId} = Mongoose.Schema.Types;

const User = require("./models/user");
const Query = require("./models/query");
const Blogs = require("./models/Blogs");
const Replies = require("./models/Replies");



var  CommentSchema= new Mongoose.Schema({
   blog:{
    type: ObjectId,
    ref: "Blogs"
   },
   user:{
       type:ObjectId,
       ref:"User"
   },
   comment:{
       type:String,
       required:true
   },
   replies:[{
           type:ObjectId,
           ref:"Replies"
       }]   
});
UserSchema.plugin(passportLocalMongoose);
const Comment = Mongoose.model('Comment',CommentSchema);
module.exports = Comment;