const Mongoose = require('mongoose');
const {ObjectId} = Mongoose.Schema.Types;

var RepliesSchema = new Mongoose.Schema({
    text: String,
	createdAt: {
        type: Date,
         default: Date.now
    },
	author: {
		id: {
			type: ObjectId,
			ref: "User"
		},
		username: String
	},
    likes:[{
        type: ObjectId,
        ref: "User"
    }],

});

const Replies = Mongoose.model('Replies', RepliesSchema);
module.exports = Replies;