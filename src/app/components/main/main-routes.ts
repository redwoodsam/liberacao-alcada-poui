import { Route } from "@angular/router";
import { DocumentosComponent } from "./documentos/documentos.component";
import { SolicitacoesCompraComponent } from "./solicitacoes-compra/solicitacoes-compra.component";

export const MAIN_ROUTES: Route[] = [
    {
        path: '',
        component: DocumentosComponent
    },
    {
        path: 'liberacao',
        component: DocumentosComponent
    },
    {
        path: 'solicitacoes-compra',
        component: SolicitacoesCompraComponent
    }
]