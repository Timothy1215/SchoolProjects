var express = require('express');
var router = express.Router();

// Get the mysql service
var mysql = require('mysql');

// ***Add the credentials to access your database***


// connect to mysql
connection.connect(function(err) {
  console.log("I have connected to the database.")
  // in case of error
  if(err){
      console.log(err.code);
      console.log(err.fatal);
  }
});


// Get player(s)
router.get('/api/player', function(req, res, next) {

  let teamName = req.query.tn;
  let firstName = req.query.fn;
  let lastName = req.query.ln;
  let position = req.query.pos;
  let playerNum = req.query.pn;
  let age = req.query.age;

  let variables = [];
  if (teamName != '') {variables.push("TeamName"); variables.push(teamName);}
  if (firstName != '') {variables.push("FirstName"); variables.push(firstName);}
  if (lastName != '') {variables.push("LastName"); variables.push(lastName);}
  if (position != '') {variables.push("Position"); variables.push(position);}
  if (playerNum != '') {variables.push("PlayerNum"); variables.push(playerNum);}
  if (age != '') {variables.push("Age"); variables.push(age);}

  let query = 'SELECT TeamName, FirstName, LastName, Position, PlayerNum, Age FROM Player WHERE';
  

  for (let i = 0; i < variables.length; i+=2) {
    query += " " + variables[i] + " = '" + variables[i+1] + "'"
    if (i != variables.length-2) {
       query += " AND"
    }
  }
  connection.query(query, function(err, rows, fields) {
    if(err){
        console.log("An error ocurred performing the query.");
    }
    res.json(rows);
  });

});

// create a new player
router.post('/api/player', function(req, res, next) {
  let query = "INSERT INTO Player (TeamName, FirstName, LastName, Position, PlayerNum, Age) VALUES (" + "'"
    + req.body.tn + "', '" + req.body.fn + "', '" + req.body.ln + "', '" + req.body.pos + "', " +req.body.pn + ", " + req.body.age + ")";

    console.log(query);
  connection.query(query, function(err, results) {
    if(err){
      console.log("An error ocurred performing the query.");
      res.json({});
    }
    else{
      res.json(results);
    }
  });
  

});

// delete player(s)
router.delete('/api/player', function(req, res, next) {

  let firstName = req.query.fn;
  let lastName = req.query.ln;

  let variables = [];
  if (!firstName == "") {variables.push("FirstName"); variables.push(firstName);}
  if (!lastName == "") {variables.push("LastName"); variables.push(lastName);}

  let query = 'DELETE FROM Player WHERE';

  for (let i = 0; i < variables.length; i+=2) {
    query += " " + variables[i] + " = '" + variables[i+1] + "'"
    if (i != variables.length-2) {
       query += " AND"
    }
  }

  connection.query(query, function(err, results) {
    if(err){
        console.log("An error ocurred performing the query.");
        res.json({});
    }
    else{
      res.json(results);
    }
    
  });

});

// Get player(s) stats
router.get('/api/player/stats', function(req, res, next) {
  let PlayerRank = req.query.pr;
  let TouchDowns = req.query.td;
  let Sacks = req.query.s;
  let Interceptions = req.query.int;
  let ReceivingYards = req.query.ry;

  let variables = [];
  if (!PlayerRank == "") {variables.push("PlayerRank"); variables.push(req.query.prS); variables.push(PlayerRank);}
  if (!TouchDowns == "") {variables.push("TouchDowns"); variables.push(req.query.tdS); variables.push(TouchDowns);}
  if (!Sacks == "") {variables.push("Sacks"); variables.push(req.query.sS); variables.push(Sacks);}
  if (!Interceptions == "") {variables.push("Interceptions"); variables.push(req.query.intS); variables.push(Interceptions);}
  if (!ReceivingYards == "") {variables.push("ReceivingYards"); variables.push(req.query.ryS); variables.push(ReceivingYards);}

  let query = 'SELECT TeamName, FirstName, LastName, PlayerRank, TouchDowns, Sacks, Interceptions, ReceivingYards FROM PlayerData NATURAL JOIN Player WHERE';

  for (let i = 0; i < variables.length; i+=3) {
    query += " " + variables[i] + " " + variables[i+1] + " '" + variables[i+2] + "'"
    if (i != variables.length-3) {
       query += " AND"
    }
  }
  query += " ORDER BY PlayerRank ASC"

  connection.query(query, function(err, rows, fields) {
    if(err){
        console.log("An error ocurred performing the query.");
    }
    res.send(rows);
  });
});

