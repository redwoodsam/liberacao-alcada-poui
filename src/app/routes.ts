import { Route } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { MAIN_ROUTES } from './components/main/main-routes';

export const ROUTES: Route[] = [
    {
        path: '',
        component: MainComponent, 
        loadChildren: () => import('./components/main/main.module').then(m => m.MainModule)
        
    },
    {
        path: 'login',
        component:LoginComponent 
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