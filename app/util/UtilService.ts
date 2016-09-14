import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import {ConexaoInternetModel} from '../models/ConexaoInternetModel';
import { Geolocation } from 'ionic-native';

declare var navigator: any;
declare var Connection: any;

@Component({})
export class UtilService {

  constructor(private platform: Platform) {}

  public checkNetwork():Promise<ConexaoInternetModel> {
    var platforma: Platform = this.platform;
    var objConexaoInternetMovel = new ConexaoInternetModel();

    let promise = new Promise(function (resolve, reject) {

      try{
        platforma.ready().then(() => {

          if(navigator.connection) {
            var networkState = navigator.connection.type;
            var states = {};
            states[Connection.UNKNOWN] = 'Unknown connection';
            states[Connection.ETHERNET] = 'Ethernet connection';
            states[Connection.WIFI] = 'WiFi connection';
            states[Connection.CELL_2G] = 'Cell 2G connection';
            states[Connection.CELL_3G] = 'Cell 3G connection';
            states[Connection.CELL_4G] = 'Cell 4G connection';
            states[Connection.CELL] = 'Cell generic connection';
            states[Connection.NONE] = 'No network connection';

            //Definindo o retorno
            objConexaoInternetMovel.PossuiConexao = networkState != undefined;
            objConexaoInternetMovel.TipoConexao = states[networkState];
          }
          else
          {
            //Definindo o retorno
            objConexaoInternetMovel.PossuiConexao = true;//navigator.onLine;
            objConexaoInternetMovel.TipoConexao = navigator.platform;
          }

          resolve(objConexaoInternetMovel);
        });
      }
      catch (err) {
          reject(err);
      }
    });

    return promise;
  }

  public buscarCoordenadas(): Promise<any>{
		let promise = new Promise(function (resolve) {

			try {
				var options = {
					enableHighAccuracy: true,
					timeout: 5000,
					maximumAge: 0
				};

				Geolocation.getCurrentPosition(options).then((resp) => {
					resolve({erro: false, latitude: resp.coords.latitude, longitude: resp.coords.longitude});
				}).catch(() => {
					resolve({erro: true, latitude: 0, longitude: 0});
				});
			}
			catch(err)
			{
				resolve(null);
			}
		});

		return promise;
	}

	static newGuid() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
		});
	}
}
