import {Component} from '@angular/core';
import {Storage, SqlStorage} from 'ionic-angular';
import {Parametros} from '../../models/ParametroModel';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';

@Component({})
export class SinistroService {

  public gravarProcessosBaseLocal(data:any):Promise<boolean>{
    let db = new Storage(SqlStorage, {name: "GimenesApp"});

    let promise = new Promise(function (resolve) {

      try {
        //Dropa a tabela de login se já existir
        db.query('DROP TABLE IF EXISTS Processos').then(() => {

          //Cria a tabela se ela não existir
          db.query('CREATE TABLE IF NOT EXISTS Processos (id INTEGER PRIMARY KEY AUTOINCREMENT, ID_PROCESSO TEXT, NUMERO_SINISTRO TEXT, NOME_SEGURADO TEXT, ID_EMPRESA TEXT)').then(() => {

            //Percorrer o retorno
            for(let i = 0; i < data.length; i++)
            {

              //Agora insere os dados na tabela
              db.query("INSERT INTO Processos (ID_PROCESSO, NUMERO_SINISTRO, NOME_SEGURADO, ID_EMPRESA) VALUES ('" + data[i].ID_PROCESSO + "', '" + data[i].NUMERO_SINISTRO + "', '" + data[i].NOME_SEGURADO + "', '" + data[i].ID_EMPRESA + "')").then(() => {
                resolve(true);
              }).catch(() => resolve(false));
            }
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

  public buscarProcessosBaseLocal():Promise<any>{

    let db = new Storage(SqlStorage, {name: "GimenesApp"});

    let promise = new Promise(function (resolve) {

      try {

        db.query('SELECT * FROM Processos').then((data) => resolve(data.res)).catch((err) => resolve(null));
      }
      catch (err) {

        console.log(err);
        resolve(null);
      }
    });

    return promise;
  }
}
