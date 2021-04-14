import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  change(event){
    var target = event.currentTarget.attributes.class.nodeValue;
    let location = target.split(' ')[1];
    if(location == "mid"){
      return;
    }
    let side = document.getElementsByClassName(location)[0];
    let middle = document.getElementsByClassName('mid')[0];
    side.classList.remove(location);
    side.classList.add("mid");
    middle.classList.remove("mid");
    middle.classList.add(location);
  }

}
