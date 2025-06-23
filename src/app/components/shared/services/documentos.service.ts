import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Aprovador } from '../interfaces/aprovador.model';
import { Documento } from '../interfaces/documento';
import { DocumentosServiceModel } from '../interfaces/documentosService.model';
import { Saldo, SaldoModel } from '../interfaces/saldo.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentosService {

  private baseUrl = `${environment.baseUrl}/controlealcada`;

  constructor(private httpClient: HttpClient) { }

  consultaSaldo() {
    return this.httpClient.get<SaldoModel>(`${this.baseUrl}/saldos`);
  }

  getAprovadores() {
    return of<Aprovador[]>(
      [
        {
          codAprovador: "TEC001",
          nome: "Fulano"
        },
        {
          codAprovador: "TEC002",
          nome: "Ciclano"
        },
      ]
    )
  }

  getSuperiores() {
    return of<Aprovador[]>(
      [
        {
          codAprovador: "TEC001",
          nome: "Fulano"
        },
        {
          codAprovador: "TEC002",
          nome: "Ciclano"
        },
      ]
    )
  }

  // getSuperior() {
  //   return of<Saldo>(
  //     {
  //       "codAprovador": "TEC001",
  //       "codUsuario": "000016",
  //       "nome": "Samuel Araujo",
  //       "superior": "Fulano de Tal",
  //       "limite": 15000.00,
  //       "moeda": "Real",
  //       "perLimite": "Mensal",
  //       "login": "samuel.araujo",
  //       "saldo": 15000.09,
  //       "dataRef": "25/01/2025",
  //     }
  //   )
  // }

  getAll(pageNumber: number, filtrosAplicados: any): Observable<DocumentosServiceModel> {

    return this.httpClient.get<DocumentosServiceModel>(`${this.baseUrl}/consulta/${filtrosAplicados.documentoDe || '%20'}/${filtrosAplicados.documentoAte || '%20'}/${filtrosAplicados.emissaoDe || '%20'}/${filtrosAplicados.emissaoAte || '%20'}/${filtrosAplicados.status || '02'}`)
  }


  // headers: { 'tenantId': `01,${documento.filial}` }
  aprovarDocumento(documento: Documento) {
    return this.httpClient.put(`${this.baseUrl}/aprovar/${documento.filial}/${documento.doc}/${documento.tipo}`, {}, { headers: { 'tenantId': `01,${documento.filial}` } });
  }

  rejeitarDocumento(documento: Documento, motivo: string) {
    return this.httpClient.put(`${this.baseUrl}/rejeitar/${documento.filial}/${documento.doc}/${documento.tipo}`, { "justificativa": motivo }, { headers: { 'tenantId': `01,${documento.filial}` } })
  }

  estornarDocumento(documento: Documento, motivo: string) {
    return this.httpClient.put(`${this.baseUrl}/estornar/${documento.filial}/${documento.doc}/${documento.tipo}`, { "justificativa": motivo }, { headers: { 'tenantId': `01,${documento.filial}` } })
  }

  bloquearDocumento(documento: Documento, motivo: string) {
    return this.httpClient.put(`${this.baseUrl}/bloquear/${documento.filial}/${documento.doc}/${documento.tipo}`, { "justificativa": motivo }, { headers: { 'tenantId': `01,${documento.filial}` } })
  }

  transferirDocumentoParaSuperior(documento: Documento, motivo: string) {
    return this.httpClient.put(`${this.baseUrl}/transferirSuperior/${documento.filial}/${documento.doc}/${documento.tipo}`, { "justificativa": motivo }, { headers: { 'tenantId': `01,${documento.filial}` } })
  }


}
