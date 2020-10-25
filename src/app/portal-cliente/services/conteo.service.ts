import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs';
import { Global } from '../models/global';
import { Conteo } from '../models/ConteoModel';

@Injectable({
  providedIn: 'root'
})
export class ConteoService {
  public global: Global;

  constructor(private _http: Http) {
    this.global = new Global;
  }

  getConteosAll(token) {
    //console.log("Usuario:", usuario);
    //console.log(this.global.Admin_URL);
    let URL = this.global.Admin_URL + 'conteos';
    const headers = new Headers(
      {
        'Content-Type': 'application/json',
        'x-access-token': token,
      }
    );
    let options = new RequestOptions({ headers: headers });

    //return this._http.get(URL, options).map(res)
    return this._http.get(
      URL, { headers }).pipe(
        res => {
          res => res.json();
          //console.log('ConteoResponse', res);
          return res;
        }
      )
  }

  getAgrupados(token) {
    //console.log("Usuario:", usuario);
    //console.log(this.global.Admin_URL);
    let URL = this.global.Admin_URL + 'agrupados';
    const headers = new Headers(
      {
        'Content-Type': 'application/json',
        'x-access-token': token,
      }
    );
    let options = new RequestOptions({ headers: headers });

    //return this._http.get(URL, options).map(res)
    return this._http.get(
      URL, { headers }).pipe(
        res => {
          res => res.json();
          //console.log('ConteoResponse', res);
          return res;
        }
      )
  }

  getAgrupado(token, id) {
    //console.log("Usuario:", usuario);
    //console.log(this.global.Admin_URL);
    let URL = this.global.Admin_URL + 'agrupado/' + id;
    const headers = new Headers(
      {
        'Content-Type': 'application/json',
        'x-access-token': token,
      }
    );
    let options = new RequestOptions({ headers: headers });

    //return this._http.get(URL, options).map(res)
    return this._http.get(
      URL, { headers }).pipe(
        res => {
          res => res.json();
          //console.log('ConteoResponse', res);
          return res;
        }
      )
  }

  getDetalleAgrupado(token, id) {
    let URL = this.global.Admin_URL + 'detalle-agrupado/' + id;
    const headers = new Headers(
      {
        'Content-Type': 'application/json',
        'x-access-token': token,
      }
    );
    let options = new RequestOptions({ headers: headers });

    //return this._http.get(URL, options).map(res)
    return this._http.get(
      URL, { headers }).pipe(
        res => {
          res => res.json();
          //console.log('ConteoResponse', res);
          return res;
        }
      )
  }

  postAgrupado(token, agrupado) {
    //console.log("Usuario:", usuario);
    //console.log(this.global.Admin_URL);
    let URL = this.global.Admin_URL + 'agrupar_conteos';
    const newpres = JSON.stringify(agrupado);
    
    const headers = new Headers(
      {
        'Content-Type' : 'application/json',
        'x-access-token' : token,
      }
    );

    return this._http.post( URL, newpres, {headers});
  }

  getConteo(token, id) {
    //console.log("Usuario:", usuario);
    //console.log(this.global.Admin_URL);
    let URL = this.global.Admin_URL + 'conteos/' + id;
    const headers = new Headers(
      {
        'Content-Type': 'application/json',
        'x-access-token': token,
      }
    );
    let options = new RequestOptions({ headers: headers });

    //return this._http.get(URL, options).map(res)
    return this._http.get(
      URL, { headers }).pipe(
        res => {
          res => res.json();
          //console.log('ConteoResponse', res);
          return res;
        }
      )
  }


  getConteoDet(token, id) {
    //console.log("Usuario:", usuario);
    //console.log(this.global.Admin_URL);
    let URL = this.global.Admin_URL + 'conteodet/' + id;
    const headers = new Headers(
      {
        'Content-Type': 'application/json',
        'x-access-token': token,
      }
    );
    let options = new RequestOptions({ headers: headers });

    //return this._http.get(URL, options).map(res)
    return this._http.get(
      URL, { headers }).pipe(
        res => {
          res => res.json();
          //console.log('ConteoDetResponse', res);
          return res;
        }
      )
  }

  putContStatus(token, cont_id, status) {
    let URL = this.global.Admin_URL + 'conteo/chgstatus/' + status + '/' + cont_id;
    const headers = new Headers(
      {
        'Content-Type': 'application/json',
        'x-access-token': token,
      }
    );
    let options = new RequestOptions({ headers: headers });

    //return this._http.get(URL, options).map(res)
    return this._http.get(
      URL, { headers }).pipe(
        res => {
          res => res.json();
          console.log('StatusResponse', res);
          return res;
        }
      )
  }

  getSeries(token, idconteo, cod_prod) {
    //console.log("Usuario:", usuario);
    //console.log(this.global.Admin_URL);
    let URL = this.global.Admin_URL + 'getseries/' + idconteo + '/' + cod_prod;
    const headers = new Headers(
      {
        'Content-Type': 'application/json',
        'x-access-token': token,
      }
    );

    let options = new RequestOptions({ headers: headers });

    //return this._http.get(URL, options).map(res)
    return this._http.get(
      URL, { headers }).pipe(
        res => {
          res => res.json();
          //console.log('ConteoResponse', res);
          return res;
        }
      )
  }


  getAllSeries(token, idconteo) {
    //console.log("Usuario:", usuario);
    //console.log(this.global.Admin_URL);
    let URL = this.global.Admin_URL + 'getseries/' + idconteo;
    const headers = new Headers(
      {
        'Content-Type': 'application/json',
        'x-access-token': token,
      }
    );

    let options = new RequestOptions({ headers: headers });

    //return this._http.get(URL, options).map(res)
    return this._http.get(
      URL, { headers }).pipe(
        res => {
          res => res.json();
          //console.log('ConteoResponse', res);
          return res;
        }
      )
  }

}
