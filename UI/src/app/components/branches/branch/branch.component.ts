import { Component, OnInit, Input } from '@angular/core';
import { Branch } from 'src/app/models/branch.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertsService } from 'src/app/commons/services/alerts.service';
import { BranchService } from 'src/app/services';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.css']
})
export class BranchComponent implements OnInit {
  @Input() selectedBranch;
  editBranchForm;
  editMode = false;
  Taxes = [
    {
      key: '',
      value: ''
    }
  ];
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
  };
  formErrors = {
    'name': '',
    'phone': '',
    'email': '',
    'address': ''
  };
  
  constructor(private alertService: AlertsService, private branchService: BranchService,
    private fb: FormBuilder) { }

  ngOnInit() {
    
    this.selectedBranch = {
      _id:'',
      branchId:'',
      name:'',
      phone:'',
      email:'',
      address:'',
      isHeadBranch: false,
      printInvoice: false,
      tax:[
        {
          key:'',
          value:''
        }
      ]
    };
    this.editBranchForm = this.fb.group({
      name: [''],
      phone: [''],
      email: [''],
      address: [''],
      isHeadBranch:[false],
      printInvoice:[false]
    });
    this.editBranchForm.valueChanges.subscribe((data) => {
      if(this.editMode){
        this.checkValidationErrors(this.editBranchForm);
      }
    });
  }

  checkValidationErrors(group: FormGroup = this.editBranchForm): void {
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

  editBranch(){
    this.editMode = true;
    console.log('editing branch', this.selectedBranch);
  }

  saveBranch(){
    if(!this.editMode){
      return;
    }
    let newBranch = this.editBranchForm.value;
    if(this.Taxes && this.Taxes.length>0){
      newBranch.tax = [];
      this.Taxes.forEach((value)=>{
        if(value.key && value.value){
          newBranch.tax.push(value);
        }
      })
    }
    newBranch.branchId = this.selectedBranch.branchId;
    newBranch.phone = newBranch.phone.toString();
    console.log(newBranch);
    this.branchService.editBranch(this.selectedBranch._id,newBranch).subscribe(()=>{
      this.alertService.success('Branch edited successfully!!!!');
      this.editMode = false;
      console.log('success');
    },(err)=>{
      this.alertService.error('error in editing branch');
      console.log('error',err);
    });
  }

  addTaxFields() {
    if (this.Taxes.length === 0) {
      return;
    }
    const addedTaxes = this.Taxes.filter((tax) => {
      return tax.key === '' || tax.value === ''
    });
    if (addedTaxes && addedTaxes.length > 0) {
      console.log('show message');
      this.alertService.info('Please tax values');
    }
    else{
      this.Taxes.push({ key:'', value:'' });
    }
  }

  deleteBranch(){
    if(this.selectedBranch && this.selectedBranch._id){
      console.log('deleting branch id', this.selectedBranch._id);
      this.branchService.deleteBranch(this.selectedBranch._id).subscribe(()=>{
        this.alertService.success('Branch deleted successfully!');
        console.log('deleted successfully');
      },(error)=>{
        this.alertService.error('error in deleting branch');
        console.log('error in deleting branch');
      });
    }
  }
}
