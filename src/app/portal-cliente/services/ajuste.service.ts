import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs';
import { Global }  from '../models/global';

@Injectable({
  providedIn: 'root'
})
export class AjusteService {
  public global : Global;
  constructor(private _http : Http) {
    this.global = new Global;
  }

  getCostoUnitario(almacen, codigo){
    var domain = JSON.parse(localStorage.getItem('COBF'));
    var tok = JSON.parse(localStorage.getItem('tok'));
    let URL = this.global.Client_URL + domain + '/costoUnitario/'+ almacen + '/' + codigo;
    const headers = new Headers(
      {
        'Content-Type' : 'application/json',
        'x-access-token' : tok,
      }
    );
    let options = new RequestOptions({headers : headers});

    //return this._http.get(URL, options).map(res)
    return this._http.get(
      URL, {headers}).pipe(
        res => {
          res => res.json();
          //console.log('ConteoResponse', res);
          return res;
        }
      )
  }

  modificarExistencia(almacen, codigo, conteo, valor){
    var domain = JSON.parse(localStorage.getItem('COBF'));
    var tok = JSON.parse(localStorage.getItem('tok'));
    let URL = this.global.Client_URL + domain + '/modificarExistencia/'+ almacen + '/' + codigo + '/' + conteo + '/' + valor;
    const headers = new Headers(
      {
        'Content-Type' : 'application/json',
        'x-access-token' : tok,
      }
    );
    let options = new RequestOptions({headers : headers});

    //return this._http.get(URL, options).map(res)
    return this._http.put(
      URL, {headers}).pipe(
        res => {
          res => res.json();
          //console.log('ConteoResponse', res);
          return res;
        }
      )
  }

  ajuste(movimiento, folio, posicion, fecha, almacen, cantidad, articulo, costoUni, costeo, fechaSys, hora, fechaMod){
    var domain = JSON.parse(localStorage.getItem('COBF'));
    var tok = JSON.parse(localStorage.getItem('tok'));
    let URL = this.global.Client_URL + domain + 'agregarMovimiento/' + movimiento +  '/' 
    + posicion + '/' + fecha + '/' + almacen + '/' + cantidad + '/' + articulo + '/' + costoUni + '/' 
    + costeo + '/' + fechaSys + '/' + hora + '/' + fechaMod;
    const headers = new Headers(
      {
        'Content-Type' : 'application/json',
        'x-access-token' : tok,
      }
    );
    let options = new RequestOptions({headers : headers});

    //return this._http.get(URL, options).map(res)
    return this._http.put(
      URL, {headers}).pipe(
        res => {
          res => res.json();
          //console.log('ConteoResponse', res);
          return res;
        }
      )
  }



  getDominio(){
    var domain = JSON.parse(localStorage.getItem('user'));
    return domain;
  }

}
