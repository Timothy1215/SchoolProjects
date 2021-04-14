import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  

  constructor(private http : HttpClient) { }


  getPlayers(param) : Observable<Object[]>{
    const params = new HttpParams({
      fromObject: param
    });
    return this.http.get<Object[]>('api/player', {params: params});
  }

  createPlayer(body) : Observable<Object>{
    return this.http.post<Object>('api/player', body);
  }

  removePlayer(query) : Observable<Object>{
    const params = new HttpParams({
      fromObject: query
    });
    return this.http.delete<Object>('api/player', {params: params});
  }

  getWinningTeam(body) : Observable<String>{
    return this.http.put<String>('api/game', body);
  }

  compareTeams(param) : Observable<Object>{
    const params = new HttpParams({
      fromObject: param
    });
    return this.http.get<Object>('api/game', {params: params});
  }

  getTeams(query) : Observable<Object[]>{
    const params = new HttpParams({
      fromObject: query
    });
    return this.http.get<Object[]>('api/team', {params: params});
  }

  getPlaybook(query) : Observable<Object[]>{
    const params = new HttpParams({
      fromObject: query
    });
    return this.http.get<Object[]>('api/team/playbook', {params: params});
  }

  getStats(query) : Observable<Object[]>{
    const params = new HttpParams({
      fromObject: query
    });
    return this.http.get<Object[]>('api/player/stats', {params: params});
  }

  getTeamData(query) : Observable<Object[]>{
    const params = new HttpParams({
      fromObject: query
    });
    return this.http.get<Object[]>('api/team/data', {params: params});
  }

  getRange(query) : Observable<Object[]>{
    const params = new HttpParams({
      fromObject: query
    });
    return this.http.get<Object[]>('api/player/ranks', {params: params});
  }

  getCount(query) : Observable<Object[]>{
    const params = new HttpParams({
      fromObject: query
    });
    return this.http.get<Object[]>('api/team/count', {params: params});
  }

  getTeamAvg(query) : Observable<Object[]>{
    const params = new HttpParams({
      fromObject: query
    });
    return this.http.get<Object[]>('api/team/statCount', {params: params});
  }

  getTeamDivConAvg(query) : Observable<Object[]>{
    const params = new HttpParams({
      fromObject: query
    });
    return this.http.get<Object[]>('api/team/teamStatCount', {params: params});
  }
}
