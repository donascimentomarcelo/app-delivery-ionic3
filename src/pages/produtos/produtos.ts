import { API_CONFIG } from './../../config/api.config';
import { ProdutoService } from './../../services/domain/produto.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ProdutoDTO } from '../../models/produto.dto';

@IonicPage()
@Component({
  selector: 'page-produtos',
  templateUrl: 'produtos.html',
})
export class ProdutosPage {

  items : ProdutoDTO[] = [];

  page : number = 0;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public produtoService : ProdutoService,
    public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {  
    let categoria_id = this.navParams.get('categoria_id');

    let loader = this.presentLoading();

    this.produtoService.findByCategoria(categoria_id, this.page, 10)
      .subscribe(response => {
        let start = this.items.length;
        this.items = this.items.concat(response['content']);
        let end = this.items.length -1;
        this.loadImageUrls(start, end);
        console.log(this.page);
        console.log(this.items);
        loader.dismiss();
      }, error => {
        loader.dismiss();
      });
  }
  

  loadImageUrls(start : number, end : number)
  {
    for(var i=start; i<=end; i++)
    {
      let item = this.items[i];
      this.produtoService.getSmallImageFromBucket(item.id)
        .subscribe(response => {
          item.imageUrl = `${API_CONFIG.bucketBaseUrl}/prod${item.id}-small.jpg`;
        }, 
        error => {})
    }
  }

  showDetail(codigo : string)
  {
    this.navCtrl.push('ProdutoDetailPage', {produto_id: codigo});
  }

  presentLoading()
  {
    let loader = this.loadingCtrl.create({
      content: "Aguarde..."
    });

    loader.present();
    return loader;
  }

  doRefresh(refresher) 
  {
    this.page = 0;
    this.items = [];
    this.ionViewDidLoad();
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

  doInfinite(infiniteScroll) 
  {
    this.page++;
    this.ionViewDidLoad();
    setTimeout(() => {
      infiniteScroll.complete();
    }, 1000);
  }

}
