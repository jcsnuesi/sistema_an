import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { globalUrl } from './global.url';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    public url: string;
    public token: string | null;

    constructor(
        private _http: HttpClient,
        private _cookieService: CookieService
    ) {
        this.url = globalUrl.url;
        this.token = '';
    }

    login(user: any): Observable<any> {
        let param = JSON.stringify(user);
        let header = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url + 'login-staff', param, { headers: header });
    }
    gettoken(): string | null {
        if (this._cookieService.get('token')) {
            this.token = this._cookieService.get('token');
        } else {
            this.token = null;
        }
        return this.token;
    }
    getIdentity(): any {
        return JSON.parse(this._cookieService.get('identity') || '{}');
    }
}
