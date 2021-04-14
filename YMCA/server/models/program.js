let mongoose = require('mongoose');
let programSchema = new mongoose.Schema(
   {
        name : String,
        capacity : Number,
        location : String,
        fee : Number,
        startTime : String,
		endTime : String,
        description : String,
		startDate : String,
		endDate : String,
	    day: [{
			type: String
		}]
   }
)

let Program = mongoose.model( 'Program', programSchema );
module.exports = Program;
