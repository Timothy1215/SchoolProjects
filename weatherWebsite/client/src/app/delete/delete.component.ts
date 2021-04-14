import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { DataService } from '../data.service';
import { Location } from '../location';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent implements OnInit {
  locations : Location[];
  //location : Location;

  constructor(
    private api : ApiService,
    private data : DataService) { }

  ngOnInit(): void {
    this.data.currentUser.subscribe(user =>{
      this.api.retrieveLocations(user['id']).subscribe(locations =>{
        this.locations = locations;
      });
    });
  }

  removeLocation(id){
    this.api.deleteLocation(id).subscribe(oldLocation =>{
      if(oldLocation){
        alert(oldLocation.name + ' deleted!');
      }
      else{
        alert('Delete unsuccessful!');
      }
    });
  }

}
