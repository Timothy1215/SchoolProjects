import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { User } from '../user';
import { Program } from '../program';
import { FormControl, FormGroup} from '@angular/forms';
import Utils from '../utils'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: User;
  isStaff: Boolean;
  isMember: Boolean;
  isModding: Boolean;
  programs : Program[];
  programForm: FormGroup;
  programViewForm: FormGroup;
  searchForm: FormGroup;
  programId : string;
  signedUp: Program[];
  
  constructor( 
    private router : Router,
    private api : ApiService,
    private data : DataService) { }

  ngOnInit(): void {
    // get user and navigate back if not found
    this.user = JSON.parse(localStorage.getItem('user-login'));
    
    if (!this.user){
      this.router.navigate(['/']);
    }

    this.isStaff = this.user.staff; 
    this.isMember = this.user.member;
    this.isModding = false;

    // get user programs
    this.api.getUserPrograms(this.user['_id']).subscribe(programs =>{
      this.signedUp = programs;
    });

    this.updateView();

    // setup reactive forms
    this.programForm = new FormGroup({
      _id: new FormControl(''),
      programName: new FormControl(''),
      location: new FormControl(''),
      description: new FormControl(''),
      fee: new FormControl(''),
      capacity: new FormControl(''),
      monday: new FormControl(''),
      tuesday: new FormControl(''),
      wednesday: new FormControl(''),
      thursday: new FormControl(''),
      friday: new FormControl(''),
      saturday: new FormControl(''),
      sunday: new FormControl(''),
      timeStart: new FormControl(''),
      timeEnd: new FormControl(''),
      dateStart: new FormControl(''),
      dateEnd: new FormControl('')
    });

    this.programViewForm = new FormGroup({
      description: new FormControl(''),
      fee: new FormControl(''),
      capacity: new FormControl(''),
    });

    this.searchForm = new FormGroup({
      searchInput: new FormControl('')
    });
    
  }

  /* signUp
  / Makes a call to the apiService and trys to sign up a user for program 
  */
  signUp(): void{
    this.api.signUp(this.user['_id'], {programid : this.programId}).subscribe(result =>{
      if (result){
        alert("You are now signed up");
        this.updateView();
      }
      else{
        alert("Sign up failed!");
      }
    });
  }

  /* updateOrCreateProgram
  /  Creates or updates a program
  */
  updateOrCreateProgram() : void {
    let days = [];

    if (this.programForm.controls['monday'].value) days.push("Mon");
    if (this.programForm.controls['tuesday'].value) days.push("Tues");
    if (this.programForm.controls['wednesday'].value) days.push("Wed");
    if (this.programForm.controls['thursday'].value) days.push("Thurs");
    if (this.programForm.controls['friday'].value) days.push("Fri");
    if (this.programForm.controls['saturday'].value) days.push("Sat");
    if (this.programForm.controls['sunday'].value) days.push("Sun");

    let body = {
      name : this.programForm.controls['programName'].value,
      location : this.programForm.controls['location'].value,
      description : this.programForm.controls['description'].value,
      fee : this.programForm.controls['fee'].value,
      capacity : this.programForm.controls['capacity'].value,
      startTime : Utils.createTime(this.programForm.controls['timeStart'].value),
      endTime: Utils.createTime(this.programForm.controls['timeEnd'].value),
      startDate : Utils.createDate(this.programForm.controls['dateStart'].value),
      endDate : Utils.createDate(this.programForm.controls['dateEnd'].value),
      day : days,
    };

    if (this.isModding) {
      this.api.modifyProgram(this.programId, body).subscribe();
    } else{
    this.api.createProgram(body).subscribe();
  }
   this.updateView();
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
    this.resetForm(this.searchForm);
    this.updateView();
  }

  /* updateView
  /  Updates programs from the database
  */
  updateView(): void{
    this.api.getPrograms().subscribe(programs =>{
      this.programs = programs;
    });
  }

  /* isSignedUp
  /  Checks what programs a user is signed up for
  */
  isSignedUp(program: Program) : boolean {
    let ret = false;
    this.signedUp.forEach(elem => {
      if (elem["_id"] == program["_id"]) {
        ret = true;
      }
     });
    return ret;
  }

  /* openProgramModal
  /  Passes the data to the modal for signing up a user, also calculates discount
  */
  openProgamModal(data : Program): void {
    const discount = Math.ceil(<number>data.fee *  0.5);
    const fee = this.isMember ? discount: data.fee;

     this.programViewForm.patchValue({
      fee: "$" + fee + ".00",
      capacity: data.capacity,
      description: data.description,
     });

     this.programId = data['_id'];
  }

  /* openRemoveModal
  /  Passes the data to the modal for removing a program
  */
  openRemoveModal(data: Program): void {
    this.programId = data['_id'];
  }

  /* openCreateModal
  /  Passes the data to the modal for creating a program
  */
  openCreateModal(): void {
    this.isModding = false;
  }

  /* openModifyModal
  /  Passes the data to the modal for modifing a program as well as patching values to the form
  */
  openModifyModal(data : Program): void {
    this.programId = data['_id'];
    this.isModding = true;
    
    if (data.day.includes("Mon")) this.programForm.controls['monday'].patchValue(true);
    if (data.day.includes("Tues")) this.programForm.controls['tuesday'].patchValue(true);
    if (data.day.includes("Wed")) this.programForm.controls['wednesday'].patchValue(true);
    if (data.day.includes("Thur")) this.programForm.controls['thursday'].patchValue(true);
    if (data.day.includes("Fri")) this.programForm.controls['friday'].patchValue(true);
    if (data.day.includes("Sat")) this.programForm.controls['saturday'].patchValue(true);
    if (data.day.includes("Sun")) this.programForm.controls['sunday'].patchValue(true);
    
    this.programForm.patchValue({
      programName: data.name,
      location: data.location,
      description: data.description,
      fee: data.fee,
      capacity: data.capacity,
      timeStart: Utils.createFormTime(data.startTime?.toString()),
      timeEnd: Utils.createFormTime(data.endTime?.toString()),
      dateStart: Utils.createFormDate(data.startDate?.toString()),
      dateEnd: Utils.createFormDate(data.endDate?.toString()),
    });
 }

  /* resetForm
  /  Resets a form given a form name
  */
  resetForm(formName: FormGroup): void {
    formName.reset();
  }

  /* removeProgram
  /  Removes a program from the database. Calls the api service
  */
  removeProgram(id: string) : void{
    this.api.deleteProgram(id).subscribe(result =>{
      if(result['deletedCount'] > 0){
        alert("Delete successful!");
        this.updateView();
      }
      else{
        alert("Delete failed!");
      }
    })
  }
}