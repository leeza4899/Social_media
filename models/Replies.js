const Mongoose = require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose");
const {
    isDate
} = require('moment');
const {
    ObjectId
} = Mongoose.Schema.Types;

const User = require("./models/user");
const Query = require("./models/query");
const Blogs = require("./models/Blogs");
const comments = require("./models/comments");



var RepliesSchema = new Mongoose.Schema({
    reply:{
        type:String,
    },
    admin:{
        type:ObjectId,
        ref:"User"
    }
});
UserSchema.plugin(passportLocalMongoose);
const Replies = Mongoose.model('Replies', RepliesSchema);
module.exports = Replies;