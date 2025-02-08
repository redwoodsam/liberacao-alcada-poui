import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable, catchError, switchMap, throwError } from "rxjs";

import { PoNotificationService } from "@po-ui/ng-components";

import { environment } from "src/environments/environment";

import { UserService } from "../user/user.service";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

const REFRESH_TOKEN = 'REFRESH_TOKEN';

@Injectable()
export class InterceptorProtheus implements HttpInterceptor {
    constructor(
        private userService: UserService,
        private router: Router,
        private poNotification: PoNotificationService,
    ){}
    
    intercept(
        request: HttpRequest<any>, 
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        let dateExpiresIn: Date;
        let dateNow: Date = new Date();

        // Requisição para autenticação
        if(request.url.includes('/api/oauth2')){
            return next.handle(request).pipe(
                catchError((error) => {
                  return throwError(error);
                })
            );
        }

        // Requisição interna
        /*if(request.url.includes('assets/config')){
          return next.handle(request).pipe(
              catchError((error) => {
                return throwError(error);
              })
          );
        }*/
        
        this.userService.guardRouter();
        if(this.userService.isLogged()){
          dateExpiresIn = new Date(this.userService.getJwtTokenExipiresIn()); // Data que vence o token
          dateNow.setMinutes(dateNow.getMinutes() -2); // Retira 2 minutos da data atual para considerar uma folga no tempo
          
          // Verifica se Token Venceu
          if(dateExpiresIn < dateNow){
            return this.userService.authenticatication('','',REFRESH_TOKEN, this.userService.getRefreshToken())
              .pipe(
                switchMap((auth) => {
                  request = this.addAuthenticationProtheusWithToken(request, this.userService.configToken);
                  return next.handle(request).pipe(
                      catchError((error) => {
                      return throwError(error);
                  }));
                }),
                catchError((error) => {
                  if (error.status === 401) {
                    this.poNotification.error('Usuário e senha vencidos, por favor realizar uma nova autenticação informando seu usuário e senha!');
                    this.userService.logout();
                    this.router.navigate(['login']);
                  }
                  return throwError(error);
                })
              );
          } else {
            request = this.addAuthenticationProtheusWithToken(request, this.userService.getToken());
          }
        }
        
        return next.handle(request).pipe(
            catchError((error) => {
              return throwError(error);
            })
        );
    }

    addAuthenticationProtheusWithToken(
      req: HttpRequest<any>,
      auth: any
    ): HttpRequest<any> {
      // verifica se existe credencial
      if (!auth) {
        return req;
      }

      return req.clone({
        headers: req.headers.set(
          'Authorization',
          `${auth.token_type} ${auth.access_token}`
        ),
      });        
    }

}