import { Component, OnInit, ViewChild } from '@angular/core';
import { PoDialogService, PoDynamicViewField, PoModalComponent, PoNotificationService, PoPageAction, PoTableAction, PoTableColumn } from '@po-ui/ng-components';
import { PoPageDynamicSearchFilters } from '@po-ui/ng-templates';
import { finalize } from 'rxjs';
import { Aprovador } from '../shared/interfaces/aprovador.model';
import { Documento, ItemDocumento } from '../shared/interfaces/documento';
import { Saldo } from '../shared/interfaces/saldo.model';
import { DocumentosService } from '../shared/services/documentos.service';

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
  styleUrl: './documentos.component.scss'
})
export class DocumentosComponent implements OnInit {

  // Paginação
  pageNumber: number = 1;
  pageSize: number = 10;

  // filtros
  filtrosAplicados: string = '';
  filtroBuscaAvancada: Array<PoPageDynamicSearchFilters>;
  selectedTab = 'pendentes';

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
  itemsDocumentoSelecionado: ItemDocumento[] = [];

  // Saldos
  saldoAtual: Saldo = {} as Saldo;
  formularioSaldo: Array<PoDynamicViewField> = [];

  // Aprovadores
  aprovadores: Aprovador[] =  []
  superiores:  Aprovador[] =  []



  @ViewChild(PoModalComponent) modalDocumento: any;
  @ViewChild('modalItens') modalItens: any;
  @ViewChild('modalSaldos') modalSaldos: any;
  @ViewChild('modalTransferencia') modalTransferencia: any;
  


  constructor(private documentosService: DocumentosService, private poNotificationService: PoNotificationService, private poDialogService: PoDialogService) {
    this.filtroBuscaAvancada = this.constroiBuscaAvançada();
    this.columns = this.constroiColunas();
    this.acoesTabela = this.constroiAcoesTabela();
    this.opcoesTela = this.constroiAcoesTela();
    this.formularioDocumento = this.constroiFormularioVisuDocumanto();
    this.formularioSaldo = this.constroiFormularioSaldos()
  }

  ngOnInit(): void {
    this.getItens(1);
    this.getSaldo();
  }


  /**
   * Construção dos elementos da tela
  */

  constroiFormularioVisuDocumanto(): PoDynamicViewField[] {
    return [
      {
        property: 'id',
        label: 'Documento',
        // divider: 'Dados do Documento',
        container: 'Dados do Documento',
        gridColumns: 3,
        order: 1
      },
      {
        property: 'valorTotal',
        label: 'Valor Total',
        type: 'currency',
        gridColumns: 2
      },
      {
        property: 'dataEmissao',
        label: 'Data Emissão',
        type: 'date',
        gridColumns: 2
      },
      {
        property: 'moeda',
        label: 'Moeda',
        gridColumns: 2
      },
      {
        property: 'dataLiberacao',
        label: 'Data Liberação',
        gridColumns: 2,
      },
      {
        property: 'observacoes',
        label: 'Observações',
        gridColumns: 12
      },
    ];
  }


  /*
  {
    "codAprovador": "TEC001",
    "codUsuario": "000016",
    "nome": "Samuel Araujo",
    "superior": {
        "codUsuario": "000003",
        "nome": "Fulano de Tal",
    },
    "limite": 15000.00,
    "moeda": "Real",
    "perLimite": "Mensal",
    "login": "samuel.araujo",
    "saldo": {
        "valor": 15000.00,
        "dataRef": "2025-01-15",
        "moeda": "Real"
    }
}
  */

  constroiFormularioSaldos(): PoDynamicViewField[] {
    return [
      {
        property: 'codUsuario',
        label: 'Usuário',
        type: 'string',
        gridColumns: 3
      },
      {
        property: 'nome',
        label: 'Usuário',
        type: 'string',
        gridColumns: 3
      },
      {
        property: 'superior.nome',
        label: 'Superior',
        type: 'string',
        gridColumns: 3
      },
      {
        property: 'limite',
        label: 'Limite',
        type: 'currency',
        gridColumns: 3
      },
      {
        property: 'moeda',
        label: 'Moeda',
        type: 'string',
        gridColumns: 3
      },
      {
        property: 'perLimite',
        label: 'Per. Limite',
        type: 'string',
        gridColumns: 3
      },
      {
        property: 'login',
        label: 'Login',
        type: 'string',
        gridColumns: 3
      },
      {
        property: 'saldo',
        label: 'Saldo',
        type: 'string',
        gridColumns: 3
      },
      {
        property: 'saldo.dataRef',
        label: 'Data Ref.',
        type: 'date',
        gridColumns: 3
      },
      {
        property: 'saldo.moeda',
        label: 'Moeda',
        type: 'string',
        gridColumns: 3
      },
    ];
  }

  constroiAcoesTabela(): PoPageAction[] {
    return [
      { label: 'Visualizar', action: this.abrirDocumento.bind(this), icon: 'po-icon-eye' },
      { label: 'Aprovar', action: this.abrirConfirmacaoAprovacao.bind(this), icon: 'po-icon-ok' },
      { label: 'Recusar', action: this.abrirConfirmacaoRecusa.bind(this), icon: 'po-icon-close' },
      { label: 'Transferir para', action: this.abrirModalTransferencia.bind(this), icon: 'po-icon-arrow-right' },
    ]
  }

  constroiAcoesTela(): PoPageAction[] {
    return [
      { label: 'Ver Saldo', action: this.abrirModalSaldos.bind(this), icon: 'po-icon-eye' },
    ]
  }

