import { Component, Renderer2, ViewChild, ElementRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
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

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [CommonModule, AppTopbar, AppSidebar, RouterModule, AppFooter, ButtonModule, InputTextModule, InputMaskModule, CardModule, DialogModule, TextareaModule],
    providers: [AspirantesService],
    template: `<div #cambiarClase class="layout-wrapper" [ngClass]="containerClass">
        <app-topbar (showDialogOut)="showDialogMsg($event)"></app-topbar>
        <app-sidebar *ngIf="sidebarVisible"></app-sidebar>
        <div class="layout-main-container">
            <div class="layout-main">
                <router-outlet></router-outlet>
            </div>
            <app-footer></app-footer>
        </div>
        <div class="layout-mask animate-fadein"></div>

        <!-- DIALOG -->
        <p-dialog header="Editar solicitud" [modal]="true" [(visible)]="editarDialog" [style]="{ width: '30rem' }">
            <span class="p-text-secondary block mb-8">En este apartado recibira notificaciones en caso de correcciones en su solicitud.</span>
            <div class="mb-4 mt-4">
                <div class="message-container">
                    <p-card [style]="{ width: '100%', background: '#c1ffdb', 'margin-bottom': '5px' }" class="p-card-dark mb-2 mt-4">
                        <span style="font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif; font-size: 12px; font-weight: 100">message.fecha_hora</span>
                        <p class="texto-derecha">message.comentario</p>
                    </p-card>
                    <div class="mb-4"></div>
                </div>
            </div>
            <div>
                <div class="flex items-center gap-4 mb-8">
                    <label for="email" class="font-semibold w-24">Mensaje:</label>
                    <textarea rows="5" cols="30" pTextarea></textarea>
                </div>
            </div>

            <div class="flex justify-end gap-2">
                <p-button icon="pi pi-send" label="Enviar" />
            </div>
        </p-dialog>
    </div> `
})
export class AppLayout {
    overlayMenuOpenSubscription: Subscription;
    @Input() editarDialog: boolean = false;

    menuOutsideClickListener: any;

    @ViewChild(AppSidebar) appSidebar!: AppSidebar;
    @ViewChild('cambiarClase', { static: true }) cambiarClase!: ElementRef;

    @ViewChild(AppTopbar) appTopBar!: AppTopbar;
    sidebarVisible = true;
    public aspirante_token: string | null;
    public url: string;

    constructor(
        public layoutService: LayoutService,
        public renderer: Renderer2,
        public router: Router,
        private _cookieService: CookieService,
        private _aspirantesService: AspirantesService
    ) {
        this.aspirante_token = this._aspirantesService.getTokenAspirante() || null;
        this.url = globalUrl.url;
        this.router.events.subscribe(() => {
            const currentUrl = this.router.url;
            const hideSidebar = currentUrl.includes('login-consulta') ? true : Boolean(this._cookieService.get('tokenAspirante'));
            console.log('hideSidebar', hideSidebar);
            this.layoutService.toggleSidebar(!hideSidebar);
        });

        this.layoutService.sidebarVisible$.subscribe((visible) => {
            if (!visible) {
                this.renderer.removeClass(this.cambiarClase.nativeElement, 'layout-wrapper');
            }
            this.sidebarVisible = visible;
        });

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
    }

    showDialogMsg(event: boolean) {
        this.editarDialog = event;
    }

    isOutsideClicked(event: MouseEvent) {
        const sidebarEl = document.querySelector('.layout-sidebar');
        const topbarEl = document.querySelector('.layout-menu-button');
        const eventTarget = event.target as Node;

        return !(sidebarEl?.isSameNode(eventTarget) || sidebarEl?.contains(eventTarget) || topbarEl?.isSameNode(eventTarget) || topbarEl?.contains(eventTarget));
    }

    hideMenu() {
        this.layoutService.layoutState.update((prev) => ({ ...prev, overlayMenuActive: false, staticMenuMobileActive: false, menuHoverActive: false }));
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

    ngOnDestroy() {
        if (this.overlayMenuOpenSubscription) {
            this.overlayMenuOpenSubscription.unsubscribe();
        }

        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
        }
    }
}
