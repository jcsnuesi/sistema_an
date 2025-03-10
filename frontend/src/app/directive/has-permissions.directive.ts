import { Directive, Input } from '@angular/core';
import { TemplateRef, ViewContainerRef } from '@angular/core';

import { AspirantesService } from '../pages/service/aspirantes.service';
import { UsersService } from '../pages/service/users.service';

@Directive({
    selector: '[appHasPermissions]',
    standalone: true,
    providers: [AspirantesService]
})
export class HasPermissionsDirective {
    public hasRole: string[];
    public identity: any;

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private _aspiranteService: AspirantesService,
        private _userService: UsersService
    ) {
        this.hasRole = [];
        if (Object.keys(this._userService.getIdentity()).length !== 0) {
            this.identity = this._userService.getIdentity().role.role_name;
        } else {
            this.identity = this._aspiranteService.getIdentityAspirante();
        }
    }

    @Input()
    set appHasPermissions(role: string[]) {
        this.hasRole = role;
        this.UpdateView();
    }

    private UpdateView() {
        this.viewContainer.clear();
        if (this.checkRole()) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        }
    }

    private checkRole(): boolean {
        console.log('this.identity', this.identity);
        if (this.identity) {
            if (this.hasRole.includes(this.identity)) {
                return true;
            } else {
                this.viewContainer.clear();
                return false;
            }
        } else {
            this.viewContainer.clear();
            return false;
        }
    }
}
