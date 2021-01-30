import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {FormControl, FormGroupDirective, NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../../services';
import { Roles } from '../../models/constants/roles';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    username = '';
    password = '';
    loading = false;
    submitted = false;
    returnUrl: string;
    error = '';
    roles = Roles;
    selectedRole;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    ngOnInit() {
       
        // reset login status
        this.authenticationService.logout();

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }


    onSubmit() { 
        console.log('clicked on submit');
        console.log(this.selectedRole);
        if(this.selectedRole === "ADMIN"){
            this.authenticationService.adminLogin(this.username, this.password).pipe(first())
            .subscribe(
                data => {
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    console.log('error');
                    this.error = error;
                    this.loading = false;
                });
        }
        else {
            this.authenticationService.login(this.username, this.password).pipe(first())
            .subscribe(
                data => {
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    console.log('error');
                    this.error = error;
                    this.loading = false;
                });
        }
        
    }

    selectedRoleChange(role){
        this.selectedRole = role;

    }

}
