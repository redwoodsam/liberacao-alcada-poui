import { Component, OnInit, ViewChild } from '@angular/core';
import { PoChartType, PoDialogService, PoDynamicViewField, PoMenuItem, PoModalAction, PoModalComponent, PoNotificationService, PoPageAction, PoSelectOption, PoTableAction, PoTableColumn } from '@po-ui/ng-components';
import { PoPageDynamicSearchFilters } from '@po-ui/ng-templates';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';
import { Documento, HistoricoDocumento, ItemDocumento } from '../../shared/interfaces/documento';
import { Saldo } from '../../shared/interfaces/saldo.model';
import { DocumentosService } from '../../shared/services/documentos.service';
import { Aprovador } from '../../shared/interfaces/aprovador.model';



@Component({
  selector: 'app-solicitacoes-compra',
  templateUrl: './solicitacoes-compra.component.html',
  styleUrl: './solicitacoes-compra.component.scss'
})
export class SolicitacoesCompraComponent {

  // Paginação
  pageNumber: number = 1;
  pageSize: number = 10;

  // filtros
  filtrosAplicados: string = '';
  filtroBuscaAvancada: Array<PoPageDynamicSearchFilters>;

  // filtros globais
  mostraFiltros = false;

  documentoDe = ""
  documentoAte = "ZZZZZZZZZ"
  emissaoDe = ""
  emissaoAte = `${new Date().getFullYear()}-12-31`
  status = "02"

  // Layout
  opcoesTela: Array<PoPageAction> = [];
  acoesTabela: Array<PoTableAction> = [];

  // Estado global
  edicao = false;
  loading: boolean = false;

  // Tabela
  columns: Array<PoTableColumn> = [];
  documentos: Documento[] = []


  // Documento
  formularioDocumento: Array<PoDynamicViewField> = [];
  documentoSelecionado: Documento = {} as Documento;



  @ViewChild(PoModalComponent) modalDocumento: any;

  constructor(private documentosService: DocumentosService, private poNotificationService: PoNotificationService, private poDialogService: PoDialogService ) {
    this.filtroBuscaAvancada = this.constroiBuscaAvançada();
    this.columns = this.constroiColunas();
    this.acoesTabela = this.constroiAcoesTabela();
    this.opcoesTela = this.constroiAcoesTela();
  }

  ngOnInit(): void {
    this.getItens(1);
    // this.getSaldo();
    // this.getAprovadores()
    // this.getSuperiores()
  }


  /**
   * Construção dos elementos da tela
  */


  constroiAcoesTabela(): PoPageAction[] {
    return [
      { label: 'Visualizar', action: this.abrirDocumento.bind(this), icon: 'po-icon-eye' },
      // { label: 'Transferir para', action: this.abrirModalTransferencia.bind(this), icon: 'po-icon-arrow-right' },
    ]
  }

  constroiAcoesTela(): PoPageAction[] {
    return [
      { label: 'Nova Solicitação', action: () => {}, icon: 'po-icon-plus' },
    ]
  }

  //01=Aguardando nivel anterior;02=Pendente;03=Liberado;04=Bloqueado;05=Liberado outro aprov.;06=Rejeitado;07=Rej/Bloq outro aprov.
  constroiColunas(): PoTableColumn[] {
    return [
      {
        property: 'status', type: 'subtitle', label: 'Status', subtitles: [
          { value: '02', content: '', label: 'Pendente', color: 'color-08' },
          { value: '03', content: '', label: 'Aprovada', color: 'color-10' },
          { value: '06', content: '', label: 'Rejeitada', color: 'color-07' },
          { value: '04', content: '', label: 'Bloqueada', color: 'color-04' },
        ]
      },
      { property: 'id', label: 'ID' },
      { property: 'doc', label: 'Documento' },
      { property: 'tipoDocumento', label: 'Tipo Documento' },
      { property: 'codUsuario', label: 'Cód. Usuario' },
      // { property: 'codAprovador', label: 'Cod. Aprovador' },
      { property: 'grpAprov', label: 'Grp. Aprov' },
      { property: 'dataEmissao', label: 'Data Emissão' },
      { property: 'valorTotal', label: 'Valor total', type: 'currency' },
      { property: 'dataLiberacao', label: 'Data Liberação' },
      { property: 'prazo', label: 'Prazo' },
      { property: 'aviso', label: 'Aviso' },
      { property: 'msg', label: 'Mensagem' },
      { property: 'tipoCompra', label: 'Tipo Compra' },

    ];

  }


