import { CredenciaisDTO } from './../../models/credenciais.dto';
import { Component } from '@angular/core';
import { NavController, IonicPage, MenuController } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  creds : CredenciaisDTO = {
    email:"",
    senha:""
  };

  constructor(
      public navCtrl: NavController, 
      public menu: MenuController,
      public auth: AuthService) {

  }

  ionViewWillEnter() {
    this.menu.swipeEnable(false);
  }
  
  ionViewDidLeave() {
    this.menu.swipeEnable(true);
  }

  ionViewDidEnter(){
    this.auth.refreshToken()
    .subscribe(Response => {
      this.auth.successfulLogin(Response.headers.get('Authorization'));
      this.navCtrl.setRoot('CategoriasPage');
    },
    errors => {});
  }

  login(){
    this.auth.authenticate(this.creds)
      .subscribe(Response => {
        this.auth.successfulLogin(Response.headers.get('Authorization'));
        this.navCtrl.setRoot('CategoriasPage');
      },
      errors => {});
  }

  signup(){
    this.navCtrl.push('SignupPage');
  }

}
