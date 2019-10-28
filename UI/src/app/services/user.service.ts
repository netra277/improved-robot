import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../models';
import {config } from '../configuration/config'

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(`${config.apiUrl}/users`);
    }

    createUser(data: any){
        return this.http.post(`${config.apiUrl}/users/create`,data);
    }
    editUser(id: string, data: any){
        return this.http.put(`${config.apiUrl}/users/${id}`,data);
    }
    deleteUser(id: string){
        return this.http.delete(`${config.apiUrl}/users/${id}`);
    }

    getRoles(){
        return this.http.get(`${config.apiUrl}/roles`);
    }
    getUserStatus(){
        return this.http.get(`${config.apiUrl}/status/user`);
    }
}
