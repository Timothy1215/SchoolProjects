let mongoose = require('mongoose');
let bcrypt = require('bcrypt');

let Font = require('../models/font');
let Level = require('../models/level');
let User = require('../models/user');
let Game = require('../models/game');


async function mockFont(){
    let fonts = [{category:'Display', family:'ZCOOL KuaiLe', rule:"font-family: 'ZCOOL KuaiLe';", url:'https://fonts.googleapis.com/css?family=ZCOOL+KuaiLe&display=swap'},
    {category:'Display', family:'Bungee Shade', rule:"font-family: 'Bungee Shade';", url:'https://fonts.googleapis.com/css?family=Bungee+Shade&display=swap'},
    {category:'Handwriting', family:'Kaushan Script', rule:"font-family: 'Kaushan Script';", url:'https://fonts.googleapis.com/css?family=Kaushan+Script&display=swap'},
    {category:'Sans Serif', family:'Lacquer', rule:"font-family: 'Lacquer';", url:'https://fonts.googleapis.com/css?family=Lacquer&display=swap'},
    {category:'Serif', family:'Merriweather', rule:"font-family: 'Merriweather';", url:'https://fonts.googleapis.com/css?family=Merriweather&display=swap'},
    {category:'Display', family:'Odibee Sans', rule:"font-family: 'Odibee Sans';", url:'https://fonts.googleapis.com/css?family=Odibee+Sans&display=swap'},
    {category:'Monospace', family:'VT323', rule:"font-family: 'VT323';", url:'https://fonts.googleapis.com/css?family=VT323&display=swap'},
    {category:'Handwriting', family:'Ruthie', rule:"font-family: 'Ruthie';", url:'https://fonts.googleapis.com/css?family=Ruthie&display=swap'},
    {category:'Display', family:'Ribeye Marrow', rule:"font-family: 'Ribeye Marrow';", url:'https://fonts.googleapis.com/css?family=Ribeye+Marrow&display=swap'},
    {category:'Handwriting', family:'Pacifico', rule:"font-family: 'Pacifico';", url:'https://fonts.googleapis.com/css?family=Pacifico&display=swap'}];

    await Font.insertMany(fonts);
}

async function mockLevel(){
    let levels = [{ name : "easy", minLength : 3, maxLength : 5, rounds : 8 },
    { name : "medium", minLength : 4, maxLength : 10, rounds : 7 },
    { name : "hard", minLength : 9, maxLength : 300, rounds : 6 }   
    ];

    await Level.insertMany(levels);
}

async function mockUser(){
    let starting = {
        font:{category:'Serif', family:'Merriweather', rule:"font-family: 'Merriweather', ;", url:'https://fonts.googleapis.com/css?family=Merriweather&display=swap'},
        level:{ name : "medium", minLength : 4, maxLength : 10, rounds : 7 },
        colors:{guessBackground:'#ffffff', textBackground:'#000000', wordBackground:'#888888'}
    };
    
    let users = [
        {email : "bilbo@mordor.org", password : bcrypt.hashSync("123123123", 10), defaults : starting},
        {email : "frodo@mordor.org", password : bcrypt.hashSync("234234234", 10), defaults : starting},
        {email : "samwise@mordor.org", password : bcrypt.hashSync("345345345", 10), defaults : starting}
    ];

    await User.insertMany(users);
}

async function mockGame(){
    User.find({}, (err, users) => {
        users.forEach( user => {
            let game = new Game({
                id : '',
                userId : user._id,
                colors : user.defaults.colors,
                font : user.defaults.font,
                guesses : 'blah',
                level : user.defaults.level,
                remaining : 8,
                status : 'unfinished',
                target : 'word',
                timestamp : 18,
                timeToComplete : 3,
                view : '___'
            });
            game.id = game._id.toString();
            game.save();
        })
    });
}

async function mockData(){
    await mongoose.connection.dropDatabase();

    await mockFont();
    await mockLevel();
    await mockUser();
    await mockGame();
}

module.exports = mockData;