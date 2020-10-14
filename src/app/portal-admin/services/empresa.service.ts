import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs';
import { Global }  from '../../Global';
import { Empresa } from '../models/EmpresaModel'

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  public global : Global;

  constructor(private _http : Http) {
    this.global = new Global;
  }

  getEmpresas()  {
    //console.log("Usuario:", usuario);
    //console.log(this.global.Admin_URL);
    let URL = this.global.Admin_URL + 'empresa';
    const headers = new Headers(
      {
        'Content-Type' : 'application/json',
      }
    );
    let options = new RequestOptions({headers : headers});

    //return this._http.get(URL, options).map(res)
    return this._http.get(
      URL, {headers}).pipe(
        res => {
          res => res.json();
          console.log('ConteoDetResponse', res);
          return res;
        }
      )
  }

  getEmpresa(idempresa)  {
    //console.log("Usuario:", usuario);
    //console.log(this.global.Admin_URL);
    let URL = this.global.Admin_URL + 'empresa/' + idempresa;
    const headers = new Headers(
      {
        'Content-Type' : 'application/json',
      }
    );
    let options = new RequestOptions({headers : headers});

    //return this._http.get(URL, options).map(res)
    return this._http.get(
      URL, {headers}).pipe(
        res => {
          res => res.json();
          console.log('ConteoDetResponse', res);
          return res;
        }
      )
  }

  getEmpresaUsers(idempresa)  {
    //console.log("Usuario:", usuario);
    //console.log(this.global.Admin_URL);
    let URL = this.global.Admin_URL + 'empresa/' + idempresa + '/users';
    const headers = new Headers(
      {
        'Content-Type' : 'application/json',
      }
    );
    let options = new RequestOptions({headers : headers});

    //return this._http.get(URL, options).map(res)
    return this._http.get(
      URL, {headers}).pipe(
        res => {
          res => res.json();
          console.log('ConteoDetResponse', res);
          return res;
        }
      )
  }

  postEmpresa(empresa: Empresa)  {
    //console.log("Usuario:", usuario);
    //console.log(this.global.Admin_URL);
    let URL = this.global.Admin_URL + 'empresa';
    const newpres = JSON.stringify(empresa);
    const headers = new Headers(
      {
        'Content-Type' : 'application/json',
      }
    );
    let options = new RequestOptions({headers : headers});

    //return this._http.get(URL, options).map(res)
    return this._http.post(
      URL, newpres, {headers}).pipe(
        res => {
          res => res.json();
          console.log('InsertEmpresa', res);
          return res;
        }
      )
  }
}
