import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { globalUrl } from './global.url';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    public url: string;
    public token: string | null;
    private identitySubject = new BehaviorSubject<any>(null);
    public identity$ = this.identitySubject.asObservable();

    constructor(
        private _http: HttpClient,
        private _cookieService: CookieService
    ) {
        this.url = globalUrl.url;
        this.token = '';

        this.loadIdentity();
    }

    login(user: any): Observable<any> {
        let param = JSON.stringify(user);
        let header = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url + 'login-staff', param, { headers: header });
    }
    gettoken(): string | null {
        let token = this._cookieService.get('token');
        if (token) {
            this.token = token;
        } else {
            this.token = null;
        }
        return this.token;
    }
    getIdentity(): any {
        try {
            const identity = this._cookieService.get('identity');
            return identity ? JSON.parse(identity) : null;
        } catch (error) {
            console.error('Error al parsear la identidad:', error);
            return null;
        }
    }
    private loadIdentity() {
        const identity = this.getIdentity();
        this.identitySubject.next(identity);
    }

    setIdentity(identity: any) {
        this._cookieService.set('identity', JSON.stringify(identity), 1, '/');
        this.identitySubject.next(identity);
    }
    clearIdentity() {
        this._cookieService.delete('identity', '/');
        this.identitySubject.next(null);
    }
}
