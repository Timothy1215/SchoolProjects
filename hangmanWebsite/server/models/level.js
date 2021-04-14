let mongoose = require('mongoose');
let levelSchema = new mongoose.Schema(
   {
      rounds : Number,
      maxLength : Number,
      minLength : Number,
      name : String
   }
)

let Level = mongoose.model( 'Level', levelSchema );
module.exports = Level;