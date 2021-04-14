import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../data.service';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  fonts : Object[];
  levels : Object[];
  level : String = 'medium';
  font : String = "Merriweather";
  word : String = "#888888";
  guess : String = "#ffffff";
  fore : String = "#000000";
  
  constructor(
    private api : ApiService, 
    private data : DataService, 
    private router : Router) { }

  ngOnInit(): void {

    this.api.getMeta().subscribe(meta => {
      this.levels = meta['levels'];
      this.fonts = meta['fonts'];

      this.fonts.forEach(font => {
        let head = document.querySelector('head');
        let fontLink = document.createElement('link');
        fontLink.setAttribute('href', font['url']);
        fontLink.setAttribute('rel', 'stylesheet');
        head.appendChild(fontLink);
      });

    });
  }

  play(){
    this.data.currentUser.subscribe(user =>{
      let body = {guessBackground: this.guess, textBackground: this.fore, wordBackground: this.word};
      this.api.createGame(user['_id'], body, {'X-font': this.font}, {'level': this.level}).subscribe(game =>{
        this.data.changeGame(game);
        this.router.navigate(['/wordgame/api/v2/play']);
      });
    });
    
  }



}
