import { Component, OnInit, ViewChild } from '@angular/core';
import { PoDialogService, PoDynamicViewField, PoModalAction, PoModalComponent, PoNotificationService, PoPageAction, PoSelectOption, PoTableAction, PoTableColumn } from '@po-ui/ng-components';
import { PoPageDynamicSearchFilters } from '@po-ui/ng-templates';
import { finalize } from 'rxjs';
import { Aprovador } from '../shared/interfaces/aprovador.model';
import { Documento, HistoricoDocumento, ItemDocumento } from '../shared/interfaces/documento';
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

  // filtros globais
  mostraFiltros = true;

  documentoDe = ""
  documentoAte = "ZZZZZZZZZ"
  emissaoDe = ""
  emissaoAte = `${new Date().getFullYear()}-12-31`
  status = "pendentes"


  // Layout
  opcoesTela: Array<PoPageAction> = [];
  acoesTabela: Array<PoTableAction> = [];

  // Estado global
  edicao = false;
  loading: boolean = false;

  // Tabela
  columns: Array<PoTableColumn> = [];
  documentos: Documento[] = []

  columnsTabelaModalDocumento: Array<PoTableColumn> = [];

  // Documento
  formularioDocumento: Array<PoDynamicViewField> = [];
  documentoSelecionado: Documento = {} as Documento;
  itemsDocumentoSelecionado: ItemDocumento[] = [];

  historicoDocumento: Array<any> = []
  colunasHistoricoDocumento: Array<any> = []
  colunasItensDocumento: Array<any> = []

  acoesModalTransferencia = {
    confirmar: {label: 'Transferir', action: this.confirmarTransferencia.bind(this)} as PoModalAction,
    cancelar:  {label: 'Cancelar' , action: this.fecharModalTransferencia.bind(this),  danger: true } as PoModalAction,
  }

  acoesModalRecusa = {
    confirmar: {label: 'Recusar Documento', action: this.abrirConfirmacaoRecusa.bind(this), danger: true} as PoModalAction,
    cancelar:  {label: 'Cancelar' , action: this.fecharModalRecusa.bind(this),  danger: true } as PoModalAction,
  }

  // Saldos
  saldoAtual: Saldo = {} as Saldo;
  formularioSaldo: Array<PoDynamicViewField> = [];

  formularioSaldoModalDocumento: Array<PoDynamicViewField> = [];

  // Aprovadores
  aprovadores: PoSelectOption[] =  []
  superiores:  PoSelectOption[] =  []

  tipoTransferencia: "aprovador" | "superior" | "" = ""
  novoAprovadorSelecionado = ""
  
  justificativaDocumento = ""



  @ViewChild(PoModalComponent) modalDocumento: any;
  @ViewChild('modalItens') modalItens: any;
  @ViewChild('modalSaldos') modalSaldos: any;
  @ViewChild('modalTransferencia') modalTransferencia: any;
  @ViewChild('modalRecusa') modalRecusa: any;
  


  constructor(private documentosService: DocumentosService, private poNotificationService: PoNotificationService, private poDialogService: PoDialogService) {
    this.filtroBuscaAvancada = this.constroiBuscaAvançada();
    this.columns = this.constroiColunas();
    this.columnsTabelaModalDocumento = this.constroiColunasModalDocumento();
    this.acoesTabela = this.constroiAcoesTabela();
    this.opcoesTela = this.constroiAcoesTela();
    this.formularioDocumento = this.constroiFormularioVisuDocumento();
    this.formularioSaldo = this.constroiFormularioSaldos()
    this.formularioSaldoModalDocumento = this.constroiFormularioSaldoModalVisualizacao()
    this.colunasHistoricoDocumento = this.constroiFormularioHistoricoDocumento();
    this.colunasItensDocumento = this.constroiColunasItensDocumento();
  }

  ngOnInit(): void {
    this.getItens(1);
    this.getSaldo();
    this.getAprovadores()
    this.getSuperiores()
  }


  /**
   * Construção dos elementos da tela
  */

  fecharModalTransferencia() {
    if (!this.modalTransferencia.isHidden){
      this.modalTransferencia.close()
    }
  }

  fecharModalRecusa() {
    if (!this.modalRecusa.isHidden){
        this.modalRecusa?.close()
      this.justificativaDocumento = ""
    }
  }

  aplicarFiltros() {
    if (!this.status || !this.emissaoAte || !this.documentoAte) {
      this.poNotificationService.information( {message: "Por gentileza, preencha todos os filtros.", duration: 3000})
      return
    }
    this.mostraFiltros = false
    this.getItens(1)
  }
  

  limparFormularioTransferenciaAprovador() {
    this.novoAprovadorSelecionado = ""
  }

  constroiFormularioVisuDocumento(): PoDynamicViewField[] {
    return [
      {
        property: 'id',
        label: 'Documento',
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
        type: 'string',
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

  constroiColunasItensDocumento() {
    return [
      { property: 'id', label: 'Documento', readonly: true,  width: 110},
      { property: 'produto', label: 'Produto', readonly: true },
      { property: 'descricao', label: 'Descrição', readonly: true },
      { property: 'quantidadeUm1', label: 'Qtde', readonly: true, width: 70 },
      { property: 'um1', label: 'UN', readonly: true, width: 70 },
      { property: 'valorUnitario', label: 'Valor unit.', readonly: true },
      { property: 'valorTotal', label: 'Valor Total', readonly: true },
      { property: 'dataEntrega', label: 'Data Entrega', readonly: true },
      { property: 'status', label: 'Status', readonly: true },
      { property: 'solicitante', label: 'Solicitante', readonly: true },
      { property: 'centroCusto', label: 'Centro Custo', readonly: true },
      { property: 'necessidade', label: 'Necessidade', readonly: true },
      { property: 'os', label: 'OS/OP', readonly: true },
      { property: 'observacao', label: 'Observações', readonly: true },
    ];
  }

  constroiFormularioHistoricoDocumento() {
    return [
      { property: 'item', label: 'Item', readonly: true, width: 70 },
      { property: 'nivel', label: 'Nível', readonly: true, width: 70 },
      { property: 'situacao', label: 'Situação', readonly: true, width: 150 },
      { property: 'aprovador', label: 'Aprovador', readonly: true, width: 200 },
      { property: 'dataLiberacao', label: 'Data Liberação', readonly: true, width: 150 },
      { property: 'observacoes', label: 'Observações', readonly: true  },
      ]
  }



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
        property: 'superior',
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
        type: 'currency',
        gridColumns: 3
      },
      {
        property: 'dataRef',
        label: 'Data Ref.',
        type: 'string',
        gridColumns: 3
      },
    ];
  }

  
    constroiFormularioSaldoModalVisualizacao(): PoDynamicViewField[] {
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
          property: 'superior',
          label: 'Superior',
          type: 'string',
          gridColumns: 3
        },
        {
          property: 'saldo',
          label: 'Saldo',
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
          property: 'dataRef',
          label: 'Data Ref.',
          type: 'string',
          gridColumns: 3
        },
      ];
  }

  constroiAcoesTabela(): PoPageAction[] {
    return [
      { label: 'Visualizar', action: this.abrirDocumento.bind(this), icon: 'po-icon-eye' },
      { label: 'Aprovar', action: this.abrirConfirmacaoAprovacao.bind(this), icon: 'po-icon-ok' },
      { label: 'Recusar', action: this.abrirModalRecusa.bind(this), icon: 'po-icon-close' },
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
      { property: 'status', type: 'subtitle', label: 'Status', subtitles: [
        {value: 'pendente', content: '', label: 'Pendente', color: 'color-08'},
        {value: 'aprovada', content: '', label: 'aprovada', color: 'color-10'},
        {value: 'rejeitada', content: '', label: 'Rejeitada', color: 'color-07'},
        {value: 'bloqueada', content: '', label: 'Bloqueada', color: 'color-04'},
      ] },
      { property: 'id', label: 'Documento' },
      { property: 'tipoDocumento', label: 'Tipo Documento' },
      { property: 'codUsuario', label: 'Cód. Usuario' },
      { property: 'codAprovador', label: 'Cod. Aprovador' },
      { property: 'grpAprov', label: 'Grp. Aprov' },
      { property: 'dataEmissao', label: 'Data Emissão' },
      { property: 'valorTotal', label: 'Valor total', type: 'currency' },
      { property: 'dataLiberacao', label: 'Data Liberação' },
      { property: 'prazo', label: 'Prazo' },
      { property: 'aviso', label: 'Aviso' },
      { property: 'tipoCompra', label: 'Tipo Compra' },

    ];

  }

  constroiColunasModalDocumento(): PoTableColumn[] {
    return [
      { property: 'id', label: 'Documento' },
      { property: 'tipoDocumento', label: 'Tipo Documento' },
      { property: 'dataEmissao', label: 'Data Emissão' },
      { property: 'valorTotal', label: 'Valor total', type: 'currency' },
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
    ];
  }

  /************************************************************/



  abrirDocumento(documento: any) {
    this.documentoSelecionado = documento;
    this.historicoDocumento = documento.historico
    this.modalDocumento?.open()
  }

  abrirModalSaldos() {
    this.modalSaldos?.open()
  }

  abrirModalTransferencia(documentoSelecionado: Documento) {

    if (documentoSelecionado) {
      this.documentoSelecionado = documentoSelecionado;
    }

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

  getAprovadores() {
    this.documentosService
      .getAprovadores()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        this.aprovadores = res.map((aprovador: Aprovador) => {
          return {label: `${aprovador?.codAprovador} - ${aprovador.nome}`, value: aprovador.codAprovador || ""}
        })
        this.loading = false;
      }, (error) => {
        this.poNotificationService.error(error)
      });
  }

  getSuperiores() {
    this.documentosService
      .getSuperiores()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        this.superiores = res.map((superior: Aprovador) => {
          return {label: `${superior?.codAprovador} - ${superior.nome}`, value: superior.codAprovador || ""}
        })
        this.loading = false;
      }, (error) => {
        this.poNotificationService.error(error)
      });
  }


  abrirItensDocumento(documento: Documento) {
    this.itemsDocumentoSelecionado = documento.itens as ItemDocumento[];
    this.modalItens.open();
  }

  formatarTituloItem(item: ItemDocumento) {
    return `${item.produto} - ${item.descricao}`
  }

  formatarTituloHistorico(historico: HistoricoDocumento) {
    return ``
  }


  abrirConfirmacaoAprovacao(documento: Documento) {
    this.poDialogService.confirm({
      title: 'Aprovação',
      message: `Confirma aprovação do documento ${documento.id} ?`,
      confirm: () => this.aprovarDocumento(documento),
      literals: {cancel: "Não", confirm: 'Sim'},
    })
  }

  abrirConfirmacaoRecusa() {

    if (!this.justificativaDocumento) {
      this.poNotificationService.information( {message: "Por gentileza, digite uma justificativa para a recusa.", duration: 3000})
      return
    }

    this.poDialogService.confirm({
      title: 'Recusa',
      message: `Confirma a recusa do documento ${this.documentoSelecionado.id} ?`,
      confirm: () => this.rejeitarDocumento(),
      cancel: () => this.fecharModalRecusa(),
      literals: {cancel: "Não", confirm: 'Sim'},
    })
  }

  abrirModalRecusa(documento: Documento) {
    this.documentoSelecionado = documento
    this.modalRecusa?.open()
  }

  aprovarDocumento(documento: Documento) {
    this.loading = true;

    this.documentosService
      .aprovarDocumento(documento)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {

        this.loading = false;
        console.log("Aprovação do documento: " + documento.id)

        this.poNotificationService.success("Documento Aprovado com sucesso!")
        if(!this.modalDocumento.isHidden) {
          this.modalDocumento?.close()
        }

      }, (error) => {
        this.poNotificationService.error(error)
      });

    
  }

  rejeitarDocumento() {

    this.loading = true;

    this.documentosService
      .rejeitarDocumento(this.documentoSelecionado)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        this.loading = false;

        this.poNotificationService.success("Documento Recusado com Sucesso!")

        this.justificativaDocumento = ""

        if(!this.modalRecusa.isHidden) {
          this.modalRecusa?.close()
        }

        if(!this.modalDocumento.isHidden) {
          this.modalDocumento?.close()
        }

      }, (error) => {
        this.poNotificationService.error(error)
      });

  }

  confirmarTransferencia() {

    if (!this.novoAprovadorSelecionado) {
      this.poNotificationService.information( {message: "Por gentileza, selecione um novo aprovador para transferir.", duration: 3000})
      return
    }

    this.loading = true;

    this.documentosService
      .transferirDocumento(this.documentoSelecionado, this.novoAprovadorSelecionado)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        this.loading = false;

        this.poNotificationService.success("Documento transferido com sucesso!")

        if(!this.modalTransferencia.isHidden) {
          this.modalTransferencia?.close()
        }

      }, (error) => {
        this.poNotificationService.error(error)
      });
  }

  buscaDocumento(documento: string): void {
    this.filtrosAplicados = documento;
    this.pageNumber = 1;
    documento.length > 0 ? this.filtrosAplicados = 'codigo=' + documento : this.filtrosAplicados = '';

    this.getItens(this.pageNumber);
  }

  selecionaTipoTransferencia(tipo: any) {
    this.tipoTransferencia = tipo;

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
