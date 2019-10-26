import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertsService } from 'src/app/commons/services/alerts.service';
import { UserService } from 'src/app/services';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {

  userForm;
  validationMesages = {
    'username': {
      'required': 'Branch Id is required',
      'minlength': 'Branch Id must be 6 characters',
      'maxlength': 'Branch Id must be 12 characters'
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
    'address': {
      'required': 'address is required'
    },
  };
  formErrors = {
    'username': '',
    'name': '',
    'phone': '',
    'email': '',
    'address': '',
    'role':''
  };

  constructor(private activeModal: NgbActiveModal, private fb: FormBuilder, 
    private alertService: AlertsService, private userService: UserService) { }

  ngOnInit() {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      password:[''],
      branchId: [''],
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      address: ['', Validators.required],
      status: ['']
    });

    this.userForm.valueChanges.subscribe((data) => {
      this.checkValidationErrors(this.userForm);
    });
  }
  dismiss(msg) {
    this.activeModal.dismiss(msg);
  }
  close() {
    this.activeModal.close();
  }
  submitUser() {
    let newUser = this.userForm.value;
     
    console.log(newUser);
    this.userService.createUser(newUser).subscribe(()=>{
      this.activeModal.close();
      this.alertService.success('User Created Successfully!!!!');
      console.log('success');
    },(err)=>{
      console.log('error',err);
    });
  }
  checkValidationErrors(group: FormGroup = this.userForm): void {
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
}
