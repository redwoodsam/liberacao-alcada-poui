import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Aprovador } from '../interfaces/aprovador.model';
import { DocumentosServiceModel } from '../interfaces/documentosService.model';
import { Saldo } from '../interfaces/saldo.model';

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
            dataEmissao: '10/01/2025',
            valorTotal: 1000,
            dataLiberacao: ' ',
            prazo: '10/01/2025',
            aviso: 'Aviso',
            tipoCompra: 'Tipo Compra',
            itens: [
              {
                id: '1',
                produto: 'Produto 1',
                descricao: 'Descrição do produto 1',
                quantidadeUm1: 10,
                quantidadeUm2: 5,
                valorUnitario: 100,
                valorTotal: 500,
                dataEntrega: '2025-01-15',
                status: 'pendente',
                solicitante: 'Fulano de tal',
                centroCusto: '0102003',
                contaContabil: '0101001',
                necessidade: '10/01/2025',
                os: '200OS',
                observacao: 'Observação do item 1',
                um1: 'unidade',
                um2: 'caixa'
              },
              {
                id: '2',
                produto: 'Produto 2',
                descricao: 'Descrição do produto 2',
                quantidadeUm1: 10,
                quantidadeUm2: 5,
                valorUnitario: 100,
                valorTotal: 500,
                dataEntrega: '2025-01-15',
                status: 'pendente',
                solicitante: 'Fulano de tal',
                centroCusto: '0102003',
                contaContabil: '0101001',
                necessidade: '10/01/2025',
                os: '200OS',
                observacao: 'Observação do item 1',
                um1: 'unidade',
                um2: 'caixa'
              }
            ],
            status: 'pendente'
          },
          {
            id: 'Documento',
            tipoDocumento: 'Tipo Documento',
            codUsuario: 'Cód. Usuario',
            codAprovador: 'Cod. Aprovador',
            grpAprov: 'Grp. Aprov',
            dataEmissao: '10/01/2025',
            valorTotal: 1000,
            dataLiberacao: ' ',
            prazo: '10/01/2025',
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
