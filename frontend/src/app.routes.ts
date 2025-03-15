import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { AspirantesGuard } from './app/guard/aspirantes.guard';
import { UserGuard } from './app/guard/user.guard';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            { path: '', canActivate: [UserGuard], component: Dashboard },
            { path: 'home', canActivate: [UserGuard], component: Dashboard },
            { path: 'aspirantes', loadChildren: () => import('./app/pages/aspirantes/aspirantes.routes').then((m) => m.aspirantesRoutes) },
            { path: 'users', loadChildren: () => import('./app/pages/users/users.routes').then((m) => m.usersRoutes) }
        ]
    },
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
