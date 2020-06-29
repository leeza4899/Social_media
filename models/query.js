const Mongoose =require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose");


var  QuerySchema= new Mongoose.Schema({
      email:{
        type : String,
        unique: true,
        required: true
   },
      message:{
        required:true,
        type:String
   }
});
QuerySchema.plugin(passportLocalMongoose);
const Query = Mongoose.model('Query',QuerySchema);
module.exports = Query;