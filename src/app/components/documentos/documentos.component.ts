import { Component, OnInit, ViewChild } from '@angular/core';
import { PoDynamicFormField, PoModalAction, PoModalComponent, PoNotificationService, PoPageAction, PoTableAction, PoTableColumn } from '@po-ui/ng-components';
import { PoPageDynamicSearchFilters } from '@po-ui/ng-templates';
import { finalize } from 'rxjs';
import { Documento } from '../shared/interfaces/documento';
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

  formularioDocumento: Array<PoDynamicFormField> = [];

  documentoSelecionado: Documento = {} as Documento;

  public confirmarModal: PoModalAction = {
    action: () => {
      // this.salvarFormulario();
    },
    label: 'Confirmar',
  };

  public cancelarModal: PoModalAction = {
    action: () => {
      this.poModal.close();
    },
    label: 'Cancelar',
  };

  @ViewChild(PoModalComponent) poModal: any;
  // @ViewChild(PoDynamicFormComponent) dynamicForm: PoDynamicFormComponent;


  constructor(private documentosService: DocumentosService, private poNotificationService: PoNotificationService,) {
    this.filtroBuscaAvancada = this.constroiBuscaAvançada();
    this.columns = this.constroiColunas();
    this.acoesTabela = this.constroiAcoesTabela();
    // this.opcoesTela = this.constroiOpcoesTela();
    this.formularioDocumento = this.constroiFormularioDocumento();
  }

  ngOnInit(): void {
    this.getItens(1);
  }


  /**
   * Construção dos elementos da tela
  */

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
        property: 'tipo',
        label: 'Tipo',
        options: [
          { value: 'PA', label: 'PA' },
          { value: 'PI', label: 'PI' },
          { value: 'MP', label: 'MP' },
          { value: 'KT', label: 'KT' },
          { value: 'EM', label: 'EM' },
        ],
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
    this.poModal?.open()
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


  incluiDocumento(): void {
    this.edicao = false;
    // this.dynamicForm.form.reset();
    // this.poModal?.open();
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
