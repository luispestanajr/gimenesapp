/**
 * Created by junin on 26/07/2016.
 */
import {Component} from '@angular/core';
import {Platform, NavController, NavParams} from 'ionic-angular';
import {UtilService} from '../../util/UtilService';

import {Http, Headers, RequestOptions} from '@angular/http';
import {DadosCompartilhados} from '../../models/DadosCompartilhados';
import {DiligenciaModel} from '../../models/DiligenciaModel';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import {HeaderAppGimenes} from '../../controllers/header';
import {Parametros} from '../../models/ParametroModel';
import {UploadFoto} from "../uploadFoto/uploadFoto";

@Component({
  templateUrl: 'build/pages/diligencia/diligencia.html',
	directives: [HeaderAppGimenes, DadosCompartilhados]
})
export class DiligenciaPage {

	//Propriedades da classe
	idProcesso: string;
  objDiligencia: DiligenciaModel;
	token: string;


  constructor(private platform: Platform, private navCtrl: NavController,
							private navParams: NavParams, private utilService: UtilService, private http: Http){

  	//Buscar o token
		this.token = DadosCompartilhados.getToken();

		//Buscar os dados oriundos da tela anterior
    this.objDiligencia = this.navParams.get("diligencia");
		this.idProcesso = this.navParams.get("idProcesso");
  }

  ngOnInit() {

    this.platform.ready().then(() => {
      this.carregarTelaDiligencia();
    });
  }

  public carregarTelaDiligencia(){

    //Verificar se possui conexao com a internet
    if(this.utilService.checkNetwork().then((obj) => obj.PossuiConexao))
    {
      //Sim, então busca os dados da internet
      this.buscarDadosDiligencia();
    }
    else {
      //Sem conexão, buscar dados locais
      this.buscarDadosDiligenciaLocal();
    }
  }

  public buscarDadosDiligencia(){

    let headers = new Headers();
    headers.append("token", this.token);
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({headers: headers});
    let url:string = Parametros.URL_AMBIENTE + `/Diligencias/Detalhe/${this.objDiligencia.ID_DILIGENCIA}`;

    this.http.get(url, options)
      .map( res => res.json())
      .subscribe(
        data => {
          console.log(data);
          //this.listaProcessos = data;
          //this.gravarListaSinistrosLocal();
        },
        error => {
          console.log('ocorreu um erro: ' + JSON.stringify(error.json()));
        }
      );
  }

  public buscarDadosDiligenciaLocal(){

  }

	public adicionarFotoDiligencia(){

		this.navCtrl.push(UploadFoto, {idDiligencia: this.objDiligencia.ID_DILIGENCIA, idProcesso: this.idProcesso});
	}
}