// Two teams compete and update stats.
router.put('/api/game', function(req, res, next) {
  let rand = Math.random()
  let winningTeam = ""
  if (rand > 0.5) {
    winningTeam += req.body.team1
  } else {
    winningTeam += req.body.team2
  }
  let query = "UPDATE TeamData SET Wins = Wins+1 WHERE TeamName = '" + winningTeam + "'";
  console.log(query);

  console.log("PRIOR TO UPDATE");
  connection.query(query, function(err, results) {
    if(err){
        console.log("An error ocurred performing the query.");
        res.json(winningTeam);
    }
    else{
      res.json(winningTeam);
    }
  });

});

// Group 1 Query 1
// Get Team(s)
router.get('/api/team', function(req, res, next) {

  let teamName = req.query.tn;
  let state = req.query.s;
  let division = req.query.d;
  let conference = req.query.c;

  let variables = [];
  if (!teamName == "") {variables.push("TeamName"); variables.push(teamName);}
  if (!state == "") {variables.push("State"); variables.push(state);}
  if (!division == "") {variables.push("Division"); variables.push(division);}
  if (!conference == "") {variables.push("Conference"); variables.push(conference);}

  let query = 'SELECT * FROM Team WHERE';

  for (let i = 0; i < variables.length; i+=2) {
    if (variables[i] == "TeamName") {
      query += " " + variables[i] + " LIKE '" + variables[i+1] + "%'"
    } else {
      query += " " + variables[i] + " = '" + variables[i+1] + "'"
    }
    if (i != variables.length-2) {
       query += " AND"
    }
  }

  console.log("-------------Group 1 Query 1---------------");
  console.log(query);
  console.log("-------------------------------------------");

  connection.query(query, function(err, rows, fields) {
    if(err){
        console.log("An error ocurred performing the query.");
    }
    res.send(rows);
  });
});

// Get Team PlayBook
router.get('/api/team/playbook', function(req, res, next) {
  
  let teamName = req.query.tn;

  let query = 'SELECT TeamName, Running, Passing, Special, PassCoverage, Blitz FROM Play WHERE';
  query += " TeamName" + " = '" + teamName + "'"

  connection.query(query, function(err, rows, fields) {
    if(err){
        console.log("An error ocurred performing the query.");
    }
    res.send(rows);
  });

});

// Group 1 Query 2
// Get Team Data
router.get('/api/team/data', function(req, res, next) {

  let teamName = req.query.tn;
  let teamRank = req.query.tr;
  let trS = req.query.trS;
  let wins = req.query.w;
  let wS = req.query.wS;
  let losses = req.query.l;
  let lS = req.query.lS;
  let points = req.query.p;
  let pS = req.query.pS;

  let variables = [];
  if (!teamName == "") {variables.push("TeamName"); variables.push("="); variables.push(teamName);}
  if (!teamRank == "") {variables.push("TeamRank"); variables.push(trS); variables.push(teamRank);}
  if (!wins == "") {variables.push("Wins"); variables.push(wS); variables.push(wins);}
  if (!losses == "") {variables.push("Losses"); variables.push(lS); variables.push(losses);}
  if (!points == "") {variables.push("Points"); variables.push(pS); variables.push(points);}

  let query = 'SELECT TeamName, TeamRank, Wins, Losses, (Wins/(Wins+Losses) * 100) as WinPercent, Points FROM TeamData WHERE';

  for (let i = 0; i < variables.length; i+=3) {
    query += " " + variables[i] + " " + variables[i+1] + " '" + variables[i+2] + "'"
    if (i != variables.length-3) {
       query += " AND"
    }
  }
  query += " ORDER BY TeamRank ASC"

  console.log("-------------Group 1 Query 2---------------");
  console.log(query);
  console.log("-------------------------------------------");

  connection.query(query, function(err, rows, fields) {
    if(err){
        console.log("An error ocurred performing the query.");
    }
    res.send(rows);
  });
});

