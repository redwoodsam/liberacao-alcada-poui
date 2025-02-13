import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PoMenuItem } from '@po-ui/ng-components';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

  readonly menus: Array<PoMenuItem> = [
    { label: 'Liberaçao de documentos', action: () => this.navigateTo('liberacao'), shortLabel: 'Liberação de documentos', icon: 'po-icon-clipboard' },
    { label: 'Solicitação de compras', action: () => this.navigateTo('solicitacoes-compra'), shortLabel: 'Solicitação de compras', icon: 'po-icon-cart' },
    { label: 'Sair', action: this.logout.bind(this), shortLabel: 'Sair', icon: 'po-icon-exit' }
  ];

  constructor(private router:Router) {}

  navigateTo (link: string) {
    this.router.navigate([link]);
  }

  logout () {
    this.router.navigate(['login']);
  }
}