  constroiBuscaAvançada(): PoPageDynamicSearchFilters[] {
    return [
      { property: 'emissaoDe'   , label: 'Emissão de: '   , type: 'date'  , gridColumns: 12 },
      { property: 'emissaoAte'  , label: 'Emissão até: '  , type: 'date'  , gridColumns: 12 },
      { property: 'documentoDe' , label: 'Documento de: ' , type: 'string', gridColumns: 12 },
      { property: 'documentoAte', label: 'Documento até: ', type: 'string', gridColumns: 12 },
      { property: 'status'      , label: 'Status: '       , type: 'string', options: [
          { value: '02', label: 'Pendente'  },
          { value: '03', label: 'Aprovada'  },
          { value: '06', label: 'Rejeitada' },
          { value: '04', label: 'Bloqueada' },
        ]
      },
    ];
  }

  /************************************************************/




  getItens(pageNumber: number = 1) {
    this.loading = true;

    if (pageNumber === 1) this.documentos = [];

    this.documentosService
      .getAll(pageNumber, { documentoDe: this.documentoDe, documentoAte: this.documentoAte, emissaoDe: this.emissaoDe, emissaoAte: this.emissaoAte, status: this.status })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        console.log(res);
        this.documentos = this.documentos.concat(res.Itens);
        this.loading = false;
      }, (error) => {
        this.poNotificationService.error(error)
      });
  }


  formatarTituloItem(item: ItemDocumento) {
    return `${item.produto} - ${item.descricao}`
  }


  abrirDocumento(documento: any) {
    this.documentoSelecionado = documento;
    this.modalDocumento?.open()
  }


  buscaDocumento(documento: string): void {

    if(documento) {
      this.documentoDe = documento;
      this.documentoAte = documento;
    } else {
      this.documentoDe = " ";
      this.documentoAte = "ZZZZZZZZZ";
    }


    this.getItens(this.pageNumber);
  }


  carregarMais(): void {
    this.pageNumber++;
    this.getItens(this.pageNumber);
    console.log(this.filtrosAplicados);
  }


  realizaBuscaAvancada(retornoBuscaAvancada: {
    [key: string]: any;
  }): void {

    this.documentoDe = retornoBuscaAvancada['documentoDe'] 
    this.documentoAte = retornoBuscaAvancada['documentoAte'] 
    this.emissaoDe = retornoBuscaAvancada['emissaoDe'] 
    this.emissaoAte = retornoBuscaAvancada['emissaoAte'] 

    if (!retornoBuscaAvancada['documentoDe']) {
      this.documentoDe = " "
    }

    if (!retornoBuscaAvancada['documentoAte']) {
      this.documentoAte = "ZZZZZZZZZ"
    }

    if (!retornoBuscaAvancada['emissaoDe']) {
      this.emissaoDe = " "
    }

    if (!retornoBuscaAvancada['emissaoAte']) {
      this.emissaoAte = `${new Date().getFullYear()}-12-31`
    }

    if (!retornoBuscaAvancada['status']) {
      this.emissaoAte = `03`
    }

    this.pageNumber = 1;
    this.getItens();
  }


  // Executado quando é removido os filtros da busca avançada
  clickDisclaimers(disclaimers: any[]) {
    this.pageNumber = 1;
    console.log(disclaimers);

    if (!disclaimers.some(disclaimer => disclaimer.property === 'documentoDe')) this.documentoDe = " "
    if (!disclaimers.some(disclaimer => disclaimer.property === 'documentoAte')) this.documentoAte = "ZZZZZZZZZ"
    if (!disclaimers.some(disclaimer => disclaimer.property === 'emissaoDe')) this.emissaoDe = " "
    if (!disclaimers.some(disclaimer => disclaimer.property === 'emissaoAte')) this.emissaoAte = `${new Date().getFullYear()}-12-31`
    if (!disclaimers.some(disclaimer => disclaimer.property === 'status')) this.status = "02"

    this.getItens();
  }
}