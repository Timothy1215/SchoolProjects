var express = require('express');
var router = express.Router();
var fs = require("fs");
var bcrypt = require('bcrypt');

let Font = require('../models/font');
let Level = require('../models/level');
let Game = require('../models/game');
let User = require('../models/user');

var getWord = function(min, max){
  text = fs.readFileSync('./public/assets/wordlist.txt', 'utf8');
  var textByLine = text.split("\r\n");
  let words = textByLine.filter(word => {return word.length >= min && word.length <= max});
  return words[Math.floor(Math.random()*words.length)];
}

var setView = function(len){
  let result = '';
  for(let i = 0; i < len; i++){
    result += '_';
  }
  return result;
};

/*
##########################################################################
*/

// Logout
router.post('/api/v2/logout', (req, res, next) => {
  req.session.destroy((err) =>{
    res.json("success");
  });
});

// Login
router.post('/api/v2/login', function(req, res, next) {
  req.session.regenerate((err) => {
      if(err){
        res.status(402).json();
      }
      else{
          let username = req.body.username || '';
          let password = req.body.password || '';

          User.findOne({email : username}, (err, user) => {
              if(err || !user) {
                res.status(402).json();
              }
              else{
                bcrypt.compare(password, user.password, (err2, isValid) => {
                  if(err2 || !isValid){
                    res.status(402).json();
                  }
                  else{
                    req.session.user = user;

                    let userNoPassword = {
                        email : user.email,
                        _id : user._id,
                        defaults : user.defaults
                    };
  
                    res.json(userNoPassword);
                  }
                });
              }
          });
      }
  });
});

// Gets the metadata
router.get('/api/v2/meta', function(req, res, next){
  Font.find({}, (err1, fonts) => {
    Level.find({}, (err2, levels) => {
      if(err1 || err2){
        res.status(500).send("Error in meta");
      }
      else{
        let result = {
          fonts, 
          levels, 
          defaults:{
            font:{category:'Serif', family:'Merriweather', rule:"font-family: 'Merriweather', ;", url:'https://fonts.googleapis.com/css?family=Merriweather&display=swap'},
            level:{ name : "medium", minLength : 4, maxLength : 10, rounds : 7 },
            colors:{guessBackground:'#ffffff', textBackground:'#000000', wordBackground:'#888888'}
          }
        };
        res.json(result);
      }
    });
  });
});

// Gets the fonts
router.get('/api/v2/meta/fonts', function(req, res, next){
  Font.find({}, (err, fonts) => {
    if(err){
      res.status(500).send("Error");
    }
    else{
      res.json(fonts)
    }
  })
});

// Gets the list of games for this user
router.get('/api/v2/:userid', function(req, res, next){
  let userid = req.params.userid;
  if(req.session.user._id != userid){
    res.status(403).send("Unauthenticated user");
  }
  else{
    Game.find({userId : userid}, (err, games) => {
      if(err){
        res.status(500).send("Error");
      }
      else{
        res.json(games)
      }
    });
  }
});

// Creates a new game for the associated user
router.post('/api/v2/:userid', function(req, res, next){
  let userid = req.params.userid;
  if(req.session.user._id != userid){
    res.status(403).send("Unauthenticated user");
  }
  else{
    Level.findOne({name : req.query.level}, (err1, lvl) =>{
      Font.findOne({family : req.headers['x-font']}, (err2, usedFont) => {
        if(err1 || err2){
          res.status(500).send("Error in creating game");
        }
        else{
          var date = new Date();
          var word = getWord(lvl.minLength, lvl.maxLength);
  
          let result = {
                id : '',
                userId: userid,
                colors: {guessBackground: req.body.guessBackground, textBackground: req.body.textBackground, wordBackground: req.body.wordBackground},
                font: usedFont,
                guesses: '',
                level: lvl,
                remaining: lvl.rounds,
                status: 'unfinished',
                target: word,
                timestamp: date.getTime(),
                timeToComplete: 0,
                view: setView(word.length)
          };
          let game = new Game(result);
          result.id = game._id.toString();
          game.id = game._id.toString();
          game.save();
          res.json(result);
        }
      });
    });
  }
});

// Gets the game associated with the user and game id
router.get('/api/v2/:userid/:gid', function(req, res, next){
  let userid = req.params.userid;
  if(req.session.user._id != userid){
    res.status(403).send("Unauthenticated user");
  }
  else{
    Game.findById(req.params.gid, (err, game) => {
      if(err){
        res.status(500).send("Error in finding game");
      }
      else{
        res.json(game);
      }
    });
  }
});

// Creates a guess and returns an updated game object
router.post('/api/v2/:userid/:gid/guesses', function(req, res, next){
  let userid = req.params.userid;
  if(req.session.user._id != userid){
    res.status(403).send("Unauthenticated user");
  }
  else{
    let guess = req.query.guess;

    Game.findById(req.params.gid, (err1, game) => {
      if(err1){
        res.status(500).send("Error in guessing with finding game");
      }
      else{
        let word = game.target;
        let newView = game.view;
        let newGuesses = game.guesses;
        let newRemaining = game.remaining;
        let newStatus = game.status;
  
        if(word.includes(guess)){
          for(let i = 0; i < word.length; i++){
              if(word.charAt(i) == guess){
                  newView = newView.substr(0, i) + guess + newView.substr(i + guess.length)
              }
          }
        }
        else{
          if(!newGuesses.includes(guess)){
            newGuesses += guess;
            newRemaining--;
          }
        }
  
        if(newView == game.target || newRemaining == 0){
          if(newView == game.target){
            newStatus = 'victory';
          }
          else{
            newStatus = 'loss';
          }
        }
  
        Game.findByIdAndUpdate(req.params.gid, 
          {view : newView, guesses : newGuesses, remaining : newRemaining, status : newStatus},
          {new : true}, 
          (err2, newGame) => {
            if(err2){
              res.status(500).send("Error in guessing with updating");
            }
            else{
              res.json(newGame);
            }
        });
      }
    });
  }
});

router.put('/api/v2/:userid/defaults', function(req, res, next){
  let userid = req.params.userid;
  if(req.session.user._id != userid){
    res.status(403).send("Unauthenticated user");
  }
  else{
    User.findByIdAndUpdate(userid, 
      {defaults : req.body}, 
      (err, user) => {
        if(err){
          res.status(500).send("invalid defaults");
        }
        else{
          res.json(req.body);
        }
    });
  }
});

require('./mock')();

module.exports = router;
