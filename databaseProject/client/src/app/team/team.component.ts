import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {
  sTN : String = '';
  sS : String = '';
  sD : String = '';
  sC : String = '';
  playbookTeam : '';
  dataInput : String = '';
  dataName : String = '';
  amount : String = '';
  range : String = '';
  symbol : String = '=';
  countSym : String = '=';
  GT : String = '>';
  LT : String = '<';
  EQ : String = '=';
  GTE : String = '>=';
  LTE : String = '<=';
  ints : String = 'interceptions';
  tds : String = 'touchdowns';
  sacks : String = 'sacks';
  rank : String = 'playerrank';
  rec : String = 'receivingyards';
  points : String = 'points';
  teamRank : String = 'teamrank';
  wins : String = 'wins';
  losses : String = 'losses';
  teamData : Object[];
  teamPlayers : Object[];
  teams : Object[];
  plays : Object[];

  stat : String = 'interceptions';
  displayStat : String = 'interceptions';
  statSym : String = '>';
  teamsStat : Object[];

  avgSym : String = '>';
  avgStat : String = 'teamrank';
  divCon : String = 'division';
  division : String = 'division';
  conference : String = 'conference';
  divSel : String = 'north';
  east : String = 'east';
  west : String = 'west';
  north : String = 'north';
  south : String = 'south';
  conSel : String = 'nfc';
  nfc : String = 'nfc';
  afc : String = 'afc';
  divConDis : String = '';
  divConStats : Object[];

  constructor(private api : ApiService) { }

  ngOnInit(): void {
  }

  findTeam(){
    let query = {tn : this.sTN, s : this.sS, d : this.sD, c : this.sC}
    this.api.getTeams(query).subscribe(teams =>{
      this.teams = teams;
    });
  }

  findPlaybook(){
    this.api.getPlaybook({tn : this.playbookTeam}).subscribe(plays =>{
      this.plays = plays;
    });
  }

  searchData(){
    let query = {};
    if(this.dataInput.toLowerCase() == 'teamrank'){
      query ={tn : this.dataName, tr : this.amount, trS : this.symbol};
    }
    if(this.dataInput.toLowerCase() == 'wins'){
      query ={tn : this.dataName, w : this.amount, wS : this.symbol};
    }
    if(this.dataInput.toLowerCase() == 'losses'){
      query ={tn : this.dataName, l : this.amount, lS : this.symbol};
    }
    if(this.dataInput.toLowerCase() == 'points'){
      query ={tn : this.dataName, p : this.amount, pS : this.symbol};
    }
    query["tn"] = this.dataName;
    console.log(this.dataName);
    this.api.getTeamData(query).subscribe(teamData =>{
      this.teamData = teamData;
    });
  }

  getPlayerCount(){
    if(!this.range){
      this.teamPlayers = undefined;
    } 
    else {
      this.api.getCount({x : this.range, symbol : this.countSym}).subscribe(teamPlayers =>{
        this.teamPlayers = teamPlayers;
      });
    }
  }

  getStatAvg(){
    this.api.getTeamAvg({stat : this.stat, symbol : this.statSym}).subscribe(teamsStat =>{
      this.teamsStat = teamsStat;
      this.displayStat = this.stat;
    });
  }

  getDivConAvg(){
    let query;
    if(this.divCon == 'conference'){
      query = {stat : this.avgStat, symbol : this.avgSym, conference : this.conSel, division : ''};
    }
    else{
      query = {stat : this.avgStat, symbol : this.avgSym, conference : '', division : this.divSel};
    }
    this.api.getTeamDivConAvg(query).subscribe(avg =>{
      this.divConStats = avg;
      this.divConDis = this.avgStat;
    })
  }

}
