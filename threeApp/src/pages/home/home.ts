import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Http } from "@angular/http";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, private http: Http) {
  }

}
