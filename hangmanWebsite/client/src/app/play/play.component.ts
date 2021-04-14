import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { Game } from '../game';


@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit {
  game : Game;
  guess : String;

  constructor(
    private api : ApiService, 
    private data : DataService, 
    private router : Router) { }

  ngOnInit(): void {
    this.data.currentGame.subscribe(game => {
      this.game = <Game>game;
    });
  }

  createArray(word){
    return new Array(word.length);
  }

  guessLetter(){
      this.api.makeGuess(this.game.userId, this.game.id, {guess: this.guess}).subscribe(newGame => {
        this.game = newGame;
        this.data.changeGame(newGame);
        this.router.navigate(['/wordgame/api/v2/play']);
      });
  }

  exit(){
    this.router.navigate(['/wordgame/api/v2/home']);
  }

  getBackground(){
    console.log(this.game);
    let style = {};
    if(this.game.status == 'victory'){
      style = {'background-image': 'url(/assets/winner.gif)', 'background-size': 'contain', 'background-position': 'center'};
    }
    if(this.game.status == 'loss'){
      style = {'background-image': 'url(/assets/cry.gif)', 'background-size': 'contain', 'background-position': 'center'};
    }
    return style;
  }

}
