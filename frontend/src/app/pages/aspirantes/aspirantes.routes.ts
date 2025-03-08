import { Routes } from '@angular/router';
import { SolicitudesComponent } from './solicitudes/solicitudes.component';
import { SolicitudesEntrantesComponent } from './solicitudes-entrantes/solicitudes-entrantes.component';
import { ConsultaSolicitudComponent } from './consulta-solicitud/consulta-solicitud.component';
import { ConsultaLoginComponent } from './consulta-login/consulta-login.component';
import { AspirantesGuard } from '../../guard/aspirantes.guard';
import { UserGuard } from '../../guard/user.guard';

export default [
    { path: 'nueva-solicitud', component: SolicitudesComponent },
    { path: 'entradas-solicitudes', component: SolicitudesEntrantesComponent },
    { path: 'consulta-solicitudes/:id', canActivate: [AspirantesGuard], component: ConsultaSolicitudComponent },
    { path: 'login-consulta', component: ConsultaLoginComponent },
    { path: '**', redirectTo: '/login-consulta', pathMatch: 'full' },
    { path: '', redirectTo: '/login-consulta', pathMatch: 'full' }
] as Routes;
