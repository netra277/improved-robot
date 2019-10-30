import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { CategoryComponent } from './category/category.component';
import { CategoryService } from 'src/app/services/category/category.service';
import { AlertsService } from 'src/app/commons/services/alerts.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categories;
  options: NgbModalOptions = {
    size:'lg'
  }
  constructor(private modalService: NgbModal, private categoryService: CategoryService,
    private alertService: AlertsService) { }

  ngOnInit() {
     this.categoryService.getAll().subscribe((data)=>{
      this.categories = data;
      console.log(this.categories);
     });
  }

  createCategory(){
    this.categoryService.setSelectedCategory({});
    const modalRef = this.modalService.open(CategoryComponent,this.options);
  }

  editCategory(category){
    console.log('edit category clicked', category);
    this.categoryService.setSelectedCategory(category);
    const modalRef = this.modalService.open(CategoryComponent, this.options);
  }

  deleteCategory(category){
    console.log('delete category clicked');
    this.categoryService.deleteCategory(category._id).subscribe(() => {
      this.alertService.success('Category deleted successfully!!!!');
      console.log('success');
    }, (err) => {
      console.log('error', err);
    });
  }
}
