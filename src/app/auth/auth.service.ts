import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  map,
  Observable,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { AuthResponse, Autobind, RegisterResponse, User } from './auth.model';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

type UserSub = User | null;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  _user = new BehaviorSubject<UserSub>(null);

  constructor(private httpClient: HttpClient, private router: Router) {}

  get user$() {
    return this._user.asObservable();
  }

  userIsAuthenticated(): Observable<boolean> {
    return this.user$.pipe(map((usr) => !!usr));
  }

  @Autobind
  login(email: string, password: string): Observable<User> {
    const url = 'http://127.0.0.1:8080/login';

    let data = {
      user_name: email,
      password: password,
    };

    return this.httpClient.post<AuthResponse>(url, data).pipe(
      take(1),
      switchMap(this.authenticateUser),
      switchMap((token) => this.getUserDetails(token)),
      map((res) => {
        console.log('Response is ' + res);
        return this.RegisterSetUser(res);
      })
    );
  }
  getUserDetails(token: string): Observable<RegisterResponse> {
    const url = 'http://127.0.0.1:8080/users/';
    return this.httpClient.get<RegisterResponse>(url);
  }

  register(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Observable<User> {
    const url = 'http://127.0.0.1:8080/register';

    let data = {
      email: email,
      first_name: firstName,
      last_name: lastName,
      password: password,
    };

    return this.httpClient.post<RegisterResponse>(url, data).pipe(
      take(1),
      switchMap((res) => this.login(res.email, password))
    );
  }

  @Autobind
  authenticateUser(response: AuthResponse): Observable<string> {
    const exp = this.getExpiryDate(1 * 3600); // expires in one hr
    let val = JSON.stringify({
      token: response.token,
      expiresIn: exp.toISOString(),
    });

    Preferences.set({
      key: environment.tokenKey,
      value: val,
    });

    return of(response.token);
  }

  private getExpiryDate(sec: number): Date {
    return new Date(new Date().getTime() + sec * 1000);
  }

  @Autobind
  RegisterSetUser(response: RegisterResponse) {
    console.log(response);

    let user = new User(
      response.email,
      response.user_name,
      response.first_name,
      response.last_name
    );

    this._user.next(user);

    return user;
  }

  autoLogin(): Observable<boolean> {
    return of(false)
  }

  authenticatedGuard(isAuthPage: boolean): Observable<boolean> {
    return this.userIsAuthenticated().pipe(
      take(1),
      switchMap((isAuthenticated) => {
        if (isAuthenticated) {
          return of(isAuthenticated);
        }

        return this.autoLogin();
      }),
      switchMap((isAuthenticated) => {
        return isAuthPage ? of(!isAuthenticated) : of(isAuthenticated);
      }),
      tap((isAuthenticated) => {
        if (!isAuthenticated && !isAuthPage) {
          this.router.navigate(['/', 'authenticate']);
        } else if (!isAuthenticated && isAuthPage) {
          this.router.navigate(['/']);
        }
      })
    );
  }
}
