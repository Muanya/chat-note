import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isAuthenticating: boolean = false;

  constructor(private service: AuthService, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(7)]],
    });
  }

  onSubmit() {
    console.log(this.loginForm.value);

    if (!this.loginForm.valid) {
      return;
    }
    console.log(this.loginForm.value);
    this.authenticate(this.loginForm.value);
    this.loginForm.reset();
  }

  async authenticate(value: any) {
    this.service.login(value.email, value.password).subscribe();
  }
}
