import { ImageUtilService } from './../image-util.service';
import { API_CONFIG } from './../../config/api.config';
import { ClienteDTO } from './../../models/cliente.dto';
import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageServices } from '../storage.service';

@Injectable()
export class ClienteService {

    constructor(
        public http: HttpClient, 
        public storage: StorageServices,
        public imageUtilService: ImageUtilService){

    }

    findByEmail(email: string){    
        return this.http.get(`${API_CONFIG.baseUrl}/clientes/email?email=${email}`);
    }

    findById(id: string){
        return this.http.get(`${API_CONFIG.baseUrl}/clientes/${id}`);
    }

    getImageFromBucket(id : string) : Observable<any>{
        let url = `${API_CONFIG.bucketBaseUrl}/cp${id}.jpg`
        //blob significa do tipo imagem
        return this.http.get(url, {responseType : 'blob'});
    }

    save(cliente : ClienteDTO){
        return this.http.post(
            `${API_CONFIG.baseUrl}/clientes`,
            cliente,
            {
                observe: 'response',
                responseType: 'text'
            }
        );
    }

    uploadPicture(picture)
    {
        let pictureBlob = this.imageUtilService.dataUriToBlob(picture);
        let formData: FormData = new FormData();
        formData.set('file', picture, 'file.png');

        return this.http.post(
            `${API_CONFIG.baseUrl}/clientes/picture`,
            formData,
            {
                observe: 'response',
                responseType: 'text'
            }
        );

    }
    

}