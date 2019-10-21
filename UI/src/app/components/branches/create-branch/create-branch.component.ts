import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AlertsService } from 'src/app/commons/services/alerts.service';
import { BranchService } from 'src/app/services';

@Component({
  selector: 'app-create-branch',
  templateUrl: './create-branch.component.html',
  styleUrls: ['./create-branch.component.css']
})
export class CreateBranchComponent implements OnInit {
  branchForm;
  validationMesages = {
    'branchId': {
      'required': 'Branch Id is required',
      'minlength': 'Branch Id must be 6 characters',
      'maxlength': 'Branch Id must be 6 characters'
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
    'branchId': '',
    'name': '',
    'phone': '',
    'email': '',
    'address': ''
  };
  Taxes = [
    {
      key: '',
      value: ''
    }
  ];

  constructor(private activeModal: NgbActiveModal,
    private fb: FormBuilder, private alertService: AlertsService,
    private branchService: BranchService) { }

  ngOnInit() {
    this.branchForm = this.fb.group({
      branchId: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      address: ['', Validators.required],
      isHeadBranch: [false],
      printInvoice: [false]
    });

    this.branchForm.valueChanges.subscribe((data) => {
      this.checkValidationErrors(this.branchForm);
    })
  }
  dismiss(msg) {
    this.activeModal.dismiss(msg);
  }
  close(msg) {
    this.activeModal.close(msg);
  }
  submitBranch() {
    let newBranch = this.branchForm.value;
    if(this.Taxes && this.Taxes.length>0){
      newBranch.tax = [];
      this.Taxes.forEach((value)=>{
        if(value.key && value.value){
          newBranch.tax.push(value);
        }
      })
    }
    console.log(newBranch);
    this.branchService.createBranch(newBranch).subscribe(()=>{
      this.activeModal.close();
      this.alertService.success('Branch Created Successfully!!!!');
      console.log('success');
    },(err)=>{
      console.log('error',err);
    });
  }
  checkValidationErrors(group: FormGroup = this.branchForm): void {
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
}
