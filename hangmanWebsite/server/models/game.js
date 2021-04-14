let mongoose = require('mongoose');
let gameSchema = new mongoose.Schema(
   {
      id : String,
      userId : {type : mongoose.Schema.Types.ObjectId, ref : 'User'},
      colors : Object,
      font : Object,
      guesses : String,
      level : Object,
      remaining : Number,
      status : String,
      target : String,
      timestamp : Number,
      timeToComplete : Number,
      view : String
   }
)

let Game = mongoose.model( 'Game', gameSchema );
module.exports = Game;