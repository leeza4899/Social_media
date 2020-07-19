const Mongoose = require('mongoose');
const {ObjectId} = Mongoose.Schema.Types;

var RepliesSchema = new Mongoose.Schema({
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
	}

});

const Replies = Mongoose.model('Replies', RepliesSchema);
module.exports = Replies;