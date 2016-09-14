import {Component, Injectable} from '@angular/core';

@Injectable()
@Component({
	template: ""
})
export class DadosCompartilhados {

  static _token: string;

  constructor() {
    DadosCompartilhados._token = '';
  }

  public static setToken(token) {
    DadosCompartilhados._token = token;
  }

  public static getToken():string {
    return DadosCompartilhados._token;
  }
}
