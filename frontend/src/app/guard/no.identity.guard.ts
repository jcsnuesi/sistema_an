import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsersService } from '../pages/service/users.service';

@Injectable({
    providedIn: 'root'
})
export class NoIdentityGuard implements CanActivate {
    constructor(
        private router: Router,
        private _userService: UsersService
    ) {}

    canActivate(): boolean {
        const token = this._userService.gettoken();
        const identity = this._userService.getIdentity();

        if (token && identity?.role?.role_name) {
            this.router.navigate(['/home']);
            console.log('Redirigiendo a la página de inicio');
            return false;
        } else {
            console.log('Redirigiendo a la página de login');
            return true;
        }
    }
}
