import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs';
import { Global }  from '../../Global';
import { UsuarioAdmin } from '../models/UsuarioAdmin';

@Injectable({
  providedIn: 'root'
})
export class AdminUserService {
  public user : UsuarioAdmin;
  public into;
  public token;
  public global : Global;
  constructor(private _http : Http) {
    this.global = new Global;
  }

  logUser(usuario, token = null){
    //console.log("Usuario:", usuario);
    //console.log(this.global.Admin_URL);
    let URL = this.global.Admin_URL + 'adminlog';

    const params = JSON.stringify(usuario);
    const headers = new Headers(
      {
        'Content-Type' : 'application/json'
      }
    );
    
    return this._http.post(URL, params, {headers}).pipe( 
      res =>{
      //console.log('LoginResponse', res);
      return res;
    })
  }

  getLogin(){
    let into = JSON.parse(localStorage.getItem('admin-into'));
    if (this.into != "undefined"){
      this.into = into;
    } else {
      this.into = null;
    }
    return this.into;
  }

  getToken(){
    let token = JSON.parse(localStorage.getItem('encrypted'));
    if (this.token != "undefined"){
      this.token = token;
    } else {
      this.token = null;
    }
    return this.token;
  }

  getAdminIdentity(){
    this.user = new UsuarioAdmin();
    this.user.admin_username = JSON.parse(localStorage.getItem('admin'));
    return this.user;
  }

 
}
