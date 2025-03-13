import { Component } from '@angular/core';
import { NotificationsWidget } from './components/notificationswidget';
import { StatsWidget } from './components/statswidget';
import { RecentSalesWidget } from './components/recentsaleswidget';
import { BestSellingWidget } from './components/bestsellingwidget';
import { RevenueStreamWidget } from './components/revenuestreamwidget';
import { UsersService } from '../service/users.service';
import { AspirantesService } from '../service/aspirantes.service';

@Component({
    selector: 'app-dashboard',
    imports: [StatsWidget],
    providers: [UsersService, AspirantesService],
    template: `
        <div class="grid grid-cols-12 gap-8">
            <app-stats-widget [totalNotificaciones]="totals" class="contents" />
        </div>
    `
})
export class Dashboard {
    public totals: { total: number; sinLeer: number } = { total: 0, sinLeer: 0 };
    private token: string | null;
    constructor(
        private _aspirantesService: AspirantesService,
        private _usersService: UsersService
    ) {
        this.token = this._usersService.gettoken();

        setInterval(() => {
            this.getDataCard();
        }, 50000);
        this.getDataCard();
    }

    getDataCard() {
        this._aspirantesService.getNuevosAspirantes(this.token).subscribe(
            (response) => {
                this.totals.total = response.message.length;
                let estado = response.message.map((item: any) => {
                    let fact = item.fact_aspirantes.filter((fact: any) => fact.estatus_solicitud === 'Requiere Edición');
                    return fact.length;
                });
                this.totals.sinLeer = estado.filter((item: any) => item > 0).length;
            },
            (error) => {
                console.error(error);
            }
        );
    }
}
