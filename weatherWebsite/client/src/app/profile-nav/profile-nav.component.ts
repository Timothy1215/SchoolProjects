import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-profile-nav',
  templateUrl: './profile-nav.component.html',
  styleUrls: ['./profile-nav.component.css']
})
export class ProfileNavComponent implements OnInit {

  constructor(private router : Router, private data : DataService) { }

  ngOnInit(): void {
  }

  logout(){
    this.data.changeUser(Object);
    this.router.navigate(['/login']);
  }

}
