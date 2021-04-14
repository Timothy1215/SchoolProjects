import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
  infoPos : String = '';
  infoFN : String = '';
  infoLN : String = '';
  infoAge : String = '';
  infoNum : String = '';
  infoTN : String = '';
  addPos : String = '';
  addFN : String = '';
  addLN : String = '';
  addAge : String = '';
  addNum : String = '';
  addTN : String = '';
  delFN : String = '';
  delLN : String = '';
  stat : String = '';
  amount : String = '';
  symbol : String = '=';
  rangeSym : String = '=';
  GT : String = '>';
  LT : String = '<';
  EQ : String = '=';
  GTE : String = '>=';
  LTE : String = '<=';
  playerRank : String = '';
  range : String = '';
  players : Object[];
  playerStats : Object[];
  ranks : Object[];

  constructor(private api : ApiService) { }

  ngOnInit(): void {
  }

  searchPlayer(){
    let query = {fn : this.infoFN, 
      ln : this.infoLN, pos : this.infoPos, 
      age : this.infoAge, tn : this.infoTN, pn : this.infoNum};
    this.api.getPlayers(query).subscribe(players =>{
        this.players = players;
    });

  }

  addPlayer(){
    let body = {fn : this.addFN, 
      ln : this.addLN, pos : this.addPos, 
      age : this.addAge, tn : this.addTN, pn : this.addNum};
    this.api.createPlayer(body).subscribe(newPlayer =>{
      if(Object.keys(newPlayer).length > 0){
        alert("Player added");
      }
      else{
        alert("Error: add unsuccessful");
      }
    });
  }

  deletePlayer(){
    this.api.removePlayer({fn : this.delFN, ln : this.delLN}).subscribe(player =>{
      if(player['affectedRows'] > 0){
        alert("Player deleted");
      }
      else{
        alert("Error: delete unsuccessful");
      }
    });
  }

  searchStats(){
    let query;
    if(this.stat.toLowerCase() == 'interceptions'){
      query ={int : this.amount, intS : this.symbol};
    }
    if(this.stat.toLowerCase() == 'receivingyards'){
      query ={ry : this.amount, ryS : this.symbol};
    }
    if(this.stat.toLowerCase() == 'sacks'){
      query ={s : this.amount, sS : this.symbol};
    }
    if(this.stat.toLowerCase() == 'touchdowns'){
      query ={td : this.amount, tdS : this.symbol};
    }
    if(this.stat.toLowerCase() == 'playerrank'){
      query ={pr : this.amount, prS : this.symbol};
    }
    this.api.getStats(query).subscribe(stats =>{
      this.playerStats = stats;
    });
  }

  searchRange(){
    let query = {fpr : this.playerRank, spr : this.range, symbol : '<='};
    this.api.getRange(query).subscribe(ranks => {
      this.ranks = ranks;
    })
  }

}
