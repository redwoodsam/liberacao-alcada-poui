import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PoModalModule, PoModule, PoTableModule, PoTabsModule } from '@po-ui/ng-components';
import { PoPageDynamicSearchModule, PoPageDynamicTableModule, PoTemplatesModule } from '@po-ui/ng-templates';
import { ProtheusLibCoreModule } from '@totvs/protheus-lib-core';
import { DocumentosComponent } from './documentos/documentos.component';
import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { CommonModule } from '@angular/common';
import { SolicitacoesCompraComponent } from './solicitacoes-compra/solicitacoes-compra.component';
import { DocumentosMobileComponent } from './documentos/documentos-mobile/documentos-mobile.component';
import { DocumentosDesktopComponent } from './documentos/documentos-desktop/documentos-desktop.component';
import { CardDocumentoComponent } from './documentos/documentos-mobile/components/card-documento/card-documento.component';



@NgModule({
  declarations: [MainComponent, DocumentosComponent, SolicitacoesCompraComponent, DocumentosMobileComponent, DocumentosDesktopComponent, CardDocumentoComponent],
  imports: [
    CommonModule,
    MainRoutingModule,
    PoModule,
    FormsModule,
    PoTemplatesModule,
    PoTabsModule,
    ProtheusLibCoreModule,
    PoPageDynamicSearchModule,
    PoPageDynamicTableModule,
    PoTableModule,
    PoModalModule,
  ],
  exports: [MainComponent]
})
export class MainModule { }
