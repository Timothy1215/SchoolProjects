import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username : String = '';
  password : String = '';

  constructor(
    private router : Router, 
    private api : ApiService,
    private data : DataService) { }

  ngOnInit(): void {
  }

  attemptLogin(){
    if(this.username && this.password){
      let credentials = {username : this.username, password : this.password};
      this.api.login(credentials).subscribe(
        user => {
          this.data.changeUser(user)
          this.router.navigate(['/weather/home']);

        },
        err =>{
          alert("User not found");
        }
      );
    }
    else{
      alert("Please enter email and password");
    }
  }

}
