import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { DataService } from '../data.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email : String = '';
  password : String = '';

  constructor(
    private api : ApiService, 
    private router : Router,
    private data : DataService) { }

  ngOnInit(): void {
  }

  attemptLogin(){
    if(this.email && this.password){
      let credentials = {username : this.email, password : this.password};
      this.api.login(credentials).subscribe(
        user => {
          this.data.changeUser(user)
          this.router.navigate(['/wordgame/api/v2/home']);

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

  createArray(num){
    return new Array(num);
  }

}
