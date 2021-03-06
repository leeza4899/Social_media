var Mongoose = require("mongoose");
const {ObjectId} = Mongoose.Schema.Types;

var commentSchema = Mongoose.Schema({
	text: {
		type: String
	},
	createdAt: {
        type: Date,
         default: Date.now
    },
	author: {
		id: {
			type: ObjectId,
			ref: "User"
		},
		admin: String
	},
	replies:[{
		type: ObjectId,
		ref:"Replies",
		
	}]
});

const comment = Mongoose.model('comment',commentSchema);
module.exports = comment;