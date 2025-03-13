import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportsrResourceModule } from '../../primeResources.module';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ViewEncapsulation } from '@angular/core';
import { UsersService } from '../../service/users.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-user-login',
    imports: [ImportsrResourceModule, FormsModule, CommonModule],
    providers: [MessageService, UsersService, CookieService],
    templateUrl: './user-login.component.html',
    styleUrl: './user-login.component.css',
    encapsulation: ViewEncapsulation.None
})
export class UserLoginComponent {
    public data_usuario: { correo_institucional: string; password: string; token: boolean } = { correo_institucional: '', password: '', token: false };

    constructor(
        private _messageService: MessageService,
        private _userService: UsersService,
        private _cookieService: CookieService,
        private _router: Router
    ) {}

    login() {
        this._userService.login(this.data_usuario).subscribe({
            next: (response) => {
                if (response.status == 'success') {
                    this._userService.setIdentity(response.user);
                    // this._cookieService.set('identity', JSON.stringify(response.user), 1, '/');
                    this.data_usuario.token = true;

                    this._userService.login(this.data_usuario).subscribe({
                        next: (response) => {
                            if (response.status == 'success') {
                                this._cookieService.set('token', response.token, 1, '/');
                                this._router.navigate(['/home']);
                            } else {
                                this._messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
                            }
                        },
                        error: (error) => {
                            this._messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message });
                        }
                    });
                } else {
                    this._messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
                }
            },
            error: (error) => {
                console.log(error);
                this._messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message });
            }
        });
    }
}
