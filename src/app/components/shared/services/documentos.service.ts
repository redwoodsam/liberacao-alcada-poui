import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Aprovador } from '../interfaces/aprovador.model';
import { Documento } from '../interfaces/documento';
import { DocumentosServiceModel } from '../interfaces/documentosService.model';
import { Saldo } from '../interfaces/saldo.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentosService {

  // private baseUrl = 'http://desktop-k38u8fu:8099/rest/controlealcada';
  private baseUrl = 'http://srv-protheus-dv.ald.com:12745/rest/controlealcada';
  private headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InBKd3RQdWJsaWNLZXlGb3IyNTYifQ.eyJpc3MiOiJUT1RWUy1BRFZQTC1GV0pXVCIsInN1YiI6Im1hcmNlbC5hZ3VpYXIiLCJpYXQiOjE3NTAzNTM3NDQsInVzZXJpZCI6IjAwMDAxNiIsImV4cCI6MTc1MDM1NzM0NCwiZW52SWQiOiJQUk9USEVVU19ERVMifQ.HK9par0TJzGj--dJngau1yPs2ko84TNeHizxyQWqcBafOkTDYR78I51pDBvuD6h708F8YEHIr7FcBRVZP_4PamFjWNxraML_7l8Dz7LXG-u8ukx4jW88ndEtQ4TGJcV81gD8d1axooTwNdVAu__9bHNfnFEhQm2awa3-xBLWGr4TZopy2IaX3gCYc19n8431JnR2-7iteCQnOBOX-7eXh8zMVM_X6_IbtmW35SB6Pz8d9OETawxqCurdY6-8p8AL6epxb9qM_iDi92i_Ulqyyzgwp977-9qbtt0rRIX7T3YmZkG4uKuh_Kxj-Ig_dB0dAsJ3aRkDDA1HVPq9wEIDWg' };

  constructor(private httpClient: HttpClient) { }

  consultaSaldo() {
    return of<Saldo>(
      {
        "codAprovador": "TEC001",
        "codUsuario": "000016",
        "nome": "Samuel Araujo",
        "superior": "Fulano de Tal",
        "limite": 15000.00,
        "moeda": "Real",
        "perLimite": "Mensal",
        "login": "samuel.araujo",
        "saldo": 15000.09,
        "dataRef": "25/01/2025",
      }
    )
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

  getSuperior() {
    return of<Saldo>(
      {
        "codAprovador": "TEC001",
        "codUsuario": "000016",
        "nome": "Samuel Araujo",
        "superior": "Fulano de Tal",
        "limite": 15000.00,
        "moeda": "Real",
        "perLimite": "Mensal",
        "login": "samuel.araujo",
        "saldo": 15000.09,
        "dataRef": "25/01/2025",
      }
    )
  }

  getAll(pageNumber: number, filtrosAplicados: any): Observable<DocumentosServiceModel> {

    return this.httpClient.get<DocumentosServiceModel>(`${this.baseUrl}/consulta/${ filtrosAplicados.documentoDe || '%20'}/${ filtrosAplicados.documentoAte }/${filtrosAplicados.emissaoDe || '%20'}/${filtrosAplicados.emissaoAte}/01/marcel.aguiar`, { headers: this.headers })
  }

  rejeitarDocumento(documento: Documento){
    return of('ok')
  }

  aprovarDocumento(documento: Documento){
    return of('ok')
  }

  transferirDocumento(documento: Documento, aprovadorId: string){
    return of('ok')
  }


}
