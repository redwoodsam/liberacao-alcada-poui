import { Component, OnInit } from '@angular/core';
import { PoPageAction, PoTableColumn } from '@po-ui/ng-components';
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

  selectedTab = 'pendentes';
  pageNumber: number = 1;
  pageSize: number = 10;
  documentos: Documento[] = []
 
  private filtrosAplicados: string = '';
  private edicao = false;

  loading: boolean = false;
  columns: Array<PoTableColumn> = [];
    public opcoesTela: Array<PoPageAction> = [
    { label: 'Incluir', action: this.incluiDocumento.bind(this) },
  ];

  public filtroBuscaAvancada: Array<PoPageDynamicSearchFilters>;

  constructor(private documentosService: DocumentosService) {
    this.filtroBuscaAvancada = this.retornaBuscaAvançada();
  }

  ngOnInit(): void {
    this.columns = [];
    this.getItens(1);

    this.columns = [
      { property: 'id', label: 'Documento' },
      { property: 'tipo-documento', label: 'Tipo Documento' },
      { property: 'cod-usuario', label: 'Cód. Usuario' },
      { property: 'cod-aprovador', label: 'Cod. Aprovador' },
      { property: 'grp-aprov', label: 'Grp. Aprov' },
      { property: 'data-emissao', label: 'Data Emissão' },
      { property: 'valor-total', label: 'Valor total' },
      { property: 'data-liberacao', label: 'Data Liberação' },
      { property: 'prazo', label: 'Prazo' },
      { property: 'aviso', label: 'Aviso' },
      { property: 'tipo-compra', label: 'Tipo Compra' },

    ];

  }

  switchTab(tab: string) {
    this.selectedTab = tab;
    this.getItens(1)
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
  carregarMais(): void {
    this.pageNumber++;
    this.getItens(this.pageNumber);
    console.log(this.filtrosAplicados);
  }

  openDocumento(event: any) {
    console.log(event);
  }

  buscaProduto(documento: string): void {
    this.filtrosAplicados = documento;
    this.pageNumber = 1;
    documento.length > 0 ? this.filtrosAplicados = 'codigo=' + documento : this.filtrosAplicados = '';

    this.getItens(this.pageNumber);
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

  retornaBuscaAvançada(): PoPageDynamicSearchFilters[] {
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

  incluiDocumento(): void {
    this.edicao = false;
    // this.dynamicForm.form.reset();
    // this.poModal?.open();
  }


}
