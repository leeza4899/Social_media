var Mongoose = require("mongoose");

var commentSchema = Mongoose.Schema({
	text: String,
	createdAt: {
        type: Date,
         default: Date.now
    },
	author: {
		id: {
			type: Mongoose.Schema.Types.ObjectId,
			ref: "user"
		},
		username: String
	}
});

const comment = Mongoose.model('comment',commentSchema);
module.exports = comment;