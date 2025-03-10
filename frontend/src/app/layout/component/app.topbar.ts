import { Component, EventEmitter, Output, OnInit, Input, DoCheck, SimpleChanges } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';
import { AspirantesService } from '../../pages/service/aspirantes.service';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { globalUrl } from '../../pages/service/global.url';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { MenuModule } from 'primeng/menu';
import { ToastModule } from 'primeng/toast';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { HasPermissionsDirective } from '../../directive/has-permissions.directive';
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [HasPermissionsDirective, RouterModule, CommonModule, StyleClassModule, BadgeModule, OverlayBadgeModule, ButtonModule, InputTextModule, InputMaskModule, CardModule, DialogModule, MenuModule, ToastModule],
    providers: [AspirantesService, MessageService, CookieService],
    template: ` <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button *appHasPermissions="['ADMIN', 'SUPER_ADMIN', 'USUARIO']" class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                <i class="pi pi-bars"></i>
            </button>
            <a class="layout-topbar-logo" routerLink="/">
                <img src="/assets/logo-1.png" alt="sakai" width="30px" height="25px" />
                <span>SIAN</span>
            </a>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                    <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
                </button>
                <!--div class="relative" >
                    <button
                        class="layout-topbar-action layout-topbar-action-highlight"
                        pStyleClass="@next"
                        enterFromClass="hidden"
                        enterActiveClass="animate-scalein"
                        leaveToClass="hidden"
                        leaveActiveClass="animate-fadeout"
                        [hideOnOutsideClick]="true"
                    >
                        <i class="pi pi-palette"></i>
                    </button>
                    <app-configurator />
                </div-->
            </div>

            <button class="layout-topbar-menu-button layout-topbar-action" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true">
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <!--button type="button" class="layout-topbar-action" > <i class="pi pi-calendar"></i> <span>Calendar</span></button-->

                    <button type="button" (click)="showDialog()">
                        <p-overlaybadge [value]="badgeNotification" class="layout-topbar-action" *ngIf="showBar">
                            <i class="pi pi-inbox"></i>
                        </p-overlaybadge>
                    </button>
                    <button (click)="menu.toggle($event)" type="button" class="layout-topbar-action">
                        <i [class]="iconDinamico.icon"></i>
                        <p-toast />
                    </button>

                    <p-menu #menu [model]="items" [popup]="true" />
                </div>
            </div>
        </div>
    </div>`
})
export class AppTopbar implements OnInit, DoCheck {
    items!: MenuItem[];
    public editarDialog: boolean = false;
    public aspirante_token: string | null;
    public url: string;
    public showPicture: string = '';
    public aspirante_identity: any;
    public showBar: boolean = false;
    public showBarAdmin: boolean = false;
    @Input() badgeNotification: number = 0;
    @Output() showDialogOut: EventEmitter<boolean> = new EventEmitter<boolean>();
    public iconDinamico: { icon: string; label: string; mainlabel: string } = { icon: 'pi pi-sign-in', label: 'Login', mainlabel: 'Inicio de sesión' };
    // pi pi-user
    constructor(
        public layoutService: LayoutService,
        private _aspirantesService: AspirantesService,
        private _router: Router,
        private _messageService: MessageService,
        private _cookieService: CookieService
    ) {
        this.aspirante_token = this._aspirantesService.getTokenAspirante() || null;
        this.aspirante_identity = this._aspirantesService.getIdentityAspirante() || null;
        this.url = globalUrl.url;

        if (this.aspirante_token !== null) {
            this.showPicture = this.url + 'get-avatar/aspirantes/' + this.aspirante_identity.foto;
            this.showBar = true;
        }
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }
    ngDoCheck(): void {
        const currentToken = this._aspirantesService.getTokenAspirante();
        if (!currentToken && this.aspirante_token) {
            this.aspirante_token = null;
            this.showBar = false;
            this.menuItems();
        } else if (currentToken && !this.aspirante_token) {
            this.aspirante_token = currentToken;
            this.showBar = true;
            this.menuItems();
        }
    }

    menuItems() {
        if (this.aspirante_token) {
            this.iconDinamico.mainlabel = 'Perfil';
            this.iconDinamico.label = 'Logout';
            this.iconDinamico.icon = 'pi pi-user';
        } else {
            this.iconDinamico.mainlabel = 'Inicio de sesión';
            this.iconDinamico.label = 'Login';
            this.iconDinamico.icon = 'pi pi-sign-in';
        }
    }
    ngOnInit() {
        this.menuItems();
        this.items = [
            {
                label: this.iconDinamico.mainlabel,
                items: [
                    {
                        label: this.iconDinamico.label,
                        icon: this.iconDinamico.icon,
                        command: () => {
                            if (this.iconDinamico.label == 'Logout') {
                                this.destroySession();
                            }
                        }
                    }
                ]
            }
        ];
    }

    showDialog() {
        this.showDialogOut.emit(true);
    }
    destroySession() {
        // this._aspirantesService.destroySession();
        let datos = this._aspirantesService.getIdentityAspirante();

        this._cookieService.delete('token', '/aspirantes', 'localhost');
        this._cookieService.delete('identity', '/aspirantes', 'localhost');
        this._cookieService.delete('token', '/users', 'localhost');
        this._cookieService.delete('identity', '/users', 'localhost');

        if (Object.keys(datos).length !== 0) {
            this._router.navigate(['/aspirantes/login-consulta']);
        } else {
            this._router.navigate(['/users/login']);
        }
    }
}
