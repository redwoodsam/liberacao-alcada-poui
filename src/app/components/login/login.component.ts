import { Component } from '@angular/core';
import { PoCheckboxGroupOption, PoDialogService, PoNotificationService, PoSelectOption } from '@po-ui/ng-components';
import { PoPageLogin, PoPageLoginCustomField, PoPageLoginLiterals } from '@po-ui/ng-templates';
import { Router } from '@angular/router';
import { UserService } from '../core/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loadingLogin = false;
  background: string = '';
  contactEmail: string = '';
  customField: any;
  customFieldOption: any;
  customFieldOptions: Array<PoSelectOption> = [];
  customLiterals: any;
  environment: string = '';
  exceededAttempts: number = 0;
  secondaryLogo: string = '';
  literals: string = '';
  login: string = ' ';
  loginPattern: string = '';
  loginError: string = '';
  loginErrors: Array<string> = [];
  logo: string = '';
  passwordError: string = '';
  passwordErrors: Array<string> = [];
  passwordPattern: string = '';
  productName: string = '';
  properties: Array<string> = [];
  recovery: string = '';
  registerUrl: string = '';
  support: string = '';

  public readonly propertiesOptions: Array<PoCheckboxGroupOption> = [
    { value: 'hideRememberUser', label: 'Hide remember user' },
    { value: 'loading', label: 'Loading' }
  ];

  constructor(private poDialog: PoDialogService, private router: Router, private userService: UserService, private poNotificationService: PoNotificationService) { }

  ngOnInit() {
    this.restore();
  }

  addCustomFieldOption() {
    this.customFieldOptions.push({ label: this.customFieldOption.label, value: this.customFieldOption.value });
    this.customField.options = this.customFieldOptions;
    this.onChangeCustomProperties();

    this.customFieldOption = {};
  }

  addLoginError() {
    this.loginErrors.push(this.loginError);
    this.loginError = '';
  }

  addPasswordError() {
    this.passwordErrors.push(this.passwordError);
    this.passwordError = '';
  }

  changeLiterals() {
    try {
      this.customLiterals = JSON.parse(this.literals);
    } catch {
      this.customLiterals = undefined;
    }
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
          this.poNotificationService.error("Usuário e/ou senha incorretos. Tente novamente.")
        }
      }));

  }

  onChangeCustomProperties() {
    this.customField = Object.assign({}, this.customField);
  }

  restore() {
    this.properties = [];
    this.background = '';
    this.contactEmail = '';
    this.customField = { property: undefined };
    this.customFieldOption = { label: undefined, value: undefined };
    this.customFieldOptions = [];
    this.customLiterals = undefined;
    this.environment = '';
    this.exceededAttempts = 0;
    this.secondaryLogo = '';
    this.literals = '';
    this.login = '';
    this.loginPattern = '';
    this.loadingLogin = false;
    this.loginError = '';
    this.loginErrors = [];
    this.logo = 'https://www.aldbioenergia.com.br/wp-content/uploads/ald-bio.svg';
    this.passwordError = '';
    this.passwordErrors = [];
    this.passwordPattern = '';
    this.passwordError = '';
    this.passwordErrors = [];
    this.productName = '';
    this.recovery = '';
    this.registerUrl = '';
    this.support = '';
  }
}
