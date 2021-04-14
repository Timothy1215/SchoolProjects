import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { DataService } from '../data.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  username : String = '';
  password : String = '';
  fname : String = '';
  lname : String = '';
  
  constructor(
    private router : Router, 
    private api : ApiService,
    private data : DataService
  ) {}

  ngOnInit(): void {
      
  }

  attemptRegister(){
    if(this.username && this.password && this.fname && this.lname){
      let credentials = {
        username : this.username, 
        password : this.password,
        firstName : this.fname,
        lastName : this.lname
      };
      this.api.register(credentials).subscribe(
        user => {
          this.data.changeUser(user)
          this.router.navigate(['/home']);

        },
        err =>{
          alert("Username already taken");
        }
      );
    }
    else{
      alert("Please enter all fields");
    }
  }
}
