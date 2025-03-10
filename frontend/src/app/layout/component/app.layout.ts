import { Component, Renderer2, ViewChild, ElementRef, Input, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule, ActivatedRoute } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { AppTopbar } from './app.topbar';
import { AppSidebar } from './app.sidebar';
import { AppFooter } from './app.footer';
import { LayoutService } from '../service/layout.service';
import { CookieService } from 'ngx-cookie-service';
import { globalUrl } from '../../pages/service/global.url';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { AspirantesService } from '../../pages/service/aspirantes.service';
import { TextareaModule } from 'primeng/textarea';
import { HasPermissionsDirective } from '../../directive/has-permissions.directive';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [HasPermissionsDirective, CommonModule, AppTopbar, AppSidebar, RouterModule, AppFooter, ButtonModule, InputTextModule, InputMaskModule, CardModule, DialogModule, TextareaModule],
    providers: [AspirantesService],
    template: `
        <div #cambiarClase class="layout-wrapper" [ngClass]="containerClass">
            <app-topbar (showDialogOut)="showDialogMsg($event)" [badgeNotification]="badged"></app-topbar>
            <app-sidebar *appHasPermissions="['SUPER_ADMIN', 'ADMIN', 'USUARIO']"></app-sidebar>
            <div class="layout-main-container">
                <div class="layout-main">
                    <router-outlet></router-outlet>
                </div>
                <app-footer></app-footer>
            </div>
            <div class="layout-mask animate-fadein"></div>

            <!-- DIALOG -->
            <p-dialog header="Editar solicitud" [modal]="true" (onHide)="updateNotificationBadged()" [(visible)]="editarDialog" [style]="{ width: '30rem' }">
                <span class="p-text-secondary block mb-8">En este apartado recibira notificaciones en caso de correcciones en su solicitud.</span>
                <div class="mb-4 mt-4" *ngIf="messageObservaciones.length != 0">
                    <div class="message-container">
                        <p-card [style]="{ width: '100%', background: '#c1ffdb', 'margin-bottom': '5px' }" class="p-card-dark mb-2 mt-4" *ngFor="let message of messageObservaciones">
                            <span style="font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif; font-size: 12px; font-weight: 100">{{ message.fecha_hora }} </span>
                            <p class="texto-derecha">
                                {{ message.comentario }}
                            </p>
                        </p-card>
                        <div class="mb-4"></div>
                    </div>
                </div>
            </p-dialog>
        </div>
    `
})
export class AppLayout implements AfterViewInit {
    overlayMenuOpenSubscription: Subscription;
    @Input() editarDialog: boolean = false;

    menuOutsideClickListener: any;

    @ViewChild(AppSidebar) appSidebar!: AppSidebar;
    @ViewChild('cambiarClase', { static: true }) cambiarClase!: ElementRef;

    @ViewChild(AppTopbar) appTopBar!: AppTopbar;
    sidebarVisibleElement = true;
    public aspirante_token: string;
    public aspirante_identity: any;
    public url: string;
    public urlParam: string;
    public messageObservaciones: Array<{ comentario: string; fecha_hora: string; atentido: number; id: number; aspiranteId: number }> = [];
    public badged: number = 0;

