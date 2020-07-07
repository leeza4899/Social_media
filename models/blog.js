const Mongoose =require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose");


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
    likes: {
        type: Number
    },
    author: {
        id: {
            type: Mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        username: String
    },
    comments: [{
        type: Mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    category: {
        type: String,
        required: true
    }
});

blogSchema.plugin(passportLocalMongoose);
const blog = Mongoose.model('blog',blogSchema);
module.exports = blog;