import { Component, OnInit, Input } from '@angular/core';
import { UserService, BranchService } from 'src/app/services';
import { AlertsService } from 'src/app/commons/services/alerts.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  @Input() selectedUser;
  statuses;
  branches;
  roles;
  userEditForm;
  editMode = false;
  validationMesages = {
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
    'role':{
      'required': 'role is required'
    },
    'status':{
      'required':'branch is required'
    }
  };
  formErrors = {
    'name': '',
    'phone': '',
    'email': '',
    'address': '',
    'role':'',
    'status':''
  };

  constructor(private userService: UserService, private alertService: AlertsService, 
    private fb: FormBuilder, private branchService: BranchService) { }

  ngOnInit() {

    this.selectedUser = {
      _id:'',
      username:'',
      name:'',
      phone:'',
      email:'',
      branchId:'',
      status:'',
      role: ''
    };
    this.userEditForm = this.fb.group({
      name: [this.selectedUser.name],
      phone: [this.selectedUser.phone],
      email: [this.selectedUser.email],
      role: [this.selectedUser.role.role],
      status:[this.selectedUser.status]
    });
    this.userEditForm.valueChanges.subscribe((data) => {
      if(this.editMode){
        this.checkValidationErrors(this.userEditForm);
      }
    });

    this.userService.getRoles().subscribe((data)=>{
      this.roles = data;
    });
    this.userService.getUserStatus().subscribe((data)=>{
      this.statuses = data;
    });
  }

  checkValidationErrors(group: FormGroup = this.userEditForm): void {
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

  editUser(){
    this.editMode = true;
    console.log('editing user', this.selectedUser);
  }

  saveUser(){
    if(!this.editMode){
      return;
    }
    let newUser = this.userEditForm.value;
    console.log(newUser);
    this.userService.editUser(this.selectedUser._id,newUser).subscribe(()=>{
      this.alertService.success('User edited successfully!!!!');
      console.log('success');
    },(err)=>{
      this.alertService.error('error in editing user');
      console.log('error',err);
    });
  }

  deleteUser(){
    
    if(this.selectedUser && this.selectedUser._id){
      console.log('deleting user id', this.selectedUser._id);
      this.userService.deleteUser(this.selectedUser._id).subscribe(()=>{
        this.alertService.success('User deleted successfully!');
        console.log('user deleted successfully');
      },(error)=>{
        this.alertService.error('error in deleting user');
        console.log('error in deleting user');
      });
    }
  }
  cancelSave(){
    this.editMode = false;
  }

  changeRole(e) {
    this.userEditForm.get('role').setValue(e.target.value, {
      onlySelf: true
    })
  }
  changeBranch(e) {
    this.userEditForm.get('branchId').setValue(e.target.value, {
      onlySelf: true
    })
  }
  changeStatus(e) {
    this.userEditForm.get('status').setValue(e.target.value, {
      onlySelf: true
    })
  }
}
