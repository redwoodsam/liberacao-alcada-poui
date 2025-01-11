import { Route } from '@angular/router';
import { DocumentosComponent } from './components/documentos/documentos.component';

export const ROUTES: Route[] = [
    {
        path: '',
        component:DocumentosComponent 
    },
    {
        path: 'home',
        component:DocumentosComponent 
    },
]