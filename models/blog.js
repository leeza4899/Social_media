const Mongoose =require('mongoose');
const {ObjectId} = Mongoose.Schema.Types;

var  blogSchema= new Mongoose.Schema({
    title:{
        type : String,
        required: true
    },
    desc:{
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
        authorName: String
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

const blog = Mongoose.model('blog',blogSchema);
module.exports = blog;