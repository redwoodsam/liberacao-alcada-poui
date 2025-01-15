import { Component, OnInit, ViewChild } from '@angular/core';
import { PoDynamicFormField, PoDynamicViewField, PoModalAction, PoModalComponent, PoNotificationService, PoPageAction, PoTableAction, PoTableColumn } from '@po-ui/ng-components';
import { PoPageDynamicSearchFilters } from '@po-ui/ng-templates';
import { finalize } from 'rxjs';
import { Documento, ItemDocumento } from '../shared/interfaces/documento';
import { DocumentosService } from '../shared/services/documentos.service';

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
  styleUrl: './documentos.component.scss'
})
export class DocumentosComponent implements OnInit {

  pageNumber: number = 1;
  pageSize: number = 10;
  loading: boolean = false;

  filtrosAplicados: string = '';
  columns: Array<PoTableColumn> = [];
  documentos: Documento[] = []
  selectedTab = 'pendentes';

  edicao = false;
  opcoesTela: Array<PoPageAction> = [];
  acoesTabela: Array<PoTableAction> = [];
  
  filtroBuscaAvancada: Array<PoPageDynamicSearchFilters>;

  formularioDocumento: Array<PoDynamicViewField> = [];

  documentoSelecionado: Documento = {} as Documento;

  itemsDocumentoSelecionado: ItemDocumento[] = []

  public confirmarModal: PoModalAction = {
    action: () => {
      // this.salvarFormulario();
    },
    label: 'Confirmar',
  };

  public cancelarModal: PoModalAction = {
    action: () => {
      this.modalDocumento.close();
    },
    label: 'Cancelar',
  };

  @ViewChild(PoModalComponent) modalDocumento: any;
  @ViewChild('modalItens') modalItens: any;
  @ViewChild('modalSaldos') modalSaldos: any;
  // @ViewChild(PoDynamicFormComponent) dynamicForm: PoDynamicFormComponent;


  constructor(private documentosService: DocumentosService, private poNotificationService: PoNotificationService,) {
    this.filtroBuscaAvancada = this.constroiBuscaAvançada();
    this.columns = this.constroiColunas();
    this.acoesTabela = this.constroiAcoesTabela();
    this.opcoesTela = this.constroiAcoesTela();
    this.formularioDocumento = this.constroiFormularioVisuDocumanto();
  }

  ngOnInit(): void {
    this.getItens(1);
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
        gridColumns: 4,
        order: 1
      },
      {
        property: 'valorTotal',
        label: 'Valor Total',
        type: 'currency',
        gridColumns: 4 
      },
      {
        property: 'dataEmissao',
        label: 'Data Emissão',
        type: 'date',
        gridColumns: 4
      },
      {
        property: 'moeda',
        label: 'Moeda',
        gridColumns: 4
      },
      {
        property: 'dataLiberacao',
        label: 'Data Liberação',
        gridColumns: 4,
      },
      {
        property: 'observacoes',
        label: 'Observações',
        gridColumns: 12
      },
      {
        property: 'centroCusto',
        label: 'Centro de custo',
        container: "Dados das Entidades Contábeis",
        gridColumns: 4
      },
      {
        property: 'contaContabil',
        label: 'Conta Contábil',
        gridColumns: 4
      },
      {
        property: 'itemConta',
        label: 'Item Conta',
        gridColumns: 4
      },
      {
        property: 'classeValor',
        label: 'Classe de Valor',
        gridColumns: 4
      },
      {
        property: 'nome',
        label: 'Nome',
        container: 'Dados do Aprovador',
        gridColumns: 4
      },
      {
        property: 'limite',
        label: 'Limite',
        type: 'decimal',
        gridColumns: 4
      },
      {
        property: 'perLimite',
        label: 'Per. Limite',
        gridColumns: 4
      },
      {
        property: 'saldoData',
        label: 'Saldo na Data',
        gridColumns: 4
      },
      {
        property: 'moeda',
        label: 'Moeda',
        gridColumns: 4
      },
      {
        property: 'valorMinimo',
        label: 'Valor Mínimo',
        gridColumns: 4
      },
      {
        property: 'valorMaximo',
        label: 'Valor Máximo',
        gridColumns: 4
      },
      {
        property: 'codPerfil',
        label: 'Cod Perfil',
        gridColumns: 4
      },
      {
        property: 'descPerfil',
        label: 'Desc Perfil',
        gridColumns: 4
      },
    ];
  }	

  constroiFormularioDocumento(): PoDynamicFormField[] {
    return [
      {
        property: 'codigo',
        label: 'Código do Produto',
        type: 'string',
        gridColumns: 12
      },
      {
        property: 'descricao',
        label: 'Descrição do Produto',
        type: 'string',
      },
      {
        property: 'armazem',
        label: 'Armazém',
        type: 'string',
      },
    ];
  }

  constroiAcoesTabela(): PoPageAction[] {
    return [
      { label: 'Visualizar', action: this.abrirDocumento.bind(this), icon: 'po-icon-eye' },
      { label: 'Aprovar', action: this.abrirDocumento.bind(this), icon: 'po-icon-eye' },
      { label: 'Recusar', action: this.abrirDocumento.bind(this), icon: 'po-icon-eye' },
      { label: 'Transferir para', action: this.abrirDocumento.bind(this), icon: 'po-icon-eye' },
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
      { property: 'codigo', type: 'Código', gridColumns: 12 },
      { property: 'descricao', type: 'string', gridColumns: 12 },
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

  getItens(pageNumber: number = 1) {
    this.loading = true;

    if (pageNumber === 1) this.documentos = [];

    this.documentosService
      .getAll(pageNumber, this.filtrosAplicados)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        this.documentos = this.documentos.concat(res.items);
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

  aprovarDocumento(documento: Documento) {
    console.log('Aprovando documento: ', documento);
  }

  rejeitarDocumento(documento: Documento) {
    console.log('Rejeitando documento: ', documento);
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
