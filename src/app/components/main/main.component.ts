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
    { label: 'Liberaçao de documentos', action: this.navigateToHome.bind(this), shortLabel: 'Liberação de documentos', icon: 'po-icon-clipboard' },
    { label: 'Solicitação de compras', action: this.navigateToHome.bind(this), shortLabel: 'Solicitação de compras', icon: 'po-icon-cart' },
    { label: 'Sair', action: this.logout.bind(this), shortLabel: 'Sair', icon: 'po-icon-exit' }
  ];

  constructor(private router:Router) {}

  navigateToHome () {
    this.router.navigate(['home']);
  }

  logout () {
    this.router.navigate(['login']);
  }
}
