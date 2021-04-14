import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { ApiService } from '../api.service';
import { User } from '../user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  fileToUpload: File = null;
  url = '';
  avatarImage: any = "https://www.w3schools.com/w3images/avatar3.png";
  user : User;

  constructor(    
    private api : ApiService,
    private data : DataService) { }

  ngOnInit(): void {
    this.data.currentUser.subscribe(user =>{
      this.user = <User>user;
    })
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  updateImage(){
    var reader = new FileReader();
    reader.readAsDataURL(this.fileToUpload);
    reader.onload = (event : any) => {
      this.url = event.target.result;
    }
  }

}
