import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailService } from '../services/email.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  registrationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: ActivatedRoute,
    private emailService: EmailService,
    public toastr: ToastrService,
    private route: Router
  ) {
    this.registrationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      profilePic: [null, Validators.required],
      markSheet: [null, Validators.required],
    });
  }

  ngOnInit() {
    console.log('able');
    this.router.queryParams.subscribe((params) => {
      this.registrationForm.patchValue({
        name: params['name'],
        mobile: params['mobile'],
        email: params['email'],
        gender: params['gender'],
        amount: params['amount'],
      });
    });
  }

  get formControls() {
    return this.registrationForm.controls;
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      const userData = this.registrationForm.value;
      const { email, name } = this.registrationForm.value;
      this.emailService
        .sendEmail(
          email,
          name
        )
        .then(() => {
          this.toastr.success(
            'Registration successful! Please check your email.',
            '',
            {
              toastClass: 'toast-success-custom toast-top-full-width',
            }
          );
          this.emailService.setUserData(userData);
          this.route.navigate(['/dashboard']);
        })
        .catch(() => {
          this.toastr.error('There was an error sending the email.', '', {
            toastClass: 'toast-error-custom toast-top-full-width',
          });
        });
    }
  }
}
