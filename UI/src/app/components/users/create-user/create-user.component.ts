import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertsService } from 'src/app/commons/services/alerts.service';
import { UserService, BranchService } from 'src/app/services';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
  roles:any;
  branches: any;
  statuses: any;
  userForm;
  validationMesages = {
    'username': {
      'required': 'Branch Id is required',
      'maxlength': 'Branch Id must be 12 characters'
    },
    'passwordpassword':{
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

  constructor(private activeModal: NgbActiveModal, private fb: FormBuilder, 
    private alertService: AlertsService, private userService: UserService,
    private branchService: BranchService) { }

  ngOnInit() {
    this.userService.getRoles().subscribe((data)=>{
      this.roles = data;
    });
    this.branchService.getAll().subscribe((data)=>{
      this.branches = data;
    });
    this.userService.getUserStatus().subscribe((data)=>{
      this.statuses = data;
    });
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.maxLength(12)]],
      password:['', Validators.required],
      repeatpassword:['', Validators.required],
      role:[''],
      branchId: [''],
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
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
  changeRole(e) {
    this.userForm.get('role').setValue(e.target.value, {
      onlySelf: true
    })
  }
  changeBranch(e) {
    this.userForm.get('branchId').setValue(e.target.value, {
      onlySelf: true
    })
  }
  changeStatus(e) {
    this.userForm.get('status').setValue(e.target.value, {
      onlySelf: true
    })
  }
}
