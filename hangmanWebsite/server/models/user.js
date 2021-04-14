let mongoose = require('mongoose');
let userSchema = new mongoose.Schema(
   {
      email : { type : String, unique : true},
      password : { type : String, required : true},
      defaults : {
         font : {
            category : String, 
            family : String, 
            rule : String, 
            url : String
         },
         level : { 
            name : String, 
            minLength : Number, 
            maxLength : Number, 
            rounds : Number 
         },
         colors : {
            guessBackground : String, 
            textBackground : String, 
            wordBackground : String
         }
     }
   }
)

let User = mongoose.model( 'User', userSchema );
module.exports = User;