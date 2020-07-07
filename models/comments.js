var Mongoose = require("mongoose");
const {ObjectId} = Mongoose.Schema.Types;

var commentSchema = Mongoose.Schema({
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
	replies:[{
		type: ObjectId,
		ref:"Replies"
	}],
    likes:[{
        type: ObjectId,
        ref: "User"
    }],
});

const comment = Mongoose.model('comment',commentSchema);
module.exports = comment;