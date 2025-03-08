import { CanActivateFn } from '@angular/router';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root'
})
export class AspirantesGuard implements CanActivate {
    constructor(
        private router: Router,
        private cookieService: CookieService
    ) {}

    canActivate(): boolean {
        const token = this.cookieService.get('tokenAspirante') || null;
        if (token) {
            return true;
        } else {
            this.router.navigate(['aspirantes/login-consulta']);
            return false;
        }
    }
}
