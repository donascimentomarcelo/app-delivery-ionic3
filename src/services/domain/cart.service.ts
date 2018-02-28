import { ProdutoDTO } from './../../models/produto.dto';
import { Injectable } from '@angular/core';
import { StorageServices } from './../storage.service';
import { Cart } from '../../models/cart';

@Injectable()
export class CartService {

    constructor(public storage: StorageServices){

    }

    createOrClearCart() : Cart
    {
        let cart: Cart = {items: []};
        this.storage.setCart(cart);
        return cart;
    }

    getCart() : Cart
    {
        let cart: Cart = this.storage.getCart();
        
        if(cart == null)
        {
            cart = this.createOrClearCart();
        }

        return cart;
    }

    addProduto(produto: ProdutoDTO) : Cart
    {
        let cart = this.getCart();
        let position = cart.items.findIndex(x => x.produto.id == produto.id);

        // -1 é retornado pelo index se o id do produto n for encontrado no findIndex
        if(position == -1)
        {
            cart.items.push({quantidade: 1, produto: produto});
        }

        this.storage.setCart(cart);
        return cart;
    }
}