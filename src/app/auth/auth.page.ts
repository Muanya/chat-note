import { Component } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage {
  isLogin = false;

  constructor() {}

  toggleAuthMode() {
    this.isLogin = !this.isLogin;
  }
}
