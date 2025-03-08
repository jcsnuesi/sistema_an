import { Component } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { AspirantesService } from '../../service/aspirantes.service';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-consulta-login',
    imports: [DialogModule, CommonModule, FormsModule, ToastModule, ButtonModule, InputTextModule, InputMaskModule],
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
                        next: (response) => {
                            if (response.status == 'success') {
                                this._cookieService.set('tokenAspirante', response.token);
                                let cedula = JSON.parse(this._cookieService.get('identityAspirante')).cedula;
                                console.log(cedula);
                                this._router.navigate(['/aspirantes/consulta-solicitudes', cedula]);
                            }
                        },
                        error: (error) => {
                            console.log(error);
                            this._messageService.add({ severity: 'error', summary: 'Error', detail: 'Error en el login' });
                        }
                    });
                }
            },
            error: (error) => {
                console.log(error);
                this._messageService.add({ severity: 'error', summary: 'Error', detail: 'Error en el login' });
            }
        });
    }
}
// 001-2347124-8