// Advanced Query: Group 2, Query 1
// Returns the top Player Ranks with optional offsets.
router.get('/api/player/ranks', function(req, res, next) {

  let fpr = req.query.fpr; // First Player Rank
  let spr = req.query.spr; // Second Player Rank
  let symbol = req.query.symbol // Symbol ( <= | >= | > | < )
  fpr = parseInt(fpr);
  spr = parseInt(spr);

  let variables = [];
  if (!fpr == "") {variables.push(fpr); } else { variables.push(1); }
  if (!spr == "") {variables.push(spr); } else { variables.push(10); }
  if (!symbol == "") { variables.push(symbol); } else { variables.push("<="); }
  
  let query = 'SELECT FirstName, LastName, PlayerRank FROM Player JOIN PlayerData ON Player.PlayerID = PlayerData.PlayerID';
  if (variables[0] - 1 == 0) {
    query += " WHERE PlayerRank " + variables[2] + " " + variables[1] + " ORDER BY PlayerRank ASC LIMIT " + (variables[1] - variables[0] + 1);
  } else {
    query += " WHERE PlayerRank " + variables[2] + " " + variables[1] + " ORDER BY PlayerRank ASC LIMIT " + (variables[0] - 1);
    query += ", " + (variables[1] - variables[0] + 1);
  }

  console.log("-------------Group 2 Query 1---------------");
  console.log(query);
  console.log("-------------------------------------------");

  connection.query(query, function(err, rows, fields) {
    if(err){
        console.log("An error ocurred performing the query.");
    }
    res.send(rows);
  });
});

// Advanced Query: Group 2, Query 2
// Returns all teams based on the symbol and count. Range 38-55
router.get('/api/team/count', function(req, res, next) {

  let x = req.query.x; // Players less than X
  x = parseInt(x);
  let symbol = req.query.symbol; // Symbol ( <= | >= | > | < )

  let variables = [];
  if (!x == "") {variables.push(x); } else { variables.push(45); }
  if (!symbol == "") { variables.push(symbol); } else { variables.push("<="); }
  
  let query = 'SELECT TeamName, count(*) as PlayerCount FROM Player GROUP BY TeamName HAVING COUNT(*) ' + variables[1] + variables[0] + " ORDER BY count(*)";

  console.log("-------------Group 2 Query 2---------------");
  console.log(query);
  console.log("-------------------------------------------");

  connection.query(query, function(err, rows, fields) {
    if(err){
        console.log("An error ocurred performing the query.");
    }
    res.send(rows);
  });
});

// Advanced Query: Group 3, Query 1
// Returns all teams with STAT count (> || < ) the average of all teams.
router.get('/api/team/statCount', function(req, res, next) {
 
  let symbol = req.query.symbol; // Represents the inputed symbol
  let stat = req.query.stat;
  
  let query = "SELECT TeamName, AVG(" + stat + ") AS AvgAmount FROM Player NATURAL JOIN PlayerData GROUP BY TeamName ";
  query += "HAVING AVG(" + stat + ") " + symbol + " (SELECT AVG(" + stat + ") FROM Player NATURAL JOIN PlayerData GROUP BY "
  query += "TeamName ORDER BY AVG(" + stat + ") ASC LIMIT 15, 1) ORDER BY AVG(" + stat + ") ASC"
 
  console.log("-------------Group 3 Query 1---------------");
  console.log(query);
  console.log("-------------------------------------------");

  connection.query(query, function(err, rows, fields) {
    if(err){
        console.log("An error occurred performing the query.");
    }
    res.send(rows);
  });
});

// Advanced Query: Group 3, Query 2
// Returns all teams with STAT count (> || < ) the average of all teams.
router.get('/api/team/teamStatCount', function(req, res, next) {
 
  let stat = req.query.stat // WIN / LOSS / TOTAL POINTS
  let symbol = req.query.symbol // STORES THE USER SELECTED SYMBOL (<= || >= || < || >)
  let divison = req.query.division // STORES THE TEAM'S DIVISION (USER SELCTABLE) (NORTH, EAST, SOUTH, WEST)
  let conference = req.query.conference; // STORES THE TEAM'S CONFERENCE (USER SELCTABLE) (AFC, NFC)
 
  let variables = [];
  if (!divison == "") { variables.push("Division"); variables.push(divison); }
  if (!conference == "") { variables.push("Conference"); variables.push(conference); }
  
  let query = "SELECT TeamName, " + stat + " AS stat FROM Team NATURAL JOIN TeamData WHERE " + variables[0] + " = '" + variables[1] + "' ";
  query += "AND " + stat + " " + symbol + " (SELECT AVG(" + stat + ") FROM Team NATURAL JOIN TeamData WHERE " + variables[0] + " = '" + variables[1] + "' ";
  query += "GROUP BY " + variables[0] + ") ORDER BY " + stat + " ASC";
  
  console.log("-------------Group 3 Query 2---------------");
  console.log(query);
  console.log("-------------------------------------------");

  connection.query(query, function(err, rows, fields) {
    if(err){
        console.log("An error ocurred performing the query.");
    }
    res.send(rows);
  });
 
});



module.exports = router;
