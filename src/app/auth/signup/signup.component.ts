import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  isAuthenticating: boolean = false;

  constructor(
    private service: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(7)]],
    });

    this.service.user$.subscribe((user) => {
      if (user) {
        this.router.navigate(['./']);
      }
    });
  }

  onSubmit() {
    console.log(this.signupForm.value);

    if (!this.signupForm.valid) {
      return;
    }
    console.log(this.signupForm.value);
    this.authenticate(this.signupForm.value);
    this.signupForm.reset();
  }

  async authenticate(value: any) {
    this.service
      .register(value.firstName, value.lastName, value.email, value.password)
      .subscribe();
  }
}
