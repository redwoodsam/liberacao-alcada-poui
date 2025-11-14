import { Component, ViewChild } from '@angular/core';
import { PoDialogService, PoDynamicViewField, PoGridRowActions, PoModalComponent, PoNotificationService, PoPageAction, PoTableAction, PoTableColumn } from '@po-ui/ng-components';
import { PoPageDynamicSearchFilters } from '@po-ui/ng-templates';
import { Documento, ItemDocumento } from '../../shared/interfaces/documento';
import { DocumentosService } from '../../shared/services/documentos.service';



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
  opcoesTela: Array<PoPageAction>   = [];
  acoesTabela: Array<PoTableAction> = [];

  // Estado global
  edicao = false;
  loading: boolean = false;

  // Tabela
  columns: Array<PoTableColumn> = [];
  documentos: any[]             = []

  historicoDocumento: any[] = [];
  itensDocumento:     any[] = [];


  // Documento
  formularioDocumento: Array<PoDynamicViewField> = [];
  documentoSelecionado: Documento = {} as Documento;

  colunasModalVisualizacao: Array<any> = [
    { property: 'id', label: 'ID', align: 'right', readonly: true },
    { property: 'produto', label: 'Produto', required: true },
    { property: 'descricaoProduto', label: 'Descrição', readonly: true },
    { property: 'quantidade', label: 'Quantidade', required: true },
    { property: 'un', label: 'UN', readonly: true },
    { property: 'armazem', label: 'Armazém' },
    { property: 'centroCusto', label: 'Centro Custo' },
    { property: 'necessidade', label: 'Necessidade' },
    { property: 'observacao', label: 'Observação' },
  ]

  dadosModalVisualizacao: Array<any> = [
    {
      id: '001',
      produto: '',
      descricaoProduto: '',
      quantidade: '',
      un: '',
      armazem: '',
      centroCusto: '',
      necessidade: '',
      observacao: '',
    }

    
  ]

  acoesModalVisualizacao: PoGridRowActions = {
    beforeSave: ()=> true,
  };

  @ViewChild(PoModalComponent) modalVisualizacao: any;
  @ViewChild(PoModalComponent) modalHistorico: any;

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
      { label: 'Visualizar Documento', action: this.abrirModalVisualizacao.bind(this), icon: 'po-icon-eye' },
      { label: 'Historico', action: this.abrirModalHistorico.bind(this), icon: 'po-icon-history' },
      { label: 'Editar', action: this.abrirModalVisualizacao.bind(this), icon: 'po-icon-edit' },
      // { label: 'Recusar', action: this.abrirModalRecusa.bind(this), icon: 'po-icon-close' },
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
      { property: 'id'         , label: 'Numero SC' },
      { property: 'item'       , label: 'Item' },
      { property: 'produto'    , label: 'Produto' },
      { property: 'quantidade' , label: 'Quantidade' },
      { property: 'um1'        , label: 'UN' },
      // { property: 'tipoCompra' , label: 'Tipo Compra' },
      { property: 'dataEmissao', label: 'Data Emissão' },
      { property: 'nome'       , label: 'Usuário' }
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
    // this.loading = true;

    if (pageNumber === 1) this.documentos = [];

        this.documentos = [
         {
          status: '02',
          id: '000001',
          item: '01',
          produto: 'Parafuso sextavado 8mmm',
          quantidade: 50,
          um1: 'UN',
          tipoCompra: 'tipoCompra',
          dataEmissao: '11/02/2025',
          nome: 'Marcio da Silva'
         },
         {
          status: '02',
          id: '000001',
          item: '02',
          produto: 'Bucha para parafuso sextavado 8mmm',
          quantidade: 50,
          um1: 'UN',
          tipoCompra: 'tipoCompra',
          dataEmissao: '11/02/2025',
          nome: 'Marcio da Silva'
         },
         {
          status: '02',
          id: '000001',
          item: '03',
          produto: 'Parafusadeira DeWalt 127V',
          quantidade: 2,
          um1: 'UN',
          tipoCompra: 'tipoCompra',
          dataEmissao: '11/02/2025',
          nome: 'Marcio da Silva'
         },

        ];
    
    // this.documentosService
    //   .getAll(pageNumber, { documentoDe: this.documentoDe, documentoAte: this.documentoAte, emissaoDe: this.emissaoDe, emissaoAte: this.emissaoAte, status: this.status })
    //   .pipe(finalize(() => (this.loading = false)))
    //   .subscribe((res) => {
    //     console.log(res);
    //     this.documentos = [
    //      {
    //       status: '02',
    //       id: '000001',
    //       item: '01',
    //       produto: 'Parafuso sextavado 8mmm',
    //       quantidade: 50,
    //       um1: 'UN',
    //       tipoCompra: 'tipoCompra',
    //       dataEmissao: '11/02/2025',
    //       nome: 'Marcio da Silva'
    //      },
    //      {
    //       status: '02',
    //       id: '000001',
    //       item: '02',
    //       produto: 'Bucha para parafuso sextavado 8mmm',
    //       quantidade: 50,
    //       um1: 'UN',
    //       tipoCompra: 'tipoCompra',
    //       dataEmissao: '11/02/2025',
    //       nome: 'Marcio da Silva'
    //      },
    //      {
    //       status: '02',
    //       id: '000001',
    //       item: '03',
    //       produto: 'Parafusadeira DeWalt 127V',
    //       quantidade: 2,
    //       um1: 'UN',
    //       tipoCompra: 'tipoCompra',
    //       dataEmissao: '11/02/2025',
    //       nome: 'Marcio da Silva'
    //      },

    //     ];
    //     this.loading = false;
      // }, (error) => {
      //   this.poNotificationService.error(error)
      // });
  }


  formatarTituloItem(item: ItemDocumento) {
    return `${item.produto} - ${item.descricao}`
  }


  abrirModalVisualizacao(documento: any) {
    this.documentoSelecionado = documento;
    this.modalVisualizacao?.open()
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
  }


  abrirConfirmacaoRecusa() {

    this.poDialogService.confirm({
      title: 'Recusa',
      message: `Confirma a recusa do documento ${this.documentoSelecionado.id} ?`,
      confirm: () => {},
      cancel: () => {},
      literals: { cancel: "Não", confirm: 'Sim' },
    })
  }

  abrirModalHistorico(documento: any) {

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

    if (!disclaimers.some(disclaimer => disclaimer.property === 'documentoDe')) this.documentoDe = " "
    if (!disclaimers.some(disclaimer => disclaimer.property === 'documentoAte')) this.documentoAte = "ZZZZZZZZZ"
    if (!disclaimers.some(disclaimer => disclaimer.property === 'emissaoDe')) this.emissaoDe = " "
    if (!disclaimers.some(disclaimer => disclaimer.property === 'emissaoAte')) this.emissaoAte = `${new Date().getFullYear()}-12-31`
    if (!disclaimers.some(disclaimer => disclaimer.property === 'status')) this.status = "02"

    this.getItens();
  }
}