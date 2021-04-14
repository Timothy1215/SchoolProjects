import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router : Router) { }

  ngOnInit(): void {
  }

  game(){
    this.router.navigate(['/nfl/game']);
  }

  player(){
    this.router.navigate(['/nfl/player']);
  }

  teams(){
    this.router.navigate(['/nfl/team']);
  }

}
