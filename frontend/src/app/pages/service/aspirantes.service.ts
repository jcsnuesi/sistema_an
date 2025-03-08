import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { globalUrl } from './global.url';
import { error } from 'pdf-lib';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root'
})
export class AspirantesService {
    public url: string;
    public tokenAspirante: string;

    constructor(
        private _http: HttpClient,
        private _cookieService: CookieService
    ) {
        this.url = globalUrl.url;
        this.tokenAspirante = '';
    }

    create(aspirante: FormData): Observable<any> {
        return this._http.post(this.url + 'create-aspirante', aspirante);
    }

    update(aspirante: FormData): Observable<any> {
        return this._http.put(this.url + 'update-solicitud-aspirante', aspirante);
    }

    getNuevosAspirantes(token: string): Observable<any> {
        let header = new HttpHeaders().set('Authorization', token);
        return this._http.get(this.url + 'nuevas-solicitudes', { headers: header });
    }

    solicitarEdicion(aspirante: any, token: string): Observable<any> {
        let params = JSON.stringify(aspirante);
        let header = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
        return this._http.post(this.url + 'edicion-solicitada', params, { headers: header });
    }
    getObservacionesById(token: string, id: string): Observable<any> {
        let header = new HttpHeaders().set('Authorization', token);
        return this._http.get(this.url + 'get-observaciones/' + id, { headers: header });
    }

    updateSolicitud(token: string, status: string, id: string): Observable<any> {
        let header = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
        return this._http.put(this.url + 'update-estatus-solicitud/' + id, { estatus_solicitud: status }, { headers: header });
    }
    consultarSolicitud(id: string | null): Observable<any> {
        if (id == null) {
            return error('No se ha proporcionado un id');
        }
        return this._http.get(this.url + 'consultar-solicitudes/' + id);
    }

    loginConsulta(data: any): Observable<any> {
        let header = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url + 'login-consulta', data, { headers: header });
    }

    getTokenAspirante(): string {
        return this._cookieService.get('tokenAspirante');
    }
    getIdentityAspirante(): any {
        return JSON.parse(this._cookieService.get('identityAspirante') || '{}');
    }

    destroySession() {
        this._cookieService.delete('tokenAspirante');
        this._cookieService.delete('identityAspirante');
    }
}
