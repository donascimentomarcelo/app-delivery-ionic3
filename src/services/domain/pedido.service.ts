import { PedidoDTO } from './../../models/pedido.dto';
import { API_CONFIG } from './../../config/api.config';
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class PedidoService {

    constructor(public http: HttpClient){

    }

    save(pedido: PedidoDTO)
    {
        return this.http.post(
            `${API_CONFIG.baseUrl}/pedidos`,
            pedido,
            {
                observe: 'response',
                responseType: 'text'
            }
        );
    }
}