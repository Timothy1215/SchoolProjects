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
    private data : DataService
    ) { }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user-login'));

    // go home if logged in
    if (user){
      this.router.navigate(['/home']);
    }
  }

  attemptLogin(){
    if(this.username && this.password){
      let credentials = {username : this.username, password : this.password};
      this.api.login(credentials).subscribe(
        user => {
          this.data.changeUser(user)
          if(user.programs.length == 0){
            this.router.navigate(['/home']);
          }
          else{
            this.router.navigate(['/myprograms']);
          }
        },
        err =>{
          alert("Invalid username or password");
        }
      );
    }
    else{
      alert("Please enter email and password");
    }
  }

}
