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
    { label: 'Home', action: this.navigateToHome.bind(this), shortLabel: 'Home', icon: 'po-icon-home' },
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
