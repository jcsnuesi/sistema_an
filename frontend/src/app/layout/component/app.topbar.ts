import { Component, EventEmitter, Output, OnInit, Input, DoCheck, AfterViewInit, OnDestroy } from '@angular/core';
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
import { UsersService } from '../../pages/service/users.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [HasPermissionsDirective, RouterModule, CommonModule, StyleClassModule, BadgeModule, OverlayBadgeModule, ButtonModule, InputTextModule, InputMaskModule, CardModule, DialogModule, MenuModule, ToastModule],
    providers: [AspirantesService, MessageService, CookieService, UsersService],
    template: ` <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button *ngIf="identity" class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
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

                    <button type="button" (click)="showDialog()" *ngIf="aspirante_token || identity">
                        <p-overlaybadge [value]="badgeNotification" class="layout-topbar-action">
                            <i class="pi pi-inbox"></i>
                        </p-overlaybadge>
                    </button>
                    <button (click)="menu.toggle($event)" type="button" class="layout-topbar-action">
                        <i [class]="menuDinamico.icon"></i>
                        <p-toast />
                    </button>

                    <p-menu #menu [model]="items" [popup]="true" />
                </div>
            </div>
        </div>
    </div>`
})
export class AppTopbar implements OnInit, OnDestroy, AfterViewInit, DoCheck {
    items!: MenuItem[];
    public editarDialog: boolean = false;
    public aspirante_token: string | null;
    public url: string;
    public showPicture: string = '';
    public aspirante_identity: any;
    @Input() badgeNotification: number = 0;
    @Output() showDialogOut: EventEmitter<boolean> = new EventEmitter<boolean>();
    public menuDinamico: { icon: string; label: string; mainlabel: string } = { icon: 'pi pi-sign-in', label: 'Login', mainlabel: 'Inicio de sesión' };
    private subscription!: Subscription;
    public identity: any;

    constructor(
        public layoutService: LayoutService,
        private _router: Router,
        private _messageService: MessageService,
        private _cookieService: CookieService,
        private _userService: UsersService
    ) {
        this.aspirante_token = this._cookieService.get('tokenAspirante') || null;
        this.aspirante_identity = this._cookieService.get('identityAspirante') || null;
        this.url = globalUrl.url;

        if (this.aspirante_token !== null) {
            this.showPicture = this.url + 'get-avatar/aspirantes/' + this.aspirante_identity.foto;
        }
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    ngDoCheck(): void {
        this.identity = this._userService.getIdentity();
        this.aspirante_token = this._cookieService.get('tokenAspirante');
    }

    ngOnInit() {
        this.subscription = this._userService.identity$.subscribe((identity) => {
            this.identity = identity;
            this.updateMenu();
        });
    }

    private updateMenu() {
        if (this.identity) {
            this.menuDinamico = { icon: 'pi pi-user', label: 'Logout', mainlabel: 'Perfil' };
        } else {
            this.menuDinamico = { icon: 'pi pi-sign-in', label: 'Login', mainlabel: 'Inicio de sesión' };
        }

        this.items = [
            {
                label: this.menuDinamico.mainlabel,
                items: [
                    {
                        label: this.menuDinamico.label,
                        icon: this.menuDinamico.icon,
                        command: () => this.logout()
                    }
                ]
            }
        ];
    }
    ngAfterViewInit() {
        setTimeout(() => {
            this.updateMenu();
        });
    }

    logout() {
        this._userService.clearIdentity();
        this._router.navigate(['/users/login']);
        this.destroySession();
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }
    showDialog() {
        this.showDialogOut.emit(true);
    }

    destroySession() {
        this._cookieService.delete('tokenAspirante', '/aspirantes', 'localhost');
        this._cookieService.delete('identityAspirante', '/aspirantes', 'localhost');
        this._cookieService.delete('token', '/', 'localhost');
        this._cookieService.delete('identity', '/', 'localhost');
    }
}
