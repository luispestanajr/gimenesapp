import {Parametros} from '../../models/ParametroModel';
import {Storage, SqlStorage} from 'ionic-angular';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';


export class LoginService {
  public email:string;
  public senha:string;
  public static token:string;

  constructor() {
  }

  public verificarUsuarioJaLogou():Promise<any> {
    let promise = new Promise(function (resolve, reject) {

      let db = new Storage(SqlStorage, {name: "GimenesApp"});

      try {
        let objRetorno = db.query("SELECT * FROM Login");
        objRetorno.then((data) => {
          resolve(data);
        }).catch((err) =>
        {
          reject(err);
        });
      }
      catch (err) {
        reject(err);
      }
    });

    return promise;
  }

  public criarUsuarioBaseDados(nome: string, email: string, token: string): Promise<boolean> {
    let db = new Storage(SqlStorage, {name: "GimenesApp"});

    let promise = new Promise(function (resolve, reject) {

      try {
        //Dropa a tabela de login se já existir
        console.log('dropando a tabela de login');
        db.query('DROP TABLE IF EXISTS Login').then(() => {
          //Cria a tabela se ela não existir
          console.log('criando a tabela de login');
          db.query('CREATE TABLE IF NOT EXISTS Login (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, email TEXT, token TEXT)').then(() => {
            //Insere os dados
            console.log('inserindo o usuário na tabela de login');
            db.query("INSERT INTO Login (nome, email, token) VALUES ('" + nome + "', '" + email + "', '" + token + "')").then(() => {
              resolve(true);
            })
          });
        });
      }
      catch (err) {
        console.log(err);
        resolve(false);
      }
    });

    return promise;
  }
}
