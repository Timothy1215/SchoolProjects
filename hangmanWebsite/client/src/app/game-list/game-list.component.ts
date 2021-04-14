import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { ApiService } from '../api.service';
import { Game } from '../game';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css']
})
export class GameListComponent implements OnInit {
  games : Game[];


  constructor(
    private api : ApiService, 
    private data : DataService,
    private router : Router) { }

  ngOnInit(): void {
    this.data.currentUser.subscribe(user => {
      this.api.getGames(user['_id']).subscribe(games => {
        this.games = games;
      });
    });
  }

  createArray(word){
    return new Array(word.length);
  }

  resume(gameId){
    this.data.currentUser.subscribe(user => {
      this.api.getGame(user['_id'], gameId).subscribe( newGame =>{
        this.data.changeGame(newGame);
        this.router.navigate(['/wordgame/api/v2/play']);
      });
    });
  }

}
