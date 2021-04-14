import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Location } from '../location';
import { DataService } from '../data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  locations : Location[];
  location : Location;
  tempLocation : Location;
  lat : String = '';
  lon : String = '';

  constructor( 
    private router : Router,
    private api : ApiService,
    private data : DataService) { }

  ngOnInit(): void {
    this.data.currentUser.subscribe(user =>{
      this.api.retrieveLocations(user['id']).subscribe(locations =>{
        this.locations = locations;
        
        if(locations){
          this.location = locations[0];
        }
      });
    });
  }

  findLocation(){
    this.api.searchLocation({lat : this.lat, lon : this.lon}).subscribe(location =>{
      if(location.name){
        this.tempLocation = location;
      }
      else{
        this.tempLocation = undefined;
      }
    });
  }

  addLocation(){
    this.tempLocation = undefined;
    this.data.currentUser.subscribe(user =>{
      this.api.createLocation(user["id"], {lat : this.lat, lon : this.lon}).subscribe(newLocation =>{
        this.locations.push(newLocation);
      });
    });
  }

  remove(){
    this.router.navigate(['/weather/delete']);
  }

}
