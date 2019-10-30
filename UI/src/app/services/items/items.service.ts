import { Injectable } from '@angular/core';

import {config } from '../../configuration/config';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  constructor(private http: HttpClient) { }

  getAll(){
    return this.http.get(`${config.apiUrl}/items`);
  }
  createItem(data: any){
    return this.http.post(`${config.apiUrl}/items/create`,data);
  }

  deleteItem(id: string){
    return this.http.delete(`${config.apiUrl}/items/${id}`);
  }

  editItem(id: string, data:any){
    return this.http.put(`${config.apiUrl}/items/${id}`,data);
  }
}
