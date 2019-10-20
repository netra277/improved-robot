import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
    private authenticationService: AuthenticationService){

    }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const currentUser = this.authenticationService.currentUserValue;
    if(currentUser){
      if(route.data.roles && route.data.roles.indexOf(currentUser.role) === -1){
        this.router.navigate(['/']);
        return false;
      }
      return true;
    }
    this.router.navigate(['/login'],{queryParams:{returnUrl: state.url}});
    return false;
  }
  
}
