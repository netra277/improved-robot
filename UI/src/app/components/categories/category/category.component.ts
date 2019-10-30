import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoryService } from 'src/app/services/category/category.service';
import { AlertsService } from 'src/app/commons/services/alerts.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  selectedCategory: any = {};
  categoryForm;
  editMode: boolean = false;
  validationMesages = {
    'categoryId': {
      'required': 'Id is required',
      'minlength': 'requires 4 characters'
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
  constructor(private fb: FormBuilder, private activeModal: NgbActiveModal,
    private categoryService: CategoryService, private alertService: AlertsService) {
  }

  ngOnInit() {
    this.categoryService.selectedCategory$.subscribe(category => this.selectedCategory = category);
    if (this.selectedCategory.categoryId) {
      this.editMode = true;
    }
    this.categoryForm = this.fb.group({
      categoryId: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
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
    this.selectedCategory = {};
    this.activeModal.dismiss(msg);
  }
  close(msg) {
    this.selectedCategory = {};
    this.activeModal.close(msg);
  }
  createCategory() {
    if (this.editMode) {
      console.log('editmode');
      this.categoryService.editCategory(this.selectedCategory._id,this.categoryForm.value).subscribe(() => {
        this.activeModal.close();
        this.alertService.success('Category edited successfully!!!!');
        console.log('success');
      }, (err) => {
        console.log('error', err);
      });
    } else {
      console.log('createmode', this.categoryForm.value);
      this.categoryService.createCategory(this.categoryForm.value).subscribe(() => {
        this.activeModal.close();
        this.alertService.success('Category created successfully!!!!');
        console.log('success');
      }, (err) => {
        console.log('error', err);
      });
    }
  }
}