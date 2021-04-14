import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { DataService } from '../data.service';
import { User } from '../user';

@Component({
  selector: 'app-user-manage',
  templateUrl: './user-manage.component.html',
  styleUrls: ['./user-manage.component.css']
})
export class UserManageComponent implements OnInit {
  searchForm: FormGroup;
  userForm: FormGroup;
  users: User[];
  isModding: boolean;
  userId: any;
  user: User;

  constructor(
    private router : Router,
    private api : ApiService,
    private data : DataService) { }

  ngOnInit(): void {
    
    this.searchForm = new FormGroup({
      searchFirst: new FormControl(''),
      searchLast: new FormControl('')
    });

    this.userForm = new FormGroup({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      username: new FormControl(''),
      password: new FormControl(''),
      isStaff: new FormControl(''),
      isMember: new FormControl('')
    });

    this.isModding = false;
    this.user = null;

    this.updateView();
  }

  attemptRegister(){
    const username = this.userForm.get('username').value;
    const firstName = this.userForm.get('firstName').value;
    const lastName = this.userForm.get('lastName').value;
    const password = this.userForm.get('password').value;
    const isStaff:Boolean = this.userForm.get('isStaff').value;
    const isMember:Boolean = this.userForm.get('isMember').value;

    if(username && firstName && lastName){
      let credentials = {
        username : username, 
        firstName : firstName,
        lastName : lastName,
        isStaff : isStaff,
        password : password,
        isMember : isMember
      };

      if (this.isModding) {
        this.api.modifyUser(this.userId, credentials).subscribe(
          user => {
            alert("User Updated");
          },
          err =>{
            alert("Error updating user");
            }
          );
      } else {
      this.api.register(credentials).subscribe(
        user => {
          alert("User Created");
        },
        err =>{
          alert("Username already taken");
          }
        );
      }
    }
    else{
      alert("Please enter all fields");
    }

    this.updateView();
  }

  removeUser(id: string) : void {
    this.api.deleteUser(id).subscribe();
    this.updateView();
  }

 
  /* updateView
  /  Updates users from the database
  */
  updateView(): void{
    this.api.getUsers().subscribe(users =>{
      this.users = users;
    });
  }

  /* searchByName
  / Search users by name
  */
  searchByName() : void {
    const searchFirst = this.searchForm.get("searchFirst").value?.toString().toLowerCase();
    const searchLast = this.searchForm.get("searchLast").value?.toString().toLowerCase();

    let result = this.users;

    if (searchFirst) {
      result = result.filter(user => user.firstName.toLowerCase().includes(searchFirst));
    }

    if (searchLast) {
      result = result.filter(user => user.lastName.toLowerCase().includes(searchLast));
     
    }

    this.users = result;
  }

  /* clearFilter
  / clears the search filter
  */
  clearFilter() : void {
    this.resetForm(this.searchForm);
    this.updateView();
  }

  /* openRemoveModal
  /  Passes the data to the modal for removing a user
  */
  openRemoveModal(data: User): void {
    this.userId = data['_id'];
    this.user = data;
    this.userId = data['_id'];
  }

  makeUserActive(data: User): void {
    this.user = data;
    this.userId = data['_id'];

    this.api.makeUserActive(this.userId).subscribe();
    this.updateView();
  }

  /* openCreateModal
  /  Passes the data to the modal for creating a user
  */
  openCreateModal(): void {
    this.isModding = false;
  }

  /* openModifyModal
  /  Passes the data to the modal for modifing a user as well as patching values to the form
  */
  openModifyModal(data : User): void {
    this.user = data;
    this.userId = data['_id'];
    this.isModding = true;

    this.userForm.patchValue({
      username : data.username,
      firstName : data.firstName,
      lastName : data.lastName,
      isStaff : data.staff,
      isMember : data.member
    });
  }

  openViewModal(data : User): void {
    this.user = data;
  }

  /* resetForm
  /  Resets a form given a form name
  */
  resetForm(formName: FormGroup): void {
    formName.reset();
  }
}
