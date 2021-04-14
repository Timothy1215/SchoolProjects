import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { DataService } from '../data.service';
import { User } from '../user';
import { Program } from '../program';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {
  user: User;
  programs : Program[];
  searchForm: FormGroup;
  
  @Input() isStaffView: boolean = false;
  @Input() userView: User;

  constructor( 
    private router : Router,
    private api : ApiService,
    private data : DataService) { }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      searchInput: new FormControl('')
    });

    if (!this.isStaffView) {
      this.user = JSON.parse(localStorage.getItem('user-login'));
    } else {
      this.user = this.userView;
    }

    if (this.user) {
      this.api.getUserPrograms(this.user['_id']).subscribe(programs =>{
        this.programs = programs;
      });
    }
  }

  ngOnChanges() : void {
    if (!this.isStaffView) {
      this.user = JSON.parse(localStorage.getItem('user-login'));
    } else {
      this.user = this.userView;
    }

    if (this.user) {
      this.api.getUserPrograms(this.user['_id']).subscribe(programs =>{
        this.programs = programs;
      });
    }
  }

  /* searchByName
  / Search programs by name
  */
 searchByName() : void {
  const searchString = this.searchForm.get("searchInput").value?.toString().toLowerCase();
  if (searchString) {
    const result = this.programs.filter(program => program.name.toLowerCase().includes(searchString));
    this.programs = result;
  }
}

  /* clearFilter
  / clears the search filter
  */
  clearFilter() : void {
    this.searchForm.reset();

    this.api.getUserPrograms(this.user['_id']).subscribe(programs =>{
      this.programs = programs;
    });
  }

  cancel(program: Program) : void {
    this.api.cancelProgram(this.user['_id'], program['_id']).subscribe(
      user => {
        alert(program.name + ' successfully canceled');
        this.updateView();
      },
      err =>{
        alert("Error in canceling program");
      }
    )
  }

  /* updateView
  /  Updates users from the database
  */
  updateView(): void{
    this.api.getUserPrograms(this.user['_id']).subscribe(programs =>{
      this.programs = programs;
    });
  }
}
