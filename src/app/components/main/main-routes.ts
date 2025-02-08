import { Route } from "@angular/router";
import { DocumentosComponent } from "./documentos/documentos.component";

export const MAIN_ROUTES: Route[] = [
    {
        path: '',
        component: DocumentosComponent
    },
    {
        path: 'liberacao',
        component: DocumentosComponent
    }
]