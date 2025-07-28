import { Component, OnInit, ViewChild } from '@angular/core';
import { PoAccordionItemComponent, PoDialogService, PoDisclaimer, PoDynamicViewField, PoModalAction, PoModalComponent, PoNotificationService, PoSelectOption } from '@po-ui/ng-components';
import { finalize } from 'rxjs';
import { Documento, HistoricoDocumento, ItemDocumento, STATUS_DOCUMENTO } from '../../../shared/interfaces/documento';
import { DocumentosService } from '../../../shared/services/documentos.service';
import { ScrollService } from '../../../shared/services/scroll.service';
import { formataNumeroMoeda } from '../../../shared/utils/utils';

@Component({
  selector: 'app-documentos-mobile',
  templateUrl: './documentos-mobile.component.html',
  styleUrl: './documentos-mobile.component.scss'
})
export class DocumentosMobileComponent implements OnInit {

  // Paginação
  pageNumber: number = 1;
  pageSize: number = 10;

  haMaisPaginas: boolean = false;

  // filtros
  filtrosAplicados: string = '';

  documentoDe  = "";
  documentoAte = "";
  emissaoDe    = "";
  emissaoAte   = "";
  status       = STATUS_DOCUMENTO.Pendente;


  documentoDeForm  = "";
  documentoAteForm = "";
  emissaoDeForm    = "";
  emissaoAteForm   = "";
  statusForm       = STATUS_DOCUMENTO.Pendente;

  justificativaDocumento: string = "";

  formularioSaldo: PoDynamicViewField[] = [];

  opcoesFiltroStatus: Array<PoSelectOption> = [
    { value: '02', label: 'Pendente' },
    { value: '03', label: 'Aprovada' },
    { value: '04', label: 'Bloqueada' },
    { value: '06', label: 'Rejeitada' },
  ]

  acoesModalFiltros = {
    primary: {
      action: () => this.aplicarFiltros(),
      label: 'Aplicar',
    },
    secondary: {
      action: () => this.fecharModalFiltros(),
      label: 'Cancelar',
    }
  }
  
  disclaimersFiltros:Array<PoDisclaimer> = []

  // Estado global
  loading: boolean = false;

  // Tabela
  documentos: Documento[] = []

  // Documento
  documentoSelecionado: Documento = {} as Documento;
  itemsDocumentoSelecionado: ItemDocumento[] = [];
  historicoDocumento: Array<HistoricoDocumento> = []

  saldoAtual: any = {};

  @ViewChild(PoModalComponent) modalDocumento: any;

  @ViewChild("modalFiltros")       modalFiltros!: PoModalComponent;
  @ViewChild("modalDetalhes")      modalDetalhes!: PoModalComponent;
  @ViewChild("modalSaldo")         modalSaldo!: PoModalComponent;
  @ViewChild("accordionHistorico") accordionHistorico!: PoAccordionItemComponent;


  @ViewChild('modalTransferencia') modalTransferencia!: PoModalComponent;
  @ViewChild('modalRecusa')        modalRecusa!: PoModalComponent;
  @ViewChild('modalAprovacao')     modalAprovacao!: PoModalComponent;
  @ViewChild('modalBloqueio')      modalBloqueio!: PoModalComponent;

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


  constructor(
     private documentosService: DocumentosService,
     private poNotificationService: PoNotificationService,
     private scrollService: ScrollService,
     private poDialogService: PoDialogService,
  ) {
    this.formularioSaldo = this.constroiFormularioSaldos();
  }

  ngOnInit(): void {
    this.resetaFiltros()
    this.getSaldo();
    this.getItens();
  }

  get tituloDocumentoSelecionado() {
    return `Documento #${this.documentoSelecionado.doc}`
  }

  resetaFiltros() {
    this.documentoDeForm = ""
    this.documentoAteForm = ""
    this.emissaoDeForm = ""
    this.emissaoAteForm = ""
    this.statusForm = STATUS_DOCUMENTO.Pendente;
  }

