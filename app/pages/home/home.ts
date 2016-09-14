import {Component} from '@angular/core';
import {Platform, NavController} from 'ionic-angular';
import {LoginPage} from '../login/login';
import {SinistroPage} from '../sinistro/sinistro';
import {LoginService} from '../login/loginService';
import {DadosCompartilhados} from '../../models/DadosCompartilhados';
import {UtilService} from "../../util/UtilService";


@Component({
  templateUrl: 'build/pages/home/home.html',
	directives: [DadosCompartilhados]
})
export class HomePage {

  constructor(private platform: Platform, private navCtrl: NavController, private objUtil: UtilService) {}

  ngOnInit() {
    this.platform.ready().then(() => {
      new LoginService().verificarUsuarioJaLogou()
        .then((retorno) =>{
          let usuarioJaLogou:boolean;

          //Setar a variável
          usuarioJaLogou = retorno.res.rows.length > 0;

          if (!usuarioJaLogou)
            this.navCtrl.setRoot(LoginPage);
          else {
            //Pega o primeiro login da tabela local
            let objLogin = retorno.res.rows.item(0);

            //Setar o token
						DadosCompartilhados.setToken(objLogin.token);

            //Redireciona para a tela de sinistros
            this.navCtrl.setRoot(SinistroPage);
          }
        })
        .catch((retorno) =>{
          console.log(retorno);

          //Se der erro na consulta, direciona para a tela de login
          this.navCtrl.setRoot(LoginPage);
        })
    });
  }
}
