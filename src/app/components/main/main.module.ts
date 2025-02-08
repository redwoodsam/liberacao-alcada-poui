import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PoModalModule, PoModule, PoTableModule, PoTabsModule } from '@po-ui/ng-components';
import { PoPageDynamicSearchModule, PoPageDynamicTableModule, PoTemplatesModule } from '@po-ui/ng-templates';
import { ProtheusLibCoreModule } from '@totvs/protheus-lib-core';
import { AppRoutingModule } from '../../app-routing.module';
import { DocumentosComponent } from './documentos/documentos.component';
import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';



@NgModule({
  declarations: [MainComponent, DocumentosComponent],
  imports: [
    MainRoutingModule,
    BrowserModule,
    AppRoutingModule,
    PoModule,
    FormsModule,
    PoTemplatesModule,
    PoTabsModule,
    ProtheusLibCoreModule,
    PoPageDynamicSearchModule,
    PoPageDynamicTableModule,
    PoTableModule,
    PoModalModule,
    BrowserAnimationsModule,
  ],
  exports: [MainComponent]
})
export class MainModule { }