  constroiFormularioSaldos(): PoDynamicViewField[] {
    return [
      {
        property: 'cod',
        label: 'Código',
        type: 'string',
        gridColumns: 4,
      },
      {
        property: 'nome',
        label: 'Usuário',
        type: 'string',
        gridColumns: 8
      },
      {
        property: 'login',
        label: 'Login',
        type: 'string',
        gridColumns: 12
      },
      {
        property: 'codSuperior',
        label: 'Superior',
        type: 'string',
        gridColumns: 12 
      },
      {
        property: 'limite',
        label: 'Limite',
        type: 'currency',
        gridColumns: 6 
      },
      {
        property: 'tipoLimite',
        label: 'Tipo Limite',
        type: 'string',
        gridColumns: 6
      },
      {
        property: 'saldo',
        label: 'Saldo',
        type: 'currency',
        gridColumns: 6
      },
      {
        property: 'dataSaldo',
        label: 'Data Saldo',
        type: 'string',
        gridColumns: 6
      },
    ];
  }

  getSaldo() {
    this.loading = true
    this.documentosService.consultaSaldo()
      .subscribe((res) => {
        this.saldoAtual = res.Itens[0]
      }, (error) => {
        this.poNotificationService.error({ message: error.error.message, duration: 3000 });
      });
  }

  aoMudarFiltrosAplicados(disclaimers: PoDisclaimer[]) {
    this.pageNumber = 1;

    if (!disclaimers.some(disclaimer => disclaimer.property === 'documentoDe')) this.documentoDe = ""
    if (!disclaimers.some(disclaimer => disclaimer.property === 'documentoAte')) this.documentoAte = ""
    if (!disclaimers.some(disclaimer => disclaimer.property === 'emissaoDe')) this.emissaoDe = ""
    if (!disclaimers.some(disclaimer => disclaimer.property === 'emissaoAte')) this.emissaoAte = ""
    if (!disclaimers.some(disclaimer => disclaimer.property === 'status')) this.status = STATUS_DOCUMENTO.Pendente

    this.getItens();
  }


