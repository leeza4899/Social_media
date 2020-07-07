const Mongoose =require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose");
const {ObjectId} = Mongoose.Schema.Types;

var  blogSchema= new Mongoose.Schema({
    title:{
        type : String,
        required: true
    },
    body:{
        required:true,
        type:String
    },
    image:{
        required: true,
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    likes:[{
        type: ObjectId,
        ref: "User"
    }],
    author: {
        id: {
            type: ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [{
        type: ObjectId,
        ref: "comment"
    }],
    category: {
        type: String,
        required: true
    }
});

blogSchema.plugin(passportLocalMongoose);
const blog = Mongoose.model('blog',blogSchema);
module.exports = blog;