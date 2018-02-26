import { API_CONFIG } from './../config/api.config';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { StorageServices } from '../services/storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor{

    constructor(public storage: StorageServices){

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
        
        let localUser = this.storage.getLocalUser();

        let N = API_CONFIG.baseUrl.length;
        let requestAPI = req.url.substring(0, N) == API_CONFIG.baseUrl;

        if(localUser && requestAPI)
        {
            const authReq = req.clone({headers: req.headers.set('Authorization', 'Bearer ' + localUser.token)});
            return next.handle(authReq);
        }
        else
        {
            return next.handle(req);
        }
        
    }
}

export const AuthInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
};
