import {Component, enableProdMode} from '@angular/core';
import {Platform, ionicBootstrap} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {HomePage} from './pages/home/home';
import {DadosCompartilhados} from './models/DadosCompartilhados';
import {UtilService} from './util/UtilService';
import {HeaderAppGimenes} from './controllers/header';
import {Parametros} from './models/ParametroModel';

@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>',
  providers: [UtilService, Parametros],
	directives: [HeaderAppGimenes, DadosCompartilhados]
})
export class GimenesApp {
  rootPage: any = HomePage;

  constructor(platform: Platform) {
    platform.ready().then(() => {

    	//Iniciar o processo de localização de coordenadas
			new UtilService(platform).buscarCoordenadas()
				.then((obj => {
					console.log(JSON.stringify(obj));
				}))
				.catch((err) => {
					console.log(JSON.stringify(err));
				});


      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }
}
enableProdMode();
ionicBootstrap(GimenesApp);
