import { Routes } from '@angular/router';
import { UserLoginComponent } from './user-login/user-login.component';
import { Dashboard } from '../dashboard/dashboard';
import { UserGuard } from '../../guard/user.guard';
import { NoIdentityGuard } from '../../guard/no.identity.guard';

export const usersRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./users.component').then((m) => m.UsersComponent),

        children: [{ path: 'login', canActivate: [NoIdentityGuard], component: UserLoginComponent }]
    }
];
