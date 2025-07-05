import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { catchError, from, Observable, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Retrieve token from storage

    if (this.shouldIntercept(req)) {
      return from(Preferences.get({ key: environment.tokenKey }))
        .pipe(
          switchMap((token) => {
            let authReq: HttpRequest<any>;

            // Clone the request and add the Authorization header if token exists
            if (token && token.value) {
              authReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${token.value}`,
                },
                withCredentials: true,
              });
            } else {
              authReq = req.clone({
                withCredentials: true,
              });
            }
            return next.handle(authReq);
          })
        )
        .pipe(
          catchError((error) => {
            // Handle errors
            console.error('Error intercepted:', error);

            // redirect to login in not authorized 
            throw error;
          })
        );
    }

    return next.handle(req);
  }

  private shouldIntercept(req: HttpRequest<any>) {
    return true;
  }
}
