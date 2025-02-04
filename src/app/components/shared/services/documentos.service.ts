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

  private baseUrl = 'http://desktop-k38u8fu:8099/rest/controlealcada';
  // private baseUrl = 'http://srv-protheus-homo.ald.com:9945/api/rest/controlealcada';
  private headers = { 'Content-Type': 'application/json' };

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

    let headers = {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${btoa('admin:admin')}`
    }

    console.log(filtrosAplicados)
    
    return this.httpClient.get<DocumentosServiceModel>(`${this.baseUrl}/consulta/${ filtrosAplicados.documentoDe || '%20'}/${ filtrosAplicados.documentoAte }/${filtrosAplicados.emissaoDe || '%20'}/${filtrosAplicados.emissaoAte}/${filtrosAplicados.status}/000001`, { headers: headers })
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
