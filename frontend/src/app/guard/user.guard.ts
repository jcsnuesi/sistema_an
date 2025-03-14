import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsersService } from '../pages/service/users.service';

@Injectable({
    providedIn: 'root'
})
export class UserGuard implements CanActivate {
    constructor(
        private router: Router,
        private _userService: UsersService
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let token = this._userService.gettoken();
        let identity = this._userService.getIdentity();

        if (token && identity?.role?.role_name) {
            return true;
        } else {
            console.log('No tienes permiso para acceder a esta página');
            this.router.navigate(['/users/login']);
            return false;
        }
    }
}
