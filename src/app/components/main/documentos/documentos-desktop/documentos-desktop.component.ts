import { Component, OnInit, ViewChild } from '@angular/core';
import { PoChartType, PoDialogService, PoDynamicViewField, PoMenuItem, PoModalAction, PoModalComponent, PoNotificationService, PoPageAction, PoSelectOption, PoTableAction, PoTableColumn, PoTableColumnSpacing } from '@po-ui/ng-components';
import { PoPageDynamicSearchFilters } from '@po-ui/ng-templates';
import { finalize } from 'rxjs';
import { Documento, HistoricoDocumento, ItemDocumento } from '../../../shared/interfaces/documento';
import { Saldo } from '../../../shared/interfaces/saldo.model';
import { DocumentosService } from '../../../shared/services/documentos.service';
import { Aprovador } from '../../../shared/interfaces/aprovador.model';

@Component({
  selector: 'app-documentos-desktop',
  templateUrl: './documentos-desktop.component.html',
  styleUrl: './documentos-desktop.component.scss'
})
export class DocumentosDesktopComponent implements OnInit {

  // Paginação
  pageNumber: number = 1;
  pageSize: number = 10;

  haMaisPaginas: boolean = false;

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
  columnsTabelaModalDocumento: Array<PoTableColumn> = [];

  // Documento
  formularioDocumento: Array<PoDynamicViewField> = [];
  documentoSelecionado: Documento = {} as Documento;
  itemsDocumentoSelecionado: ItemDocumento[] = [];

  historicoDocumento: Array<any> = []
  colunasHistoricoDocumento: Array<any> = []
  colunasItensDocumento: Array<any> = []


  acoesModalTransferencia = {
    confirmar: { label: 'Transferir', action: this.abrirConfirmacaoTransferencia.bind(this) } as PoModalAction,
    cancelar: { label: 'Cancelar', action: this.fecharModalTransferencia.bind(this), danger: true } as PoModalAction,
  }

  acoesModalAprovacao = {
    confirmar: { label: 'Aprovar Documento', action: this.abrirConfirmacaoAprovacao.bind(this) } as PoModalAction,
    cancelar: { label: 'Cancelar', action: this.fecharModalAprovacao.bind(this), danger: true } as PoModalAction,
  }

  acoesModalRecusa = {
    confirmar: { label: 'Recusar Documento', action: this.abrirConfirmacaoRecusa.bind(this), danger: true } as PoModalAction,
    cancelar: { label: 'Cancelar', action: this.fecharModalRecusa.bind(this), danger: true } as PoModalAction,
  }

  acoesModalBloqueio = {
    confirmar: { label: 'Bloquear Documento', action: this.abrirConfirmacaoBloqueio.bind(this), danger: true } as PoModalAction,
    cancelar: { label: 'Cancelar', action: this.fecharModalBloqueio.bind(this), danger: true } as PoModalAction,
  }

  // Saldos
  saldoAtual: Saldo = {} as Saldo;
  formularioSaldo: Array<PoDynamicViewField> = [];

  formularioSaldoModalDocumento: Array<PoDynamicViewField> = [];

  // Aprovadores
  aprovadores: PoSelectOption[] = []
  superiores: PoSelectOption[] = []

  tipoTransferencia: "aprovador" | "superior" | "" = ""
  novoAprovadorSelecionado = ""

  justificativaDocumento = ""



