import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import {config } from '../../configuration/config';
import { Observable } from 'rxjs';
import { Branch } from 'src/app/models/branch.interface';

@Injectable({
  providedIn: 'root'
})
export class BranchService {
   
  constructor(private http: HttpClient) { 
     
  }

  getAll(){
    return this.http.get(`${config.apiUrl}/branches`);
  }

  createBranch(data: any){
    return this.http.post(`${config.apiUrl}/branches/create`,data);
  }

  deleteBranch(id: string){
    return this.http.delete(`${config.apiUrl}/branches/${id}`);
  }
}
