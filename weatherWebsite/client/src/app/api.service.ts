import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Location } from './location';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http : HttpClient) { }

  login(credentials) : Observable<User>{
    return this.http.post<User>('/api/v1/login', credentials);
  }

  retrieveLocations(id) : Observable<Location[]>{
    return this.http.get<Location[]>('/api/v1/locations/' + id);
  }

  searchLocation(query) : Observable<Location>{
    const params = new HttpParams({
      fromObject: query
    });
    return this.http.get<Location>('api/v1/locations', {params: params});
  }

  createLocation(id, query) : Observable<Location>{
    const params = new HttpParams({
      fromObject: query
    });
    return this.http.post<Location>('api/v1/locations/' + id, null, {params: params});
  }

  deleteLocation(id) : Observable<Location>{
    return this.http.delete<Location>('/api/v1/locations/' + id);
  }
}
