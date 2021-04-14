import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  win1 : '';
  win2 : '';
  comp1 : '';
  comp2 : '';

  constructor(private api : ApiService) { }

  ngOnInit(): void {
  }

  calculate(){
    this.api.compareTeams({team1 : this.win1, team2 : this.win2}).subscribe(team =>{
      console.log(team);
    });
  }

  compete(){
    this.api.getWinningTeam({team1 : this.comp1, team2 : this.comp2}).subscribe(team =>{
      alert(team + " win!")
    });
  }

}