    constructor(
        public layoutService: LayoutService,
        public renderer: Renderer2,
        public router: Router,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _cookieService: CookieService,
        private _aspirantesService: AspirantesService
    ) {
        this.aspirante_token = this._aspirantesService.getTokenAspirante();
        this.aspirante_identity = this._aspirantesService.getIdentityAspirante();
        this.url = globalUrl.url;
        this.urlParam = '';

        this.overlayMenuOpenSubscription = this.layoutService.overlayOpen$.subscribe(() => {
            if (!this.menuOutsideClickListener) {
                this.menuOutsideClickListener = this.renderer.listen('document', 'click', (event) => {
                    if (this.isOutsideClicked(event)) {
                        this.hideMenu();
                    }
                });
            }

            if (this.layoutService.layoutState().staticMenuMobileActive) {
                this.blockBodyScroll();
            }
        });

        this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
            this.hideMenu();
        });

        this.router.events.subscribe(() => {
            const currentUrl = this.router.url;
            // console.log('currentUrl', currentUrl);
            const hideSidebar = currentUrl.includes('login-consulta');
            this.layoutService.toggleSidebar(hideSidebar);
        });
    }

    showDialogMsg(event: boolean) {
        this.editarDialog = event;
    }
    ngAfterViewInit() {
        if (this.cambiarClase) {
            setTimeout(() => {
                this.layoutService.sidebarVisible$.subscribe((visible) => {
                    console.log('hideSidebar', visible);
                    if (visible) {
                        this.renderer.removeClass(this.cambiarClase.nativeElement, 'layout-wrapper');
                        // console.log('removeClass....', visible);
                    } else {
                        this.renderer.addClass(this.cambiarClase.nativeElement, 'layout-wrapper');
                        // console.log('agregandoooo....', visible);
                    }

                    if (Boolean(this.aspirante_token)) {
                        this.getObservaciones();
                    }
                });
            });
        } else {
            console.warn('cambiarClase no está inicializado');
        }
    }

    isOutsideClicked(event: MouseEvent) {
        const sidebarEl = document.querySelector('.layout-sidebar');
        const topbarEl = document.querySelector('.layout-menu-button');
        const eventTarget = event.target as Node;

        return !(sidebarEl?.isSameNode(eventTarget) || sidebarEl?.contains(eventTarget) || topbarEl?.isSameNode(eventTarget) || topbarEl?.contains(eventTarget));
    }

    hideMenu() {
        this.layoutService.layoutState.update((prev: any) => ({ ...prev, overlayMenuActive: false, staticMenuMobileActive: false, menuHoverActive: false }));
        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
            this.menuOutsideClickListener = null;
        }
        this.unblockBodyScroll();
    }

    blockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.add('blocked-scroll');
        } else {
            document.body.className += ' blocked-scroll';
        }
    }

    unblockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.remove('blocked-scroll');
        } else {
            document.body.className = document.body.className.replace(new RegExp('(^|\\b)' + 'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }

    get containerClass() {
        return {
            'layout-overlay': this.layoutService.layoutConfig().menuMode === 'overlay',
            'layout-static': this.layoutService.layoutConfig().menuMode === 'static',
            'layout-static-inactive': this.layoutService.layoutState().staticMenuDesktopInactive && this.layoutService.layoutConfig().menuMode === 'static',
            'layout-overlay-active': this.layoutService.layoutState().overlayMenuActive,
            'layout-mobile-active': this.layoutService.layoutState().staticMenuMobileActive
        };
    }

    updateNotificationBadged() {
        if (this.messageObservaciones.length == 0) {
            return;
        }
        let data = this.messageObservaciones.map((item) => {
            return {
                id: item.id,
                atentido: 1,
                aspiranteId: item.aspiranteId
            };
        });
        console.log('data', data);

        this._aspirantesService.updateBadge(this.aspirante_token, data[0]).subscribe({
            next: (response) => {
                if (response.status == 'success') {
                    this.badged = 0;
                }
            },
            error: (error) => {
                console.log('error', error);
            }
        });
        console.log('cerrando dialog');
    }

    getObservaciones() {
        const id = this.aspirante_identity.id;
        this._aspirantesService.getObservacionesById(this.aspirante_token, id).subscribe({
            next: (response) => {
                if (response.status == 'success') {
                    for (let i = 0; i < response.message.length; i++) {
                        if (response.message[i].atentido == 0) {
                            this.badged++;
                        }
                        this.messageObservaciones.push({
                            comentario: response.message[i].observacion,
                            fecha_hora: new Date(response.message[i].fecha_creacion).toLocaleString(),
                            atentido: response.message[i].atentido,
                            id: response.message[i].id,
                            aspiranteId: response.message[i].id_aspirantes
                        });
                    }
                }
            },
            error: (error) => {
                console.log('error', error);
            }
        });
    }

    ngOnDestroy() {
        if (this.overlayMenuOpenSubscription) {
            this.overlayMenuOpenSubscription.unsubscribe();
        }

        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
        }
    }
}
