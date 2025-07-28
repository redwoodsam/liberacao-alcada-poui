import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, share } from 'rxjs';

import { JwtToken } from './user';
import { environment } from '../../../../environments/environment';

const API = environment.baseUrl;

@Injectable({ providedIn: 'root' })
export class UserService {

    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json; charset=UTF-8',
            Accept: 'application/json; charset=UTF-8',
            'X-PO-No-Message': 'true',
        }),
    };

    configToken: any;
    private userName: string = '';
    private codUserName: string = '';
    private accessToken: string = '';
    private refreshToken: string = '';
    private jwtToken?: JwtToken;

    constructor(
        private http: HttpClient,
    ) { }

    authenticatication(userName: string = '', password: string = '', granType: string, refresh_token: string = ''): Observable<any> {
        let encodedPassword = encodeURI(password)
        return this.http.post(`${API}/api/oauth2/v1/token?grant_type=${granType}&password=${encodedPassword}&username=${userName}&refresh_token=${refresh_token}`, {}, this.httpOptions)
            .pipe(
                share(),
                map((res: any) => {
                    if (refresh_token) {
                        this.configToken = JSON.parse(localStorage.getItem('AUTH_TOKEN')!);
                        this.configToken.access_token = res.access_token;
                        localStorage.setItem('AUTH_TOKEN', JSON.stringify(this.configToken));
                        this.guardRouter();
                    } else {
                        this.guardRouter(JSON.stringify(res));
                        localStorage.setItem('AUTH_TOKEN', JSON.stringify(res));
                    }
                })
            );
    }

    isLogged() {
        return this.userName;
    }

    guardRouter(cTokenConfig: string = '') {
        if (cTokenConfig) {
            this.configToken = JSON.parse(cTokenConfig);
        } else {
            this.configToken = JSON.parse(localStorage.getItem('AUTH_TOKEN')!);
        }
        if (this.configToken !== null) {
            this.accessToken = this.configToken.access_token;
            this.refreshToken = this.configToken.refresh_token;
            this.jwtToken = this.parseJwt(this.accessToken);

            const names = this.jwtToken.sub.split('@')[0].split('.');
            this.codUserName = this.jwtToken.userid;
            this.userName = '';

            for (let index = 0; index < names.length; index++) {
                const element = names[index];
                this.userName += element.charAt(0).toUpperCase() + element.slice(1) + ' ';
            }
            this.userName = this.userName.trim();
        } else {
            this.userName = '';
        }
    }

    logout() {
        this.userName = '';
        localStorage.removeItem('AUTH_TOKEN');
    }

    getUserName() {
        return this.userName;
    }

    getCodUserName() {
        return this.codUserName;
    }

    getToken() {
        return this.configToken;
    }

    getRefreshToken() {
        return this.refreshToken;
    }

    getJwtTokenExipiresIn() {
        return this.jwtToken?.exp ? this.jwtToken.exp * 1000 : 1 * 1000;
    }

    private parseJwt(token: string) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        var jwtToken: JwtToken;

        jwtToken = JSON.parse(jsonPayload);
        return jwtToken;
    }
}