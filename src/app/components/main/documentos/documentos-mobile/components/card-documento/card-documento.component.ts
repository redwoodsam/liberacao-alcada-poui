import { Component, EventEmitter, Input, OnInit, output } from '@angular/core';
import { Documento, STATUS_DOCUMENTO } from '../../../../../shared/interfaces/documento';
import { formataNumeroMoeda } from '../../../../../shared/utils/utils';
import { PoDropdownAction } from '@po-ui/ng-components';

@Component({
  selector: 'app-card-documento',
  templateUrl: './card-documento.component.html',
  styleUrl: './card-documento.component.scss'
})
export class CardDocumentoComponent implements OnInit {

  @Input()
  documento: Documento = {} as Documento;

  @Input()
  saldoAtual: any = {};

  acoesDocumento: Array<PoDropdownAction> = []


  // Eventos de saída para interações
  verDetalhes = output<any>();
  aprovar     = output<any>();
  rejeitar    = output<any>();
  bloquear    = output<any>();
  estornar    = output<any>();
  transferir  = output<any>();


  size: number = 240;


  ngOnInit(): void {
    this.acoesDocumento = [{label: 'Ver Detalhes'    , action: this.clickVerDetalhes.bind(this)}]

    if (this.documento.status === STATUS_DOCUMENTO.Pendente) {
      this.acoesDocumento.push(
        {label: 'Aprovar'         , action: this.clickAprovar.bind(this)},
        {label: 'Rejeitar'        , action: this.clickRejeitar.bind(this)},
        {label: 'Bloquear'        , action: this.clickBloquear.bind(this)},
      )

      if(this.saldoAtual.codSuperior) {

        this.acoesDocumento.push(
          {label: 'Transferir para' , action: this.clickTransferir.bind(this)}
        );

      }

    }

    if (this.documento.status === STATUS_DOCUMENTO.Aprovado) {
      this.acoesDocumento.push(
        {label: 'Estornar'        , action: this.clickEstornar.bind(this)}
      )
    }

  }

  protected clickVerDetalhes(event: any): void {
    this.verDetalhes.emit(
      {
        ...this.documento,
        tituloFormatado: this.tituloDocumentoFormatado
      }
    );
  }

  protected clickAprovar(event: any): void {
    this.aprovar.emit(
      {
        ...this.documento,
        tituloFormatado: this.tituloDocumentoFormatado
      }
    );
  }

  protected clickRejeitar(event: any): void {
    this.rejeitar.emit(
      {
        ...this.documento,
        tituloFormatado: this.tituloDocumentoFormatado
      }
    );
  }

  protected clickBloquear(event: any): void {
    this.bloquear.emit(
      {
        ...this.documento,
        tituloFormatado: this.tituloDocumentoFormatado
      }
    );
  }

  protected clickEstornar(event: any): void {
    this.estornar.emit(
      {
        ...this.documento,
        tituloFormatado: this.tituloDocumentoFormatado
      }
    );
  }

  protected clickTransferir(event: any): void {
    this.transferir.emit(
      {
        ...this.documento,
        tituloFormatado: this.tituloDocumentoFormatado
      }
    );
  }

  protected get tituloDocumentoFormatado (): string {
    const tipoDocumento = this.obtemTipoDocumentoPorExtenso(this.documento.tipo);
    const idDocumento = this.documento.doc || 'ID Desconhecido';
    return `${tipoDocumento} #${idDocumento}`;
  }

  protected get valorTotalFormatado(): string {
    return formataNumeroMoeda(this.documento.valorTotal);
  }

  private obtemTipoDocumentoPorExtenso(tipo: string): string {
    switch (tipo) {
      case 'IP':
        return 'Pedido de Compra'
      case 'PC':
        return 'Pedido de Compra'
      case 'SC':
        return 'Solicitação de Compra'
      case 'CT':
        return 'Contrato'
      case 'MD':
        return 'Medição de Contrato'
      case 'FAT':
        return 'Fatura'
      default:
        return 'Documento';
    }
  }

}
