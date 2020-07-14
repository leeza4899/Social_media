const Mongoose =require('mongoose');
const {ObjectId} = Mongoose.Schema.Types;

var  categorySchema= new Mongoose.Schema({
   name: {
       type: String
   },
    Categ_id:[{
       type: ObjectId,
        ref: "blog"
    }]
});

const category = Mongoose.model('category',categorySchema);
module.exports = category;