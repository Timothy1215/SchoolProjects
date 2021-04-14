import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private userSource = new BehaviorSubject<Object>({});
  currentUser = this.userSource.asObservable();

  constructor() { }

  changeUser(user : Object){
    this.userSource.next(user);
    localStorage.setItem('user-login', JSON.stringify(user));
  }

}
