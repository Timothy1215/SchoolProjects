let mongoose = require('mongoose');
let bcrypt = require('bcrypt');

let User = require('../models/user');
let Program = require('../models/program');

async function mockUser(){

    let users = [
        {
            username : "thoman.timothy",
            password : bcrypt.hashSync("123123123", 10),
            firstName : "Tim",
            lastName : "Thoman",
            member : false,
            staff : true,
            active : true
        },
        {
            username : "veldboom.gabriel",
            password : bcrypt.hashSync("abcabcabc", 10),
            firstName : "Gabriel",
            lastName : "Veldboom",
            member : false,
            staff : true,
            active : true
        },
        {
            username : "doe.john",
            password : bcrypt.hashSync("111222333", 10),
            firstName : "John",
            lastName : "Doe",
            member : true,
            staff : false,
            active : true
        },
        {
            username : "anderson.luke",
            password : bcrypt.hashSync("password", 10),
            firstName : "Luke",
            lastName : "Anderson",
            member : false,
            staff : false,
            active : true
        },
		{
            username : "anderson.aini",
            password : bcrypt.hashSync("password", 10),
            firstName : "Aini",
            lastName : "Anderson",
            member : true,
            staff : false,
            active : true
        },
		{
            username : "doe.jane",
            password : bcrypt.hashSync("password", 10),
            firstName : "Jane",
            lastName : "Doe",
            member : true,
            staff : false,
            active : true
        }




    ];

    await User.insertMany(users);
}

async function mockProgram(){
    let programs = [
           {
            name : "Shark",
            capacity : 7,
            location : "YMCA Onalaska pool",
            fee : 96,
            startTime : "5:00pm",
			endTime : "5:40pm",
            day : ["Sun"],
			startDate : "12/14/2020",
		    endDate : "01/10/2021",
            description : "Participants must have passed pike level before."
           },
		   {
            name : "Shark",
            capacity : 7,
            location : "YMCA Onalaska pool",
            fee : 130,
            startTime : "6:00pm",
			endTime : "6:40pm",
            day : ["Mon", "Wed"],
			startDate : "12/14/2020",
		    endDate : "01/10/2021",
            description : "Participants must have passed pike level before."
           },
           {
            name : "Log Rolling",
            capacity : 0,
            location : "YMCA Onalaska pool",
            fee : 200,
            startTime : "5:00pm",
			endTime : "5:40pm",
            day : ["Sun"],
			startDate : "12/14/2020",
			endDate :  "01/10/2021",
            description : "Log rolling is a sport in which two contestants stand on a floating log and try to knock each other off by spinning it with their feet. This is a competitive program with limited capacity."
           },
		   {
            name : "Log Rolling",
            capacity : 0,
            location : "YMCA Onalaska pool",
            fee : 200,
            startTime : "6:00pm",
			endTime : "6:40pm",
            day : ["Mon"],
			startDate : "12/14/2020",
			endDate :  "01/10/2021",
            description : "Log rolling is a sport in which two contestants stand on a floating log and try to knock each other off by spinning it with their feet. This is a competitive program with limited capacity."
           },
           {
            name : "Yoga",
            capacity : 20,
            location : "Upper Gym",
            fee : 65,
            startTime : "6:00pm",
			endTime : "7:00pm",
            day : ["Fri"],
			startDate : "12/01/2020",
			endDate :  "12/24/2020",
            description : "Learn the benefits of yoga. Participants must be 21 or order to join."
           },
           {
            name : "Personal Training Session 1",
            capacity : 1,
            location : "Lower Gym",
            fee : 50,
            startTime : "9:00am",
			endTime: "10:00am",
            day : ["Tues"],
			startDate : "01/15/2021",
			endDate: "02/01/2021",
            description : "1-1 Training sessions with an instructor."
           },
           {
            name : "Personal Training Session 2",
            capacity : 1,
            location : "Lower Gym",
            fee : 50,
            startTime : "9:00am",
			endTime : "10:00am",
            day : ["Tues, Thurs"],
			startDate : "01/15/2021",
			endDate: "02/01/2021",
            description : "1-1 Training sessions with an instructor."
           },
           {
            name : "Personal Training Session 3",
            capacity : 1,
            location : "Lower Gym",
            fee : 50,
            startTime : "3:00pm",
			endTime:  "4:00pm",
            day : ["Tues"],
			startDate : "01/15/2021",
			endDate:  "02/01/2021",
            description : "1-1 Training sessions with an instructor."
           }
    ];

    await Program.insertMany(programs);
}

async function mockUserPrograms(){
    Program.find({name: "Shark", startTime: "6:00pm"}, (err, programs) =>{
        User.find({username: "doe.jane"}, (err, users) => {
            users.forEach(user =>{
                user.programs.push(programs[0]._id);
                user.save();
            })
        });
    })

	Program.find({name: "Shark", startTime: "6:00pm"}, (err, programs) =>{
        User.find({username: "anderson.luke"}, (err, users) => {
            users.forEach(user =>{
                user.programs.push(programs[0]._id);
                user.save();
            })
        });
    })

	Program.find({name: "Log Rolling", startTime: "5:00pm"}, (err, programs) =>{
        User.find({username: "anderson.luke"}, (err, users) => {
            users.forEach(user =>{
                user.programs.push(programs[0]._id);
                user.save();
            })
        });
    })


	Program.find({name: "Log Rolling", startTime: "6:00pm"}, (err, programs) =>{
        User.find({username: "anderson.aini"}, (err, users) => {
            users.forEach(user =>{
                user.programs.push(programs[0]._id);
                user.save();
            })
        });
    })



}

async function mockData(){
    await mongoose.connection.dropDatabase();

    await mockProgram();
    await mockUser();
    await mockUserPrograms();
}

module.exports = mockData;
