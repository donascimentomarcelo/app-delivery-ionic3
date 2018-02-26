import { API_CONFIG } from './../../config/api.config';
import { ClienteDTO } from './../../models/cliente.dto';
import { Observable } from 'rxjs/Rx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageServices } from '../storage.service';

@Injectable()
export class ClienteService {

    constructor(public http: HttpClient, public storage: StorageServices){

    }

    findByEmail(email: string) : Observable<ClienteDTO>{
        
        // [TEMPORARIO] incluindo cabeçalho Authorization

        let token = this.storage.getLocalUser().token;
        let authHeader = new HttpHeaders({'Authorization': 'Bearer ' + token});
        console.log(authHeader)
        // [TEMPORARIO] incluindo cabeçalho Authorization
    
        return this.http.get<ClienteDTO>(
            `${API_CONFIG.baseUrl}/clientes/email?email=${email}`,
            {'headers': authHeader});
    }

    getImageFromBucket(id : string) : Observable<any>{
        let url = `${API_CONFIG.bucketBaseUrl}/cp${id}.jpg`
        //blob significa do tipo imagem
        return this.http.get(url, {responseType : 'blob'});
    }


}