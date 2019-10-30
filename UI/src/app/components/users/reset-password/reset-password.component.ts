import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  validationMesages = {
    'password': {
      'required': 'Branch Id is required'
    },
    'confirmPassword':{
      'required':'password is required'
    },
    'repeatpassword':{
      'required':'password is required'
    },
    'name': {
      'required': 'name is required'
    },
    'phone': {
      'required': 'phone is required'
    },
    'email': {
      'required': 'email is required'
    },
    'role':{
      'required':'role is required'
    },
    'branchId':{
      'required':'branch is required'
    }
  };
  formErrors = {
    'username': '',
    'password':'',
    'repeatpassword':'',
    'name': '',
    'phone': '',
    'email': '',
    'role':'',
    'branchId':''
  };
  resetPasswordForm;

  constructor(private fb: FormBuilder, private activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.resetPasswordForm = this.fb.group({
      password:['', Validators.required],
      confirmPassword:['', Validators.required]
    });

    this.resetPasswordForm.valueChanges.subscribe((data) => {
      this.checkValidationErrors(this.resetPasswordForm);
    });
  }
  checkValidationErrors(group: FormGroup = this.resetPasswordForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl instanceof FormGroup) {
        this.checkValidationErrors(abstractControl);
      } else {
        this.formErrors[key] = '';
        if (abstractControl && !abstractControl.valid &&
          (abstractControl.touched || abstractControl.dirty)) {
          const messages = this.validationMesages[key];
          for (const errorKey in abstractControl.errors) {
            if (errorKey) {
              this.formErrors[key] += messages[errorKey] + ' ';
            }
          }
        }
      }
    });
  }
  dismiss(msg){
    this.activeModal.dismiss(msg);
  }
  close() {
    this.activeModal.close();
  }
}
