import {Component} from '@angular/core';
import {NavController, Loading} from 'ionic-angular';
import {Http, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Parametros} from '../../models/ParametroModel';
import {LoginService} from './loginService';
import {SinistroPage} from '../sinistro/sinistro';
import {HeaderAppGimenes} from '../../controllers/header';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import {DadosCompartilhados} from '../../models/DadosCompartilhados';

@Component({
  templateUrl: 'build/pages/login/login.html',
	directives: [HeaderAppGimenes, DadosCompartilhados]
})
export class LoginPage {
	loading: any;
  public email: string;
  public senha: string;
  public static token: string;
  constructor(private http: Http, private navCtrl: NavController) {}

  public efetuarLogin(){
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers });
    let url:string = Parametros.URL_AMBIENTE + "/Login";

		this.loading = Loading.create({content: "Aguarde..."});
		this.navCtrl.present(this.loading);

    this.http.post(url,
                  "{'EMAIL':'" + this.email + "', 'SENHA':'" + this.senha + "'}", options)
                  .toPromise()
                  .catch(this.handleError)
                  .then((res:any) => {

                      let retorno = JSON.parse(res._body); //Pega o Json de Retorno

                      //Criar o usuário na base de dados
                      new LoginService().criarUsuarioBaseDados(retorno.NOME, retorno.EMAIL, retorno.TOKEN).then((retornoGravaBase) => {

                        if(retornoGravaBase) //Se o login foi feito e gravou na base local, então vamos partir para a tela de sinistros
                        {
													//Setar o token
													DadosCompartilhados.setToken(retorno.TOKEN);

													//Esconder o box de carregando
													this.loading.dismiss();

                          //Redireciona para a tela de sinistros
                          this.navCtrl.setRoot(SinistroPage);
                        }
                      });
                  });
  }

  handleError(error: any) {
		//Esconder o carregando
		this.loading.dismiss();

      let body = JSON.parse(error._body);
      if(error.status === 404)
        alert(body.MSG_ERRO);

      return Observable.throw(error.json().error || 'Server error');
  }
}
