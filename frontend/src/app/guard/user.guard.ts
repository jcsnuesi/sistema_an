import { CanActivateFn } from '@angular/router';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsersService } from '../pages/service/users.service';

@Injectable({
    providedIn: 'root'
})
export class UserGuard implements CanActivate {
    public token: string | null;
    constructor(
        private router: Router,
        private _userService: UsersService
    ) {
        this.token = this._userService.gettoken();
    }

    canActivate(): boolean {
        if (this.token) {
            return true;
        } else {
            console.log('No tienes permiso para acceder a esta página');
            this.router.navigate(['/users/login']);
            return false;
        }
    }
}
