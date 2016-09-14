import {Component, NgZone} from '@angular/core';
import {Platform, NavController, NavParams} from 'ionic-angular';
import {UtilService} from '../../util/UtilService';

import {Http, Headers, RequestOptions} from '@angular/http';
import {Parametros} from '../../models/ParametroModel';
import {DadosCompartilhados} from '../../models/DadosCompartilhados';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import {HeaderAppGimenes} from '../../controllers/header';
import {Camera, Transfer, Toast} from 'ionic-native';

@Component({
	templateUrl: 'build/pages/uploadFoto/uploadFoto.html',
	directives: [HeaderAppGimenes, DadosCompartilhados]
})
export class UploadFoto {

	token: string;

	imgUpload:string = "";
	idProcesso: string = "";
	idDiligencia: string = "";

	//Propriedades para Upload
	codTipoArquivo: string = "PROCESSO-SINISTRO"; //Default
	objCoordenadas: any;
	progress: number;
	listaTiposAnexos: any;
	tipoAnexo: string = "";
	isUploading: boolean = false;

	constructor(private platform: Platform, private navParams: NavParams, private utilService: UtilService,
							private http: Http, private navCtrl: NavController, private ngZone:NgZone){

		//Iniciar o array vazio
		this.listaTiposAnexos = [];
	}

	ngOnInit() {

		this.platform.ready().then(() => {

			//Buscar o token
			this.token = DadosCompartilhados.getToken();

			//Já busca as coordenas do aparelho em background
			 this.utilService.buscarCoordenadas()
				 .then((obj => {
				 console.log(JSON.stringify(obj));
						this.objCoordenadas = obj;
				 }))
				 .catch((err) => {
						console.log(JSON.stringify(err));
				 });


			this.preencherDropDownListaTiposAnexo();

			//Abre a câmera para tirar a foto
			this.adicionarFotoDiligencia();
		});
	}

	preencherDropDownListaTiposAnexo(){

		this.idDiligencia = this.navParams.get("idDiligencia");
		this.idProcesso = this.navParams.get("idProcesso");

		//Efetuar a chamada via internet ou base local
		this.utilService.checkNetwork().then((data) => {

			if(data.PossuiConexao)
				this.buscarTiposAnexo();
			else
				this.buscarTiposAnexoLocal();
		});
	}


	public buscarTiposAnexo(){

		let token:string = DadosCompartilhados.getToken();
		let headers = new Headers();
		headers.append("token", token);
		headers.append("Content-Type", "application/json");
		let options = new RequestOptions({headers: headers});
		let url:string = `${Parametros.URL_AMBIENTE}/Diligencias/tiposAnexo/${this.idDiligencia}`;

		this.http.get(url, options)
			.map( res => res.json())
			.subscribe(
				data => {
					for(let i = 0; i < data.length; i++)
					{
						this.listaTiposAnexos.push(data[i]);
					}

					//this.gravarListaDiligenciasLocal(data);
				},
				error => {
					console.log('ocorreu um erro: ' + JSON.stringify(error.json()));
				}
			);
	}

	public buscarTiposAnexoLocal(){

	}


	public gravarFoto(){

		if(this.tipoAnexo == "")
		{
			Toast.showLongBottom("Selecione um Tipo de Anexo").subscribe();
			return;
		}

		this.upload();
	}


	public adicionarFotoDiligencia(){

		this.platform.ready().then(() => {

			let options = {
				destinationType: Camera.DestinationType.NATIVE_URI,
				sourceType: Camera.PictureSourceType.CAMERA,
				allowEdit: false,
				saveToPhotoAlbum: true
			};

			//Abre a camera e pega a imagem URL de retorno
			Camera.getPicture(options)
				.then((retorno) => {
					this.imgUpload = retorno;
				})
				.catch((err) => {
					console.log(JSON.stringify(err));
				});
		});
	}

	success = (): void => {
		this.isUploading = false;
		console.log('terminou o envio da foto');
		Toast.showLongBottom("Foto enviada com sucesso").subscribe(() => {
			this.navCtrl.pop();
		});
	};

	failed = (err: any) : void => {

		this.isUploading = false;
		let code = err.code;
		alert("Failed to upload image. Code: " + code);
	};

	onProgress =  (progressEvent: ProgressEvent) : void => {

		this.ngZone.run(() => {
			if (progressEvent.lengthComputable)
				this.progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
		});
	};

	upload = () : void => {
		this.isUploading = true;
		let ft = new Transfer();
		let filename = `${UtilService.newGuid()}.jpg`;
		let options = {
			fileKey: 'file',
			fileName: filename,
			mimeType: 'image/jpeg',
			chunkedMode: false,
			headers: {
				'Content-Type' : undefined,
				'token': this.token
			},
			params: {
				fileName: filename
			}
		};
		ft.onProgress(this.onProgress);

		let urlUpload = Parametros.URL_AMBIENTE + `/Diligencias/
																							uploadImagem/
																							${this.idProcesso}/
																							${this.idDiligencia}/
																							${this.codTipoArquivo}/
																							${filename}/
																							${this.objCoordenadas.latitude}/
																							${this.objCoordenadas.longitude}`.replace(/\s/g, '');

		ft.upload(this.imgUpload, urlUpload, options, false)
			.then(() => {
				this.success();
			})
			.catch((error: any) => {
				this.failed(error);
			});
	}
}
