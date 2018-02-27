import { FieldMessage } from './../models/fieldmessage';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { StorageServices } from '../services/storage.service';
import { AlertController } from 'ionic-angular';

@Injectable()

export class ErrorInterceptor implements HttpInterceptor{

    constructor(public storage : StorageServices, public alertCtrl : AlertController){

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
        return next.handle(req)
        .catch((error, caught) => {

            let errorObj = error;

            if(errorObj.error)
            {
                errorObj = errorObj.error;
                
            }

            if(!errorObj.status)
            {
                errorObj = JSON.parse(errorObj);
            }

            console.log(errorObj);

            switch(errorObj.status){
                case 401:
                this.handler401();
                break;

                case 403:
                this.handler403();
                break;

                case 422:
                this.handler422(errorObj);
                break;

                default:
                this.handlerDefaulError(errorObj);
            }

            return Observable.throw(errorObj);
        }) as any;
    }

    handler403()
    {
        this.storage.setLocalUser(null);
    }

    handler401()
    {
        let alert = this.alertCtrl.create({
            title: 'Erro 401: falha de autenticação',
            message: 'E-mail ou senha incorretor',
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: 'Ok'
                }
            ]
        });
        alert.present();
    }

    handlerDefaulError(errorObj)
    {
        let alert = this.alertCtrl.create({
            title: 'Erro ' + errorObj.status + ': ' + errorObj.error,
            message: errorObj.message,
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: 'Ok'
                }
            ]
        });
        alert.present();
    }

    handler422(errorObj)
    {
        let alert = this.alertCtrl.create({
            title: 'Error 422: Validação',
            message: this.listErrors(errorObj.errors),
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: 'Ok'
                }
            ]
        });
        alert.present();
    }

    private listErrors(messages : FieldMessage[]) : string {
        let s : string = '';
        for (var i=0; i<messages.length; i++)
        {
            s = s + '<p><strong>' + messages[i].fieldName + '</strong> :' + messages[i].message + '</p>';
        }
        return s;
    }
}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true,
}