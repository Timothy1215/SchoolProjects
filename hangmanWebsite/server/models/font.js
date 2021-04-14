let mongoose = require('mongoose');
let fontSchema = new mongoose.Schema(
   {
      category : 'string',
      family : 'string',
      rule : 'string',
      url : 'string'
   }
)

let Font = mongoose.model( 'Font', fontSchema );
module.exports = Font;