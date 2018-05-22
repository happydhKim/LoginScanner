import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Platform } from 'ionic-angular';
//import { TabsPage } from '../tabs/tabs';		//추후에 탭을 사용하려면 주석 해제 후 사용.
import { HomePage } from '../home/home';
import { Http } from '@angular/http';
//import { NativeStorage } from '@ionic-native/native-storage';
//import { GlobalProvider } from "../../providers/global/global";

import { ShareService } from '../../services/share/share';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  adminName: string;
  data:any = {};

  public unregisterBackButtonAction: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public shareService: ShareService,
  			  public events: Events, public platform: Platform) {
	
  	this.data.username = '';
  	this.data.userpw   = '';
  	this.data.response = '';

  	this.http = http;

	shareService.setAdminName(this.data.response);

	events.subscribe('shareObject',(dummy, dummyNumber) => {
		console.log('hi,', dummy.adminName, ' dummyNumber:', dummyNumber)
	});
  	
  }

  ionViewDidLoad() {
        this.initializeBackButtonCustomHandler();
  }
 
  ionViewWillLeave() {
      // Unregister the custom back button action for this page
      this.unregisterBackButtonAction && this.unregisterBackButtonAction();
  }

  initializeBackButtonCustomHandler(): void {
      this.unregisterBackButtonAction = this.platform.registerBackButtonAction(function(event){
          console.log('뒤로가기 방지.');
      }, 101); 
  }

  //ionViewDidLoad() {
  //  console.log('ionViewDidLoad LoginPage');
  //}
  enter(event) {
  	
  	var link = 'yourserverurl';
   	var myData = JSON.stringify({username: this.data.username, userpw: this.data.userpw});
  	
  	this.http.post(link, myData)
	.subscribe(data => {
		this.data.response = data["_body"];
		var userInfo = this.data.response.split(" ");
		if(this.data.response !="") {
			alert(userInfo[0]+"님 반갑습니다. 스캔페이지로 이동합니다.");
			this.navCtrl.push(HomePage, {
				param1: userInfo[0],
				param2: userInfo[1]
			});
		} else {
			alert("아이디와 비밀번호가 틀립니다.");
		}

	}, error => {
		console.log("Oooops!");
	});
 	
 }
 	
}
