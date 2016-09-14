import {Component} from '@angular/core';
import {Platform, NavController, Alert, Loading} from 'ionic-angular';
import {Http, Headers, RequestOptions} from '@angular/http';
import {Parametros} from '../../models/ParametroModel';
import {SinistroService} from './sinistroservice';
import {UtilService} from '../../util/UtilService'
import {SinistroDetalhePage} from "../sinistroDetalhe/sinistroDetalhe";
import {DadosCompartilhados} from '../../models/DadosCompartilhados';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import {HeaderAppGimenes} from '../../controllers/header';

declare var navigator: any;
declare var Connection: any;

@Component({
  templateUrl: 'build/pages/sinistro/sinistro.html',
	directives: [HeaderAppGimenes]
})
export class SinistroPage {
  public listaProcessos: any;
  constructor(private platform: Platform, private http: Http, private navCtrl: NavController) {
	}

  ngOnInit() {

    this.platform.ready().then(() => {

      this.buscaListaSinistros();
    });
  }

  public buscaListaSinistros(){

    new UtilService(this.platform).checkNetwork().then((data) => {

      //Verificar se o usuário está conectado na internet, se sim, vamos trazer os dados da internet e armazenar na tabela
      if(data.PossuiConexao)
      {
        this.atualizarListaSinistros();
      }
      else { //Não possui conexão, então busca da base local
        this.buscarListaSinistrosLocal();
      }
    });
  }

  public buscarListaSinistrosLocal(){
    this.platform.ready().then(() => {

      this.listaProcessos = [];

      new SinistroService().buscarProcessosBaseLocal().then((data) => {
        for(var i = 0; i < data.rows.length; i++)
        {
          this.listaProcessos.push(data.rows.item(i));
        }
      });
    });
  }

  public atualizarListaSinistros(){

    this.platform.ready().then(() => {

    	var loading = Loading.create({content: "Aguarde..."});
			this.navCtrl.present(loading);

      new UtilService(this.platform).checkNetwork().then((data) => {

        //Verificar se o usuário está conectado na internet, se sim, vamos trazer os dados da internet e armazenar na tabela
        if(data.PossuiConexao)
        {
          let token:string = DadosCompartilhados.getToken();
          let headers = new Headers();
          headers.append("token", token);
          headers.append("Content-Type", "application/json");
          let options = new RequestOptions({headers: headers});
          let url:string = Parametros.URL_AMBIENTE +"/Processos";

          this.http.get(url, options)
            .map( res => res.json())
            .subscribe(
              data => {
                this.listaProcessos = data;
                this.gravarListaSinistrosLocal();
								loading.dismiss();
              },
              error => {
								let alert = Alert.create({
									title: 'Atenção',
									subTitle: 'Ocorreu um erro ao buscar os Sinistros!',
									buttons: ["OK"]
								});
								loading.dismiss();
								this.navCtrl.present(alert);
              }
            );
        }
        else {
          let alert = Alert.create({
            title: 'Sem conexão',
            subTitle: 'Você está sem conexão com a Internet!',
            buttons: ["OK"]
          });
					loading.dismiss();
          this.navCtrl.present(alert);
        }
      });
    });
  }

  public itemSelected(item){
    this.navCtrl.push(SinistroDetalhePage, { sinistro: item});
  }

  public gravarListaSinistrosLocal(){
    new SinistroService().gravarProcessosBaseLocal(this.listaProcessos);
  }
}
