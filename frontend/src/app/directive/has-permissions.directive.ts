import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { UsersService } from '../pages/service/users.service';
import { Subscription } from 'rxjs';

@Directive({
    selector: '[appHasPermissions]',
    standalone: true
})
export class HasPermissionsDirective implements OnInit, OnDestroy {
    private requiredRoles: string[] = [];
    private identity: any;
    private subscription!: Subscription;

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private _userService: UsersService,
        private cdRef: ChangeDetectorRef
    ) {
        this.identity = this._userService.getIdentity();
    }

    @Input()
    set appHasPermissions(roles: string[]) {
        this.requiredRoles = roles;
        this.updateView();
    }

    ngOnInit() {
        this.subscription = this._userService.identity$.subscribe((identity) => {
            this.identity = identity;
            this.updateView();
            this.cdRef.detectChanges(); // Forzar detección de cambios
        });
    }

    private updateView() {
        this.viewContainer.clear();

        if (this.hasRequiredRole()) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        }
    }

    private hasRequiredRole(): boolean {
        // console.warn('#######', this.identity);
        return this.identity?.role?.role_name ? this.requiredRoles.includes(this.identity.role.role_name) : false;
    }

    ngOnDestroy() {
        this.subscription?.unsubscribe();
    }
}
