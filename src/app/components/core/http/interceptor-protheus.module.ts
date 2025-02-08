import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorProtheus } from './interceptor-protheus.service';
import { UserService } from '../user/user.service';

@NgModule({
  providers: [
    InterceptorProtheus,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorProtheus,
      multi: true,
    }
  ],
})
export class InterceptorProtheusModule {}