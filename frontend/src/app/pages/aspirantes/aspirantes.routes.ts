import { Routes } from '@angular/router';
import { SolicitudesComponent } from './solicitudes/solicitudes.component';
import { SolicitudesEntrantesComponent } from './solicitudes-entrantes/solicitudes-entrantes.component';
import { ConsultaSolicitudComponent } from './consulta-solicitud/consulta-solicitud.component';
import { ConsultaLoginComponent } from './consulta-login/consulta-login.component';
import { AspirantesComponent } from './aspirantes.component';
import { AspirantesGuard } from '../../guard/aspirantes.guard';

export const aspirantesRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./aspirantes.component').then((m) => m.AspirantesComponent),
        children: [
            { path: 'nueva-solicitud', component: SolicitudesComponent },
            { path: 'entradas-solicitudes', component: SolicitudesEntrantesComponent },
            { path: 'consulta-solicitudes/:id', canActivate: [AspirantesGuard], component: ConsultaSolicitudComponent },
            { path: 'login-consulta', loadComponent: () => import('./consulta-login/consulta-login.component').then((m) => m.ConsultaLoginComponent) },
            { path: '**', redirectTo: 'login-consulta', pathMatch: 'full' },
            { path: '', redirectTo: 'login-consulta', pathMatch: 'full' }
        ]
    }
];
