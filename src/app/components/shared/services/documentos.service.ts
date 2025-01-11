import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DocumentosServiceModel } from '../interfaces/documentosService.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentosService {

  private baseUrl = 'http://localhost:3000/documentos';
  private headers = { 'Content-Type': 'application/json' };

  constructor(private httpClient: HttpClient) { }

  /* 
      { 'id', 'Documento', 
      { 'tipo-documento', 'Tipo Documento', 
      { 'cod-usuario', 'Cód. Usuario', 
      { 'cod-aprovador', 'Cod. Aprovador', 
      { 'grp-aprov', 'Grp. Aprov', 
      { 'data-emissao', 'Data Emissão', 
      { 'valor-total', 'Valor total', 
      { 'data-liberacao', 'Data Liberação', 
      { 'prazo', 'Prazo', 
      { 'aviso', 'Aviso', 
      { 'tipo-compra', 'Tipo Compra', 
  */

  getAll(pageNumber: number, filtrosAplicados: string): Observable<DocumentosServiceModel> {
    // return this.httpClient.get(`${this.baseUrl}/${categoria}`, { headers: this.headers });
    return of<DocumentosServiceModel>(
      {
        items: [
          {
            id: 'Documento',
            tipoDocumento: 'Tipo Documento',
            codUsuario: 'Cód. Usuario',
            codAprovador: 'Cod. Aprovador',
            grpAprov: 'Grp. Aprov',
            dataEmissao: '2025-01-10',
            valorTotal: 1000,
            dataLiberacao:  ' ',
            prazo: '2025-01-10',
            aviso: 'Aviso',
            tipoCompra: 'Tipo Compra',
            status: 'pendente'
          },
          {
            id: 'Documento',
            tipoDocumento: 'Tipo Documento',
            codUsuario: 'Cód. Usuario',
            codAprovador: 'Cod. Aprovador',
            grpAprov: 'Grp. Aprov',
            dataEmissao: '2025-01-10',
            valorTotal: 1000,
            dataLiberacao:  ' ',
            prazo: '2025-01-10',
            aviso: 'Aviso',
            tipoCompra: 'Tipo Compra',
            status: 'pendente'
          },
        ],
      hasNext: false
      }
    )
}


}
