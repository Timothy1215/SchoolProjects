let mongoose = require('mongoose');
let userSchema = new mongoose.Schema(
   {
      username : { type : String, unique : true},
      password : { type : String, required : true},
      firstName : {type : String},
      lastName : {type : String},
      member : {type : Boolean},
      staff : {type : Boolean},
      active : {type : Boolean},
      programs : [
         {type : mongoose.Schema.Types.ObjectId, ref : 'Program'}
      ]
   }
)

let User = mongoose.model( 'User', userSchema );
module.exports = User;