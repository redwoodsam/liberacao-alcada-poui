import { Route } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { MAIN_ROUTES } from './components/main/main-routes';
import { LoginGuard } from './components/core/auth/login.guard';
import { AuthGuard } from './components/core/auth/auth.guard';

export const ROUTES: Route[] = [
    {
        path: '',
        canActivate: [AuthGuard],
        component: MainComponent,
        loadChildren: () => import('./components/main/main.module').then(m => m.MainModule)

    },
    {
        path: 'login',
        canActivate: [LoginGuard],
        component: LoginComponent
    },
    {
        path: 'home',
        component: MainComponent,
        loadChildren: () => import('./components/main/main.module').then(m => m.MainModule)
    },
    {
        path: '',
        redirectTo: '',
        pathMatch: 'full'
    }
]