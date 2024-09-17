import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Preferences } from "@capacitor/preferences";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

export class AuthInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Retrieve token from storage
    // const token = localStorage.getItem(environment.tokenKey);

    const token = Preferences.get({key: environment.tokenKey})

    // Clone the request and add the Authorization header if token exists
    if (token) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `JWT ${token}`
        }
      });
      return next.handle(authReq);
    }

    return next.handle(req);
  }

}
