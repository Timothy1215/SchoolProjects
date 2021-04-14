import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User } from './user';
import { Program } from './program';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http : HttpClient) { }

  login(credentials) : Observable<User>{
    return this.http.post<User>('/api/login', credentials);
  }

  register(credentials) : Observable<User>{
    return this.http.post<User>('/api/register', credentials);
  }
  
  modifyUser(id, body) : Observable<User>{
    return this.http.put<User>('/api/users/' + id, body);
  }

  getPrograms() : Observable<Program[]>{
    return this.http.get<Program[]>('/api/programs');
  }

  getUsers() : Observable<User[]>{
    return this.http.get<User[]>('/api/users');
  }

  createProgram(body) : Observable<Program>{
    return this.http.post<Program>('/api/program', body);
  }

  modifyProgram(id, body) : Observable<Program>{
    return this.http.put<Program>('/api/program/' + id, body);
  }

  deleteProgram(id) : Observable<Object>{
    let params = new HttpParams();
    params = params.append('program', id);
    
    return this.http.delete<Object>('/api/program', {params : params});
  }

  getUserPrograms(id) : Observable<Program[]>{
    return this.http.get<Program[]>('/api/programs/' + id);
  }

  signUp(userid, body) : Observable<User>{
    return this.http.put<User>('/api/' + userid, body);
  }

  logout() : Observable<String>{
    return this.http.post<String>('/api/logout', {});
  }

  deleteUser(id) : Observable<User>{
    return this.http.put<User>('/api/user/' + id, {});
  }

  cancelProgram(userid, programid) : Observable<User>{
    return this.http.put<User>('/api/user/' + userid + '/' + programid, {});
  }
  
  makeUserActive(id) : Observable<User>{
    return this.http.put<User>('/api/userActive/' + id, {});
  }
}
