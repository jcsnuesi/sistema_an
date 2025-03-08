import { Component, EventEmitter, Output, OnInit } from '@angular/core';
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

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator, BadgeModule, OverlayBadgeModule, ButtonModule, InputTextModule, InputMaskModule, CardModule, DialogModule, MenuModule, ToastModule],
    providers: [AspirantesService, MessageService],
    template: ` <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button *ngIf="showBarAdmin" class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
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
                <!--div class="relative" *ngIf="showBar">
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

                    <button type="button" (click)="showDialog()" class="layout-topbar-action" *ngIf="showBar">
                        <p-overlaybadge value="2">
                            <i class="pi pi-inbox text-3xl"></i>
                        </p-overlaybadge>
                    </button>
                    <button (click)="menu.toggle($event)" type="button" class="layout-topbar-action" *ngIf="showBar">
                        <i class="pi pi-user"></i>
                        <p-toast />
                        <p-menu #menu [model]="items" [popup]="true" />
                    </button>
                </div>
            </div>
        </div>
    </div>`
})
export class AppTopbar implements OnInit {
    items!: MenuItem[];
    public editarDialog: boolean = false;
    public aspirante_token: string | null;
    public url: string;
    public showPicture: string = '';
    public aspirante_identity: any;
    public showBar: boolean = true;
    public showBarAdmin: boolean = false;
    @Output() showDialogOut: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(
        public layoutService: LayoutService,
        private _aspirantesService: AspirantesService,
        private _router: Router,
        private _messageService: MessageService
    ) {
        this.aspirante_token = this._aspirantesService.getTokenAspirante() || null;
        this.aspirante_identity = this._aspirantesService.getIdentityAspirante() || null;
        this.url = globalUrl.url;

        if (this.aspirante_token) {
            this.showPicture = this.url + 'get-avatar/aspirantes/' + this.aspirante_identity.foto;
            this.showBar = true;
        }
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }
    ngOnInit() {
        this.items = [
            {
                label: 'Profile',
                items: [
                    {
                        label: 'Logout',
                        icon: 'pi pi-user',
                        command: () => {
                            this.destroySession();
                        },
                        visible: true
                    }
                ]
            }
        ];
    }

    showDialog() {
        this.showDialogOut.emit(true);
    }
    destroySession() {
        this._aspirantesService.destroySession();
        this._router.navigate(['/aspirantes/login-consulta']);
    }
}
