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

  getAll(pageNumber: number, filtrosAplicados: string): Observable<DocumentosServiceModel> {
    // return this.httpClient.get(`${this.baseUrl}/${categoria}`, { headers: this.headers });
    return of<DocumentosServiceModel>(
      {
        items:[
      {
        id: "11",
        data: "2021-07-01",
        fornecedor: "Fornecedor 1",
        produto: "Produto 1",
        quantidade: 10,
        valor: 100.00,
        contrato: "11111",
        status: "pendente",
      }
    ],
    hasNext: false
  }
  )
  }


}
