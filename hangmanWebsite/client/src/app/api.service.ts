import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Game } from './game';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  URL = 'wordgame/api/v2/';

  constructor(private http : HttpClient) { }

  login(credentials) : Observable<Object>{
    return this.http.post<Object>(this.URL + 'login', credentials);
  }

  getFonts() : Observable<Object[]>{
    return this.http.get<Object[]>(this.URL + 'meta/fonts');
  }

  getMeta() : Observable<Object>{
    return this.http.get<Object>(this.URL + 'meta');
  }

  getGames(id) : Observable<Game[]>{
    return this.http.get<Game[]>(this.URL + id);
  }

  createGame(id, body, header, param) : Observable<Game>{
    return this.http.post<Game>(this.URL + id, body, {headers: header, params: param});
  }

  makeGuess(userId, gameId, param) : Observable<Game>{
    return this.http.post<Game>(this.URL + userId + '/' + gameId + '/guesses', null, {params: param});
  }

  getGame(userId, gameId) : Observable<Game>{
    return this.http.get<Game>(this.URL + userId + '/' + gameId);
  }
}
