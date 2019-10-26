import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  categoryForm;
  validationMesages = {
    'categoryId': {
      'required': 'Id is required'
    },
    'name': {
      'required': 'name is required'
    },
    'description': {
      'required': 'description is required'
    }
  };
  formErrors = {
    'categoryId': '',
    'name': '',
    'description': ''
  };
  category = {
    categoryId: '',
    name: '',
    description: ''
  };
  constructor(private fb: FormBuilder, private activeModal: NgbActiveModal) {

   }

  ngOnInit() {
    this.categoryForm = this.fb.group({
      categoryId: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      name: ['', Validators.required],
      description: ['']
    });

    this.categoryForm.valueChanges.subscribe((data) => {
      this.checkValidationErrors(this.categoryForm);
    });
  }

  checkValidationErrors(group: FormGroup = this.categoryForm): void {
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
  dismiss(msg) {
    this.activeModal.dismiss(msg);
  }
  close(msg) {
    this.activeModal.close(msg);
  }
}