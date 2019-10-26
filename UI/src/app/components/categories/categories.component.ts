import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { CategoryComponent } from './category/category.component';

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
  constructor(private modalService: NgbModal, ) { }

  ngOnInit() {
    this.categories = [
      {
        id:'categoryid',
        name:'category1',
        description: ' this is description of category1'
      }
    ]
  }

  createCategory(){
    const modalRef = this.modalService.open(CategoryComponent,this.options);
  }

  editCategory(){
    console.log('edit category clicked');
  }

  deleteCategory(){
    console.log('delete category clicked');
  }
}
