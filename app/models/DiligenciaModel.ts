export class DiligenciaModel {
  private _COD_TIPO_DILIGENCIA: string;
  private _DESC_DILIGENCIA: string;
  private _ID_DILIGENCIA: string;
  private _TITULO_DILIGENCIA: string;

  constructor(codTipoDiligencia: string, descDiligencia: string, idDiligencia: string, tituloDiligencia: string) {
    this._COD_TIPO_DILIGENCIA = codTipoDiligencia;
    this._DESC_DILIGENCIA = descDiligencia;
    this._ID_DILIGENCIA = idDiligencia;
    this._TITULO_DILIGENCIA = tituloDiligencia;
  }

  get COD_TIPO_DILIGENCIA():string{
    return this._COD_TIPO_DILIGENCIA;
  }

  set COD_TIPO_DILIGENCIA(value:string){
    this._COD_TIPO_DILIGENCIA=value;
  }

  get DESC_DILIGENCIA():string{
    return this._DESC_DILIGENCIA;
  }

  set DESC_DILIGENCIA(value:string){
    this._DESC_DILIGENCIA=value;
  }

  get ID_DILIGENCIA():string{
    return this._ID_DILIGENCIA;
  }

  set ID_DILIGENCIA(value:string){
    this._ID_DILIGENCIA=value;
  }

  get TITULO_DILIGENCIA():string{
    return this._TITULO_DILIGENCIA;
  }

  set TITULO_DILIGENCIA(value:string){
    this._TITULO_DILIGENCIA=value;
  }
}
