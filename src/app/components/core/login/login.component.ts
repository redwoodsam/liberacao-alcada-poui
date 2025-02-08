import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PoDialogService, PoNotificationService } from '@po-ui/ng-components';
import { PoPageLogin, PoPageLoginLiterals } from '@po-ui/ng-templates';

import { UserService } from '../core/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  customLiterals: PoPageLoginLiterals = {
    yourUserWillBeBlocked: '',
    loginHint: '',
    passwordLabel: '',
    highlightInfo: '',
    loginLabel: '',
    loginPlaceholder: 'Digite seu email ou usuário',
    passwordPlaceholder: 'Digite sua senha',
    welcome: 'Seja bem vindo ao portal PO-UI com Paulo Bindo',
    titlePopover: 'Teste Popover',
    submitLabel: 'Entrar no sistema',
    ifYouTryHarder: 'ifYouTryHarder',
    loginErrorPattern: 'loginErrorPattern',
    passwordErrorPattern: 'passwordErrorPattern',
    registerUrl: 'registerUrl',
    rememberUser: '',
    rememberUserHint: '',
    submittedLabel: '',
    support: '',
    attempts: '',
    createANewPasswordNow: '',
    customFieldErrorPattern: '',
    customFieldPlaceholder: '',
    forgotPassword: '',
    forgotYourPassword: '',
    iForgotMyPassword: '',
  }
  loadingLogin = false;
  
  constructor(
    private userService: UserService,
    private router: Router,
    private poNotificationService: PoNotificationService,
  ) { }

  ngOnInit(): void {
  }

  loginSubmit(formData: PoPageLogin) {    
    this.loadingLogin = true;
    this.userService.authenticatication(formData.login, formData.password, 'password')
      .subscribe(({
        next: () => {
          this.loadingLogin = false;
          this.router.navigate(['home']);
        },
        error: (err) => {
          this.loadingLogin = false;
          this.poNotificationService.error(err.error.message)
          console.log(err);
        }
      }));

  }

}
