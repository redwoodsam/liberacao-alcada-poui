import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Documento } from '../interfaces/documento';
import { DocumentosServiceModel } from '../interfaces/documentosService.model';
import { SaldoModel } from '../interfaces/saldo.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentosService {

  private baseUrl = `${environment.baseUrl}/controlealcada`;

  constructor(private httpClient: HttpClient) { }

  consultaSaldo() {
    return this.httpClient.get<SaldoModel>(`${this.baseUrl}/saldos`);
  }

  getAll(pageNumber: number, pageSize: number, filtrosAplicados: any): Observable<DocumentosServiceModel> {

    return this.httpClient.get<DocumentosServiceModel>(`${this.baseUrl}/consulta/${filtrosAplicados.documentoDe || '%20'}/${filtrosAplicados.documentoAte || '%20'}/${filtrosAplicados.emissaoDe || '%20'}/${filtrosAplicados.emissaoAte || '%20'}/${filtrosAplicados.status || '02'}?page=${pageNumber}&limit=${pageSize}`)
  }

  buscaDocumento(filtrosAplicados: any): Observable<DocumentosServiceModel> {

    return this.httpClient.get<DocumentosServiceModel>(`${this.baseUrl}/consulta/${filtrosAplicados.documentoDe || '%20'}/${filtrosAplicados.documentoAte || '%20'}/${filtrosAplicados.emissaoDe || '%20'}/${filtrosAplicados.emissaoAte || '%20'}/${filtrosAplicados.status || '02'}`)
  }


  // headers: { 'tenantId': `01,${documento.filial}` }
  aprovarDocumento(documento: Documento, motivo: string) {
    return this.httpClient.put(`${this.baseUrl}/aprovar/${documento.filial}/${documento.doc}/${documento.tipo}/${documento.codAprovador}`, { "justificativa": motivo }, { headers: { 'tenantId': `01,${documento.filial}` } });
  }

  rejeitarDocumento(documento: Documento, motivo: string) {
    return this.httpClient.put(`${this.baseUrl}/rejeitar/${documento.filial}/${documento.doc}/${documento.tipo}/${documento.codAprovador}`, { "justificativa": motivo }, { headers: { 'tenantId': `01,${documento.filial}` } })
  }

  estornarDocumento(documento: Documento, motivo: string) {
    return this.httpClient.put(`${this.baseUrl}/estornar/${documento.filial}/${documento.doc}/${documento.tipo}/${documento.codAprovador}`, { "justificativa": motivo }, { headers: { 'tenantId': `01,${documento.filial}` } })
  }

  bloquearDocumento(documento: Documento, motivo: string) {
    return this.httpClient.put(`${this.baseUrl}/bloquear/${documento.filial}/${documento.doc}/${documento.tipo}/${documento.codAprovador}`, { "justificativa": motivo }, { headers: { 'tenantId': `01,${documento.filial}` } })
  }

  transferirDocumentoParaSuperior(documento: Documento, motivo: string) {
    return this.httpClient.put(`${this.baseUrl}/transferirSuperior/${documento.filial}/${documento.doc}/${documento.tipo}/${documento.codAprovador}`, { "justificativa": motivo }, { headers: { 'tenantId': `01,${documento.filial}` } })
  }


}
