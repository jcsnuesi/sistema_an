import { Component } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { AspirantesService } from '../../service/aspirantes.service';
import { FormsModule, NgForm } from '@angular/forms';
import { ImportsModule } from '../primeNG.module';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-consulta-login',
    imports: [DialogModule, CommonModule, FormsModule, ImportsModule],
    templateUrl: './consulta-login.component.html',
    styleUrl: './consulta-login.component.css',
    providers: [MessageService, AspirantesService, CookieService]
})
export class ConsultaLoginComponent {
    public data_aspirante: { cedula: string; password: string; token: boolean } = { cedula: '', password: '', token: false };
    public showDialog: boolean = true;
    constructor(
        private _messageService: MessageService,
        private _aspirantesService: AspirantesService,
        private _cookieService: CookieService,
        private _router: Router
    ) {}

    login() {
        this._aspirantesService.loginConsulta(this.data_aspirante).subscribe({
            next: (response) => {
                if (response.status == 'success') {
                    this.data_aspirante.token = true;
                    this._cookieService.set('identityAspirante', JSON.stringify(response.message));

                    this._aspirantesService.loginConsulta(this.data_aspirante).subscribe({
                        next: (res) => {
                            if (res.status == 'success') {
                                this._cookieService.set('tokenAspirante', res.token);
                                let cedula = JSON.parse(this._cookieService.get('identityAspirante')).cedula;

                                this._router.navigate(['/aspirantes/consulta-solicitudes', cedula]);
                            } else {
                                this._messageService.add({ severity: 'error', summary: 'Error', detail: res.message });
                            }
                        },
                        error: (error) => {
                            console.log(error);
                            this._messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message });
                        }
                    });
                }
            },
            error: (error) => {
                console.log(error);
                this._messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message });
            }
        });
    }
}