  getItens(pageNumber: number = 1, pageSize: number = 20) {
    this.loading = true;

    if (pageNumber === 1) this.documentos = [];

    this.documentosService
      .getAll(pageNumber, pageSize, { documentoDe: this.documentoDe, documentoAte: this.documentoAte, emissaoDe: this.emissaoDe, emissaoAte: this.emissaoAte, status: this.status })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        this.documentos = this.documentos.concat(res.Itens);
        this.haMaisPaginas = res.hasNext;
        this.loading = false;
      }, (error) => {
        this.poNotificationService.error(error.error.message)
      });
  }

  scrollParaTopo() {
    this.scrollService.scrollContainer?.nativeElement?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  formataValorMoeda(valor: number | undefined): string {
    return formataNumeroMoeda(valor || 0)
  }


  abrirModalFiltro() {
    this.modalFiltros.open();
  }

  fecharModalFiltros() {
    this.resetaFiltros();
    this.modalFiltros.close();
  }

  aplicarFiltros() {
    let isFormularioValido = this.validaFiltros();

    if (!isFormularioValido) {
      return;
    }

    // Copia os valores das variáveis temporárias do formulário para as variáveis de consulta à API.

    if(this.documentoDeForm !== this.documentoDe) {
      this.documentoDe = this.documentoDeForm;
      this.disclaimersFiltros =  this.disclaimersFiltros.filter(disclaimer => disclaimer.property !== 'documentoDe')
      this.disclaimersFiltros.push({ property: 'documentoDe', label: `Documento de: ${this.documentoDeForm}`, value: this.documentoDeForm });
    }

    if(this.documentoAteForm !== this.documentoAte) {
      this.documentoAte = this.documentoAteForm;
      this.disclaimersFiltros =  this.disclaimersFiltros.filter(disclaimer => disclaimer.property !== 'documentoAte')
      this.disclaimersFiltros.push({ property: 'documentoAte', label: `Documento até: ${this.documentoAteForm}`, value: this.documentoAteForm });
    }

    if(this.emissaoDeForm !== this.emissaoDe) {
      this.emissaoDe = this.emissaoDeForm;
      this.disclaimersFiltros = this.disclaimersFiltros.filter(disclaimer => disclaimer.property !== 'emissaoDe')
      this.disclaimersFiltros.push({ property: 'emissaoDe', label: `Emissão de: ${this.emissaoDeForm}`, value: this.emissaoDeForm });
    }

    if(this.emissaoAteForm !== this.emissaoAte) {
      this.emissaoAte = this.emissaoAteForm;
      this.disclaimersFiltros = this.disclaimersFiltros.filter(disclaimer => disclaimer.property !== 'emissaoAte')
      this.disclaimersFiltros.push({ property: 'emissaoAte', label: `Emissão até: ${this.emissaoAteForm}`, value: this.emissaoAteForm });
    }

    if(this.status !== this.statusForm) {
      this.status = this.statusForm;
      this.disclaimersFiltros = this.disclaimersFiltros.filter(disclaimer => disclaimer.property !== 'status')
      this.disclaimersFiltros.push({ property: 'status', label: `Status: ${this.formataNomeStatus(this.status)}`, value: this.statusForm });
    }

    this.getItens();
    this.fecharModalFiltros();
  }

  validaFiltros(): boolean {
    let isValido = true;
    let mensagem = "";

    if (this.emissaoDeForm && this.emissaoAteForm && this.emissaoDeForm > this.emissaoAteForm) {
      mensagem += "A data de emissão de não pode ser maior que a data de emissão até. ";
      isValido = false;
    }

    if (!isValido) {
      this.enviaNotificacao('error', mensagem);
    }

    return isValido;
    
  }
  
  abrirModalSaldo() {
    this.modalSaldo.open();
  }

  fecharModalSaldo() {
    this.modalSaldo.close();
  }

  protected formataTituloItem(item: ItemDocumento) {
    return `${item.quantidadeUm1} ${item.um} - ${item.descricao}`;
  }

  protected enviaNotificacao(tipo: string, mensagem: string) {
    switch (tipo) {
      case 'success':
        this.poNotificationService.success(mensagem);
        break;
      case 'error':
        this.poNotificationService.error(mensagem);
        break;
      case 'warning':
        this.poNotificationService.warning(mensagem);
        break;
      default:
        this.poNotificationService.information(mensagem);
    }
  }

  private formataNomeStatus(status: string): string {
    switch(status) {
      case STATUS_DOCUMENTO.Pendente:
        return 'Pendente';
      case STATUS_DOCUMENTO.Aprovado:
        return 'Aprovado';
      case STATUS_DOCUMENTO.Bloqueado:
        return 'Bloqueado';
      case STATUS_DOCUMENTO.Rejeitado:
        return 'Rejeitado';
      default:
        return 'Desconhecido';
    }
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

  fecharModalTransferencia() {

    if (!this.modalDetalhes.isHidden) {
      this.justificativaDocumento = ""
    }

    if (!this.modalTransferencia.isHidden) {
      this.modalTransferencia?.close()
      this.justificativaDocumento = ""
    }

  }

  fecharModalAprovacao() {

    if (!this.modalDetalhes.isHidden) {
      this.justificativaDocumento = ""
    }

    if (!this.modalAprovacao.isHidden) {
      this.modalAprovacao?.close()
      this.justificativaDocumento = ""
    }
  }

  fecharModalRecusa() {

    if (!this.modalDetalhes.isHidden) {
      this.justificativaDocumento = ""
    }

    if (!this.modalRecusa.isHidden) {
      this.modalRecusa?.close()
      this.justificativaDocumento = ""
    }
  }

  fecharModalBloqueio() {

    if (!this.modalDetalhes.isHidden) {
      this.justificativaDocumento = ""
    }

    if (!this.modalBloqueio.isHidden) {
      this.modalBloqueio?.close()
      this.justificativaDocumento = ""
    }
  }

  abrirModalTransferencia(documentoSelecionado: Documento) {

    if (documentoSelecionado) {
      this.documentoSelecionado = documentoSelecionado;
    }

    this.modalTransferencia?.open()
  }

  abrirModalDetalhes(evento: any) {
    this.documentoSelecionado = evento;
    this.itemsDocumentoSelecionado = evento.itens
    this.historicoDocumento = evento.Liberacao
    this.abrirAccordionHistorico();
    this.modalDetalhes.open();
  }

  private abrirAccordionHistorico() {
    if (!this.accordionHistorico.expanded) {
      this.accordionHistorico.expand();
    }
  }


  aprovarDocumento() {
    this.loading = true;

    this.documentosService
      .aprovarDocumento(this.documentoSelecionado, this.justificativaDocumento)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {

        this.loading = false;

        this.poNotificationService.success({ message: "Documento Aprovado com sucesso!", duration: 3000 })

        this.justificativaDocumento = ""

        if (!this.modalAprovacao.isHidden) {
          this.modalAprovacao?.close()
        }

        if (!this.modalDocumento.isHidden) {
          this.modalDocumento?.close()
        }

        this.fecharModalAprovacao();
        this.getItens(this.pageNumber)

      }, (error) => {
        this.poNotificationService.error({ message: error.error.message, duration: 3000 })
      });


  }


  rejeitarDocumento() {

    this.loading = true;

    this.documentosService
      .rejeitarDocumento(this.documentoSelecionado, this.justificativaDocumento)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        this.loading = false;

        this.poNotificationService.success({ message: "Documento Recusado com Sucesso!", duration: 3000 })

        this.justificativaDocumento = ""

        if (!this.modalRecusa.isHidden) {
          this.modalRecusa?.close()
        }

        if (!this.modalDocumento.isHidden) {
          this.modalDocumento?.close()
        }

        this.fecharModalRecusa();
        this.getItens(this.pageNumber)

      }, (error) => {
        this.poNotificationService.error({ message: error.error.message, duration: 3000 })
      });

  }

  estornarDocumento(documento: Documento) {

    this.loading = true;

    this.documentosService
      .estornarDocumento(documento, ' ')
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        this.loading = false;

        this.poNotificationService.success({ message: "Documento Estornado com Sucesso!", duration: 3000 })

        this.justificativaDocumento = ""

        if (!this.modalRecusa.isHidden) {
          this.modalRecusa?.close()
        }

        if (!this.modalDocumento.isHidden) {
          this.modalDocumento?.close()
        }

        this.getItens(this.pageNumber)

      }, (error) => {
        this.poNotificationService.error({ message: error.error.message, duration: 3000 })
      });

  }

  bloquearDocumento() {

    this.loading = true;

    this.documentosService
      .bloquearDocumento(this.documentoSelecionado, this.justificativaDocumento)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        this.loading = false;

        this.poNotificationService.success({ message: "Documento Bloqueado com Sucesso!", duration: 3000 })

        this.justificativaDocumento = ""

        if (!this.modalBloqueio.isHidden) {
          this.modalBloqueio?.close()
        }

        if (!this.modalDocumento.isHidden) {
          this.modalDocumento?.close()
        }

        this.fecharModalBloqueio();
        this.getItens(this.pageNumber)

      }, (error) => {
        this.poNotificationService.error({message: error.error.message, duration: 3000})
      });

  }

  confirmarTransferencia() {

    this.loading = true;

    this.documentosService
      .transferirDocumentoParaSuperior(this.documentoSelecionado, this.justificativaDocumento)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        this.loading = false;

        this.poNotificationService.success({message: "Documento transferido com sucesso!", duration: 3000})

        if (!this.modalTransferencia.isHidden) {
          this.modalTransferencia?.close()
        }

        this.fecharModalTransferencia();
        this.getItens(this.pageNumber)

      }, (error) => {
        this.poNotificationService.error({message: error.error.message, duration: 3000})
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
        this.poNotificationService.error({message: error.error.message, duration: 3000});
      });
  }


  carregarMais(): void {
    this.pageNumber++;
    this.getItens(this.pageNumber);
  }


}