  constroiColunas(): PoTableColumn[] {
    return [
      { property: 'id', label: 'Documento' },
      { property: 'tipoDocumento', label: 'Tipo Documento' },
      { property: 'codUsuario', label: 'Cód. Usuario' },
      { property: 'codAprovador', label: 'Cod. Aprovador' },
      { property: 'grpAprov', label: 'Grp. Aprov' },
      { property: 'dataEmissao', label: 'Data Emissão' },
      { property: 'valorTotal', label: 'Valor total' },
      { property: 'dataLiberacao', label: 'Data Liberação' },
      { property: 'prazo', label: 'Prazo' },
      { property: 'aviso', label: 'Aviso' },
      { property: 'tipoCompra', label: 'Tipo Compra' },

    ];

  }

  constroiBuscaAvançada(): PoPageDynamicSearchFilters[] {
    return [
      { property: 'emissao-de',    label: 'Emissão de: ', type: 'date', gridColumns: 12 },
      { property: 'emissao-ate',   label: 'Emissão até: ',type: 'date', gridColumns: 12 },
      { property: 'documento-de',  label: 'Documento de: ',type: 'string', gridColumns: 12 },
      { property: 'documento-ate', label: 'Documento até: ',type: 'string', gridColumns: 12 },
      {
        property: 'status',
        options: [
          { value: 'todos',      label: 'Todos'      },
          { value: 'pendentes',  label: 'Pendentes'  },
          { value: 'aprovados',  label: 'Aprovados'  },
          { value: 'recusados',  label: 'Recusados'  },
          { value: 'bloqueados', label: 'Bloqueados' },
        ],
      },
      {
        property: 'tipo',
        options: [
          { value: 'PA', label: 'PA' },
          { value: 'PI', label: 'PI' },
          { value: 'MP', label: 'MP' },
          { value: 'KT', label: 'KT' },
          { value: 'EM', label: 'EM' },
        ],
      },
    ];
  }

  /************************************************************/


  switchTab(tab: string) {
    this.selectedTab = tab;
    this.getItens(1)
  }


  abrirDocumento(documento: any) {
    this.documentoSelecionado = documento;
    this.modalDocumento?.open()
  }

  abrirModalSaldos() {
    this.modalSaldos?.open()
  }

  abrirModalTransferencia() {
    this.modalTransferencia?.open()
  }

  getSaldo() {
    this.loading = true
    this.documentosService.consultaSaldo()
      .subscribe((res) => {
        this.saldoAtual = res
        this.loading = false;
      }, (error) => {
        this.poNotificationService.error(error)
      });
  }

  getItens(pageNumber: number = 1) {
    this.loading = true;

    if (pageNumber === 1) this.documentos = [];

    this.documentosService
      .getAll(pageNumber, this.filtrosAplicados)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        this.documentos = this.documentos.concat(res.items);
        this.loading = false;
      }, (error) => {
        this.poNotificationService.error(error)
      });
  }


  abrirItensDocumento(documento: Documento) {
    // console.log('Abrindo itens documento: ', documento);
    this.itemsDocumentoSelecionado = documento.itens as ItemDocumento[];
    this.modalItens.open();
  }

  formatarTituloItem(item: ItemDocumento) {
    return `Item ${item.id} - ${item.produto} - ${item.descricao}`
  }


  abrirConfirmacaoAprovacao(documento: Documento) {
    this.poDialogService.confirm({
      title: 'Aprovação',
      message: `Confirma aprovação do documento ${documento.id} ?`,
      confirm: () => this.aprovarDocumento(documento),
      literals: {cancel: "Não", confirm: 'Sim'},
    })
  }

  abrirConfirmacaoRecusa(documento: Documento) {
    this.poDialogService.confirm({
      title: 'Recusa',
      message: `Confirma Recusa do documento ${documento.id} ?`,
      confirm: () => this.rejeitarDocumento(documento),
      literals: {cancel: "Não", confirm: 'Sim'},
    })
  }

  aprovarDocumento(documento: Documento) {
    console.log("Aprovação do documento: " + documento.id)
    this.poNotificationService.success("Documento Aprovado com Sucesso!")

    if(!this.modalDocumento.isHidden) {
      this.modalDocumento?.close()
    }
    
  }

  rejeitarDocumento(documento: Documento) {
    console.log("Recusa do documento: " + documento.id)
    this.poNotificationService.success("Documento Recusado com Sucesso!")

    if(!this.modalDocumento.isHidden) {
      this.modalDocumento?.close()
    }
  }

  buscaDocumento(documento: string): void {
    this.filtrosAplicados = documento;
    this.pageNumber = 1;
    documento.length > 0 ? this.filtrosAplicados = 'codigo=' + documento : this.filtrosAplicados = '';

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
    this.filtrosAplicados = '';
    for (let atributo in retornoBuscaAvancada) {
      if (retornoBuscaAvancada.hasOwnProperty(atributo)) {
        this.filtrosAplicados += `${atributo}=${retornoBuscaAvancada[atributo]}&`;
      }
    }
    this.pageNumber = 1;
    this.getItens();
  }


  clickDisclaimers(e: any[]) {
    this.filtrosAplicados = '';
    this.pageNumber = 1;
    if (e.length === 0) {
      this.getItens();
    } else {
      e.map(
        (disclaimer) =>
          (this.filtrosAplicados += `${disclaimer.property}=${disclaimer.value}&`)
      );
      this.getItens();
    }
  }



}
