import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { globalUrl } from './global.url';

@Injectable({
    providedIn: 'root'
})
export class NotificationsService {
    public url: string;
    constructor(private _http: HttpClient) {
        this.url = globalUrl.url;
    }

    getNuevoAspirantesNotificacion(token: string | null): Observable<any> {
        if (token == null) {
            throw new Error('No se ha proporcionado un token');
        }
        let headers = new HttpHeaders().set('Authorization', token);
        return this._http.get(this.url + 'get-aspirantes', { headers: headers });
    }

    setLeidosTrue(token: string | null, data: { id: string }): Observable<any> {
        if (token == null) {
            throw new Error('No se ha proporcionado un token');
        }
        let param = JSON.stringify(data);
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
        return this._http.put(this.url + 'set-leidos-aspirantes', param, { headers: headers });
    }
}
