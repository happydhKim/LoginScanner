import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Platform } from 'ionic-angular';
import { Http } from '@angular/http';
import { LoginPage } from '../login/login';
//import { GlobalProvider } from "../../providers/global/global";
//import { NativeStorage } from '@ionic-native/native-storage';
import { ModalController, ViewController } from 'ionic-angular';
import { ShareService } from '../../services/share/share';

import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
 
  parameter1: string;
  parameter2: string;
  serviceData: string;

  type={ };
  data={ };
  info:any = {};

  public unregisterBackButtonAction: any;
  option:BarcodeScannerOptions
  constructor(public navCtrl: NavController, public http: Http, public barcodeScanner:BarcodeScanner, public navParams: NavParams,
              public events: Events, shareService:ShareService, public platform: Platform ) {

    this.parameter1 = navParams.get('param1'); //admin 이름 가지고 옴.
    this.parameter2 = navParams.get('param2'); //admin 아이디 가지고 옴.

    this.serviceData = shareService.getAdminName();
    //alert(this.parameter1+" "+this.parameter2);
    let dummy = {
      adminName: "John doe"
    }

    events.publish("shareObject",dummy,1);

    this.info.invoice_type = '';
    this.info.invoice_code = '';
    this.info.invoice_value = '';

    this.http = http;
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


  scan(e) {
  	var ele = e;
  	    
  	this.option={
    	preferFrontCamera:false,
    	prompt: "QR코드를 사각형에 맞춰주세요."
  	}

  	this.type = ele;
  	this.barcodeScanner.scan(this.option).then((barcodeData) => {
     	console.log(barcodeData);
     	this.data = barcodeData;

      this.info.invoice_type = ele;
      this.info.invoice_code = barcodeData.text;

      var link = 'yureserverurl';
      var myData = JSON.stringify({invoice_type: this.info.invoice_type, invoice_code: this.info.invoice_code});

      this.http.post(link, myData)
      .subscribe(info => {

        this.info.invoice_value = info["_body"];

        var scanInfo = this.info.invoice_value.split(" ");
        var scanType = "";
        var scanCode = "";
        
        if(scanInfo[0] == "Array1" || scanInfo[0] == "Array2") {
          if(scanInfo[0] == "Array1") {
            scanType ="송장출력 확인";
          } else if(scanInfo[0] == "Array2") {
            scanType ="송장 배송완료";
          }
          scanCode = scanInfo[1];
          alert(scanType+"이(가) 완료되었습니다. 송장번호는 "+scanCode+"입니다.");
        }
      }, error => {
        console.log("Oooops!");
      });

	}, (err) => {
    console.log(err);
	});
  }

  logout() {
    alert("로그인 페이지로 이동합니다.");
    this.navCtrl.push(LoginPage);
  }

}