  @ViewChild(PoModalComponent) modalDocumento: any;
  @ViewChild('modalItens') modalItens: any;
  @ViewChild('modalSaldos') modalSaldos: any;
  @ViewChild('modalTransferencia') modalTransferencia: any;
  @ViewChild('modalRecusa') modalRecusa: any;
  @ViewChild('modalAprovacao') modalAprovacao: any;
  @ViewChild('modalBloqueio') modalBloqueio: any;


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
  }


  /**
   * Construção dos elementos da tela
  */

  fecharModalTransferencia() {
    if (!this.modalTransferencia.isHidden) {
      this.modalTransferencia?.close()
      this.justificativaDocumento = ""
    }
  }

  fecharModalAprovacao() {
    if (!this.modalAprovacao.isHidden) {
      this.modalAprovacao?.close()
      this.justificativaDocumento = ""
    }
  }

  fecharModalRecusa() {
    if (!this.modalRecusa.isHidden) {
      this.modalRecusa?.close()
      this.justificativaDocumento = ""
    }
  }

  fecharModalBloqueio() {
    if (!this.modalBloqueio.isHidden) {
      this.modalBloqueio?.close()
      this.justificativaDocumento = ""
    }
  }

  aplicarFiltros() {
    if (!this.status || !this.emissaoAte || !this.documentoAte) {
      this.poNotificationService.information({ message: "Por gentileza, preencha todos os filtros.", duration: 3000 })
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
      { property: 'id', label: 'Documento', readonly: true, width: 110 },
      { property: 'produto', label: 'Produto', readonly: true },
      { property: 'descricao', label: 'Descrição', readonly: true },
      { property: 'quantidadeUm1', label: 'Qtde', readonly: true, width: 70 },
      { property: 'um', label: 'UN', readonly: true, width: 70 },
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
      { property: 'status', label: 'Status', readonly: true, width: 150 },
      { property: 'aprovador', label: 'Aprovador', readonly: true, width: 200 },
      { property: 'dataLiberacao', label: 'Data Liberação', readonly: true, width: 150 },
      // { property: 'observacoes', label: 'Observações', readonly: true },
      { property: 'msg', label: 'Observações', readonly: true },
    ]
  }


  constroiFormularioSaldos(): PoDynamicViewField[] {
    return [
      {
        property: 'cod',
        label: 'Código',
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
        property: 'login',
        label: 'Login',
        type: 'string',
        gridColumns: 3
      },
      {
        property: 'codSuperior',
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
      // {
      //   property: 'moeda',
      //   label: 'Moeda',
      //   type: 'string',
      //   gridColumns: 3
      // },
      {
        property: 'tipoLimite',
        label: 'Tipo Limite',
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
        property: 'dataSaldo',
        label: 'Data Saldo',
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
      { label: 'Aprovar', action: this.abrirModalAprovacao.bind(this), icon: 'po-icon-ok', visible: (documento: any) => documento.status == "02" || documento.status == "04" },
      { label: 'Recusar', action: this.abrirModalRecusa.bind(this), icon: 'po-icon-close', visible: (documento: any) => documento.status == "02" || documento.status == "04" },
      { label: 'Estornar', action: this.abrirConfirmacaoEstorno.bind(this), icon: 'po-icon-arrow-left', visible: (documento: any) => documento.status == "03" },
      { label: 'Bloquear', action: this.abrirModalBloqueio.bind(this), icon: 'po-icon-lock', visible: (documento: any) => documento.status == "02" },
      { label: 'Transferir para Superior', action: this.abrirModalTransferencia.bind(this), icon: 'po-icon-arrow-up', visible: (documento: any) => documento.status == "02" },
    ]
  }

  constroiAcoesTela(): PoPageAction[] {
    return [
      { label: 'Ver Saldo', action: this.abrirModalSaldos.bind(this), icon: 'po-icon-eye' },
      // { label: '', action: () => this.mostraFiltros = true, icon: 'po-icon-arrow-left' },
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
      { property: 'filial', label: 'Filial' },
      { property: 'doc', label: 'Documento' },
      { property: 'tipo', label: 'Tipo' },
      { property: 'codUsuario', label: 'Cód. Usuario' },
      // { property: 'codAprovador', label: 'Cod. Aprovador' },
      { property: 'dataEmissao', label: 'Data Emissão' },
      { property: 'valorTotal', label: 'Valor total', type: 'currency' },
      { property: 'dataLiberacao', label: 'Data Liberação' },
      { property: 'prazo', label: 'Prazo' },
      { property: 'msg', label: 'Mensagem' },

    ];

  }


  constroiColunasModalDocumento(): PoTableColumn[] {
    return [
      { property: 'filial', label: 'Filial' },
      { property: 'doc', label: 'Documento' },
      { property: 'tipo', label: 'Tipo Documento' },
      { property: 'dataEmissao', label: 'Data Emissão' },
      { property: 'valorTotal', label: 'Valor total', type: 'currency' },
      { property: 'prazo', label: 'Prazo' },

    ];

  }


  constroiBuscaAvançada(): PoPageDynamicSearchFilters[] {
    return [
      { property: 'emissaoDe', label: 'Emissão de: ', type: 'date', gridColumns: 12 },
      { property: 'emissaoAte', label: 'Emissão até: ', type: 'date', gridColumns: 12 },
      { property: 'documentoDe', label: 'Documento de: ', type: 'string', gridColumns: 12 },
      { property: 'documentoAte', label: 'Documento até: ', type: 'string', gridColumns: 12 },
      {
        property: 'status', label: 'Status: ', type: 'string', options: [
          { value: '02', label: 'Pendente' },
          { value: '03', label: 'Aprovada' },
          { value: '06', label: 'Rejeitada' },
          { value: '04', label: 'Bloqueada' },
        ]
      },
    ];
  }

  /************************************************************/



  abrirDocumento(documento: any) {
    this.documentoSelecionado = documento;
    this.historicoDocumento = documento.Liberacao
    this.itemsDocumentoSelecionado = documento.itens
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
        this.saldoAtual = res.Itens[0]
        this.loading = false;
      }, (error) => {
        this.poNotificationService.error(error.error.message);
      });
  }


  getItens(pageNumber: number = 1, pageSize: number = 20) {
    this.loading = true;

    if (pageNumber === 1) this.documentos = [];

    this.documentosService
      .getAll(pageNumber, pageSize,{ documentoDe: this.documentoDe, documentoAte: this.documentoAte, emissaoDe: this.emissaoDe, emissaoAte: this.emissaoAte, status: this.status })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        this.documentos = this.documentos.concat(res.Itens);
        this.haMaisPaginas = res.hasNext;
        this.loading = false;
      }, (error) => {
        this.poNotificationService.error(error.error.message)
      });
  }


  getAprovadores() {
    this.documentosService
      .getAprovadores()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        this.aprovadores = res.map((aprovador: Aprovador) => {
          return { label: `${aprovador?.codAprovador} - ${aprovador.nome}`, value: aprovador.codAprovador || "" }
        })
        this.loading = false;
      }, (error) => {
        this.poNotificationService.error(error.error.message)
      });
  }


  getSuperiores() {
    this.documentosService
      .getSuperiores()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        this.superiores = res.map((superior: Aprovador) => {
          return { label: `${superior?.codAprovador} - ${superior.nome}`, value: superior.codAprovador || "" }
        })
        this.loading = false;
      }, (error) => {
        this.poNotificationService.error(error.error.message)
      });
  }


  abrirItensDocumento(documento: Documento) {
    this.itemsDocumentoSelecionado = documento.Itens as ItemDocumento[];
    this.modalItens.open();
  }


  formatarTituloItem(item: ItemDocumento) {
    return `${item.produto} - ${item.descricao}`
  }


  formatarTituloHistorico(historico: HistoricoDocumento) {
    return ``
  }

  abrirConfirmacaoAprovacao() {

    if (!this.justificativaDocumento) {
      this.poNotificationService.information({ message: "Por gentileza, digite uma justificativa para a aprovação.", duration: 3000 })
      return
    }

    this.poDialogService.confirm({
      title: 'Aprovação',
      message: `Confirma a  do documento ${this.documentoSelecionado.doc} ?`,
      confirm: () => this.aprovarDocumento(),
      cancel: () => this.fecharModalAprovacao(),
      literals: { cancel: "Não", confirm: 'Sim' },
    })
  }

  // abrirConfirmacaoAprovacao(documento: Documento) {
  //   this.poDialogService.confirm({
  //     title: 'Aprovação',
  //     message: `Confirma aprovação do documento ${documento.doc} ?`,
  //     confirm: () => this.aprovarDocumento(documento),
  //     literals: { cancel: "Não", confirm: 'Sim' },
  //   })
  // }


  abrirConfirmacaoEstorno(documento: Documento) {
    this.poDialogService.confirm({
      title: 'Estorno',
      message: `Confirma o estorno do documento ${documento.doc} ?`,
      confirm: () => this.estornarDocumento(documento),
      literals: { cancel: "Não", confirm: 'Sim' },
    })
  }

  abrirConfirmacaoRecusa() {

    if (!this.justificativaDocumento) {
      this.poNotificationService.information({ message: "Por gentileza, digite uma justificativa para a recusa.", duration: 3000 })
      return
    }

    this.poDialogService.confirm({
      title: 'Recusa',
      message: `Confirma a recusa do documento ${this.documentoSelecionado.doc} ?`,
      confirm: () => this.rejeitarDocumento(),
      cancel: () => this.fecharModalRecusa(),
      literals: { cancel: "Não", confirm: 'Sim' },
    })
  }

  abrirConfirmacaoTransferencia() {

    if (!this.justificativaDocumento) {
      this.poNotificationService.information({ message: "Por gentileza, digite uma justificativa para a transferência.", duration: 3000 })
      return
    }

    this.poDialogService.confirm({
      title: 'Transferência',
      message: `Confirma a transferencia do documento ${this.documentoSelecionado.doc} ?`,
      confirm: () => this.confirmarTransferencia(),
      cancel: () => this.fecharModalTransferencia(),
      literals: { cancel: "Não", confirm: 'Sim' },
    })
  }

  abrirConfirmacaoBloqueio() {

    if (!this.justificativaDocumento) {
      this.poNotificationService.information({ message: "Por gentileza, digite uma justificativa para o bloqueio.", duration: 3000 })
      return
    }

    this.poDialogService.confirm({
      title: 'Recusa',
      message: `Confirma o bloqueio do documento ${this.documentoSelecionado.doc} ?`,
      confirm: () => this.bloquearDocumento(),
      cancel: () => this.fecharModalBloqueio(),
      literals: { cancel: "Não", confirm: 'Sim' },
    })
  }

  abrirModalAprovacao(documento: Documento) {
    this.documentoSelecionado = documento
    this.modalAprovacao?.open()
  }

  abrirModalRecusa(documento: Documento) {
    this.documentoSelecionado = documento
    this.modalRecusa?.open()
  }

  abrirModalBloqueio(documento: Documento) {
    this.documentoSelecionado = documento
    this.modalBloqueio?.open()
  }


  aprovarDocumento() {
    this.loading = true;

    this.documentosService
      .aprovarDocumento(this.documentoSelecionado, this.justificativaDocumento)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {

        this.loading = false;

        this.poNotificationService.success("Documento Aprovado com sucesso!")

        this.justificativaDocumento = ""

        if (!this.modalAprovacao.isHidden) {
          this.modalAprovacao?.close()
        }

        if (!this.modalDocumento.isHidden) {
          this.modalDocumento?.close()
        }

        this.getItens(this.pageNumber)

      }, (error) => {
        this.poNotificationService.error(error.error.message)
      });


  }


  rejeitarDocumento() {

    this.loading = true;

    this.documentosService
      .rejeitarDocumento(this.documentoSelecionado, this.justificativaDocumento)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        this.loading = false;

        this.poNotificationService.success("Documento Recusado com Sucesso!")

        this.justificativaDocumento = ""

        if (!this.modalRecusa.isHidden) {
          this.modalRecusa?.close()
        }

        if (!this.modalDocumento.isHidden) {
          this.modalDocumento?.close()
        }

        this.getItens(this.pageNumber)

      }, (error) => {
        this.poNotificationService.error(error.error.message)
      });

  }

  estornarDocumento(documento: Documento) {

    this.loading = true;

    this.documentosService
      .estornarDocumento(documento, ' ')
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        this.loading = false;

        this.poNotificationService.success("Documento Estornado com Sucesso!")

        this.justificativaDocumento = ""

        if (!this.modalRecusa.isHidden) {
          this.modalRecusa?.close()
        }

        if (!this.modalDocumento.isHidden) {
          this.modalDocumento?.close()
        }

        this.getItens(this.pageNumber)

      }, (error) => {
        this.poNotificationService.error(error.error.message)
      });

  }

  bloquearDocumento() {

    this.loading = true;

    this.documentosService
      .bloquearDocumento(this.documentoSelecionado, this.justificativaDocumento)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        this.loading = false;

        this.poNotificationService.success("Documento Bloqueado com Sucesso!")

        this.justificativaDocumento = ""

        if (!this.modalBloqueio.isHidden) {
          this.modalBloqueio?.close()
        }

        if (!this.modalDocumento.isHidden) {
          this.modalDocumento?.close()
        }

        this.getItens(this.pageNumber)

      }, (error) => {
        this.poNotificationService.error(error.error.message)
      });

  }

  confirmarTransferencia() {

    this.loading = true;

    this.documentosService
      .transferirDocumentoParaSuperior(this.documentoSelecionado, this.justificativaDocumento)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        this.loading = false;

        this.poNotificationService.success("Documento transferido com sucesso!")

        if (!this.modalTransferencia.isHidden) {
          this.modalTransferencia?.close()
        }

        this.getItens(this.pageNumber)

      }, (error) => {
        this.poNotificationService.error(error.error.message)
      });
  }


  buscaDocumento(documento: string): void {

    if (documento) {
      this.documentoDe = documento;
      this.documentoAte = documento;
    } else {
      this.documentoDe = " ";
      this.documentoAte = "ZZZZZZZZZ";
    }


    this.loading = true;

    this.documentos = [];

    this.documentosService
      .buscaDocumento({ documentoDe: this.documentoDe, documentoAte: this.documentoAte, emissaoDe: this.emissaoDe, emissaoAte: this.emissaoAte, status: this.status })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        this.documentos = this.documentos.concat(res.Itens);
        this.haMaisPaginas = res.hasNext;
        this.loading = false;
      }, (error) => {
        this.poNotificationService.error(error.error.message)
      });
  }


  selecionaTipoTransferencia(tipo: any) {
    this.tipoTransferencia = tipo;

  }


  carregarMais(): void {
    this.pageNumber++;
    this.getItens(this.pageNumber);
  }


  realizaBuscaAvancada(retornoBuscaAvancada: {
    [key: string]: any;
  }): void {

    this.documentoDe = retornoBuscaAvancada['documentoDe']
    this.documentoAte = retornoBuscaAvancada['documentoAte']
    this.emissaoDe = retornoBuscaAvancada['emissaoDe']
    this.emissaoAte = retornoBuscaAvancada['emissaoAte']
    this.status = retornoBuscaAvancada['status']

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
      this.status = `02`
    }


    this.pageNumber = 1;
    this.getItens();
  }

  formataNumeroMoeda(numero: number) {
    return numero.toFixed(2)
  }

  // Executado quando é removido os filtros da busca avançada
  clickDisclaimers(disclaimers: any[]) {
    this.pageNumber = 1;

    if (!disclaimers.some(disclaimer => disclaimer.property === 'documentoDe')) this.documentoDe = " "
    if (!disclaimers.some(disclaimer => disclaimer.property === 'documentoAte')) this.documentoAte = "ZZZZZZZZZ"
    if (!disclaimers.some(disclaimer => disclaimer.property === 'emissaoDe')) this.emissaoDe = " "
    if (!disclaimers.some(disclaimer => disclaimer.property === 'emissaoAte')) this.emissaoAte = `${new Date().getFullYear()}-12-31`
    if (!disclaimers.some(disclaimer => disclaimer.property === 'status')) this.status = "02"

    this.getItens();
  }

}
