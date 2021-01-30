import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from './services';
import { User } from './models';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'd-epos';
  currentUser: User;
  loggedInUserDetails: any;
  date: any;
  deviceId;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.date = moment().format('dddd, LL');
    //this.loggedInUserDetails = getLoggedInUserDetails();
    this.deviceId = localStorage.getItem('device-id');
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    console.log(this.currentUser);
  }
  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
  setdevice(){
     localStorage.setItem('device-id','abcd');
  }
}
