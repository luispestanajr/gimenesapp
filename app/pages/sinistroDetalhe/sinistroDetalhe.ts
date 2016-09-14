import {Component} from '@angular/core';
import {Platform, NavController, NavParams} from 'ionic-angular';
import {UtilService} from '../../util/UtilService';

import {Http, Headers, RequestOptions} from '@angular/http';
import {Parametros} from '../../models/ParametroModel';
import {DadosCompartilhados} from '../../models/DadosCompartilhados';
import {DiligenciaModel} from '../../models/DiligenciaModel';
import {DiligenciaPage} from '../diligencia/diligencia';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import {HeaderAppGimenes} from '../../controllers/header';

@Component({
  templateUrl: 'build/pages/sinistroDetalhe/sinistroDetalhe.html',
	directives: [HeaderAppGimenes]

})
export class SinistroDetalhePage {

  public idProcesso: number;
  public numeroSinistro: string;
  public nomeSegurado: string;
  public listaDiligencias: DiligenciaModel[];

  constructor(private platform: Platform, private navCtrl: NavController,
							private navParams: NavParams, private utilService: UtilService, private http: Http){

    //Inicializa a lista de diligências
    this.listaDiligencias = [];
  }

  ngOnInit() {

    this.platform.ready().then(() => {
      this.buscarDiligenciasProcesso();
    });
  }

  buscarDiligenciasProcesso(){

    let objSinistro = this.navParams.get("sinistro");
    this.idProcesso = objSinistro.ID_PROCESSO;
    this.numeroSinistro = objSinistro.NUMERO_SINISTRO;
    this.nomeSegurado = objSinistro.NOME_SEGURADO;

    //Efetuar a chamada via internet ou base local
    this.utilService.checkNetwork().then((data) => {

      if(data.PossuiConexao)
        this.atualizarListaDiligencias();
      else
        this.buscarListaDiligenciasLocal();
    });
  }

  public atualizarListaDiligencias(){
  	this.listaDiligencias = [];
      let token:string = DadosCompartilhados.getToken();
      let headers = new Headers();
      headers.append("token", token);
      headers.append("Content-Type", "application/json");
      let options = new RequestOptions({headers: headers});
      let url:string = Parametros.URL_AMBIENTE +"/Diligencias/" + this.idProcesso;

      this.http.get(url, options)
        .map( res => res.json())
        .subscribe(
          data => {
            for(let i = 0; i < data.length; i++)
            {
              let objDiligenciaModel: DiligenciaModel = data[i];
              this.listaDiligencias.push(objDiligenciaModel);
            }

            this.gravarListaDiligenciasLocal(data);
          },
          error => {
            console.log('ocorreu um erro: ' + JSON.stringify(error.json()));
          }
        );
  }

  public buscarListaDiligenciasLocal(){

  }

  public gravarListaDiligenciasLocal(objListaDiligencias: DiligenciaModel[]){

  }

  public visualizarDetalheDiligencia(objItem: DiligenciaModel)
  {
    this.navCtrl.push(DiligenciaPage, {diligencia: objItem, idProcesso: this.idProcesso});
  }
}
