import { CanActivateFn } from '@angular/router';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AspirantesService } from '../pages/service/aspirantes.service';

@Injectable({
    providedIn: 'root'
})
export class AspirantesGuard implements CanActivate {
    constructor(
        private router: Router,
        private _aspirantesService: AspirantesService
    ) {}

    canActivate(): boolean {
        const token = this._aspirantesService.getTokenAspirante();
        const identity = this._aspirantesService.getIdentityAspirante();

        if (token && Boolean(identity.role) == false) {
            return true;
        } else {
            this.router.navigate(['aspirantes/login-consulta']);
            return false;
        }
    }
}
