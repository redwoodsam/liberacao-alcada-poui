import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { UserService } from "../user/user.service";

@Injectable( { providedIn: 'root'} )
export class LoginGuard implements CanActivate {
    logado = false
    constructor(
        private router: Router,
        private userService: UserService
    ){}
    
    canActivate(
        route: ActivatedRouteSnapshot, 
        state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

            this.userService.guardRouter();
            if( this.userService.isLogged() ){
                this.router.navigateByUrl('home');
                return false;
            } else {
                return true;
            }
        }
}