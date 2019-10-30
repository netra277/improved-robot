import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import {config } from '../../configuration/config';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private selectedCategory = new BehaviorSubject({});
  selectedCategory$ = this.selectedCategory.asObservable();

  constructor(private http: HttpClient) { }

  setSelectedCategory(category){
    this.selectedCategory.next(category);
  }

  getAll(){
    return this.http.get(`${config.apiUrl}/categories`);
  }
  createCategory(data: any){
    return this.http.post(`${config.apiUrl}/categories/create`,data);
  }

  deleteCategory(id: string){
    return this.http.delete(`${config.apiUrl}/categories/${id}`);
  }

  editCategory(id: string, data:any){
    return this.http.put(`${config.apiUrl}/categories/${id}`,data);
  }
}
