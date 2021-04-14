import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private userSource = new BehaviorSubject<Object>({});
  currentUser = this.userSource.asObservable();

  private gameSource = new BehaviorSubject<Object>({});
  currentGame = this.gameSource.asObservable();


  constructor() { }

  changeUser(user : Object){
    this.userSource.next(user);
  }

  changeGame(game : Object){
    this.gameSource.next(game);
  }
}
