import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  _user = new BehaviorSubject<string | null>(null);

  get user() {
    return this._user.asObservable();
  }

  constructor(private httpClient: HttpClient) {}

  login(email: string, password: string): Observable<String | null> {
    const url = "http://127.0.0.1:8080/login"


    let data = {
        user_name: email,
        password: password
    }

    
    
    let resp = this.httpClient.post(url, data).pipe(take(1), tap((res)=>{
      console.log(data);

      console.log(res); 
    })).subscribe()
    return this.user;
  }

  signup(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Observable<String | null> {
    return this.user;
  }
}
