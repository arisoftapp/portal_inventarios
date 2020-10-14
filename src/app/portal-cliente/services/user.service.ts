import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs';

import { Observable, Subscription } from 'rxjs';
import { mapChildrenIntoArray } from '@angular/router/src/url_tree';
import { mapToExpression } from '@angular/compiler/src/render3/view/util';
import { Global }  from '../models/global';
import { User } from '../models/UserModel';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public user : User;
  public into;
  public token;
  public global : Global;
  constructor(private _http : Http) {
    this.global = new Global;
  }

  logUser(usuario, token = null){
    //console.log("Usuario:", usuario);
    //console.log(this.global.Admin_URL);
    let URL = this.global.Admin_URL + 'logW';

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
  
  checkPass(usuario){
    //console.log("Usuario:", usuario);
    //console.log(this.global.Admin_URL);
    let token = JSON.parse(localStorage.getItem('tok'));
    let URL = this.global.Admin_URL + 'checkpass';

    const params = JSON.stringify(usuario);
    const headers = new Headers(
      {
        'Content-Type' : 'application/json',
        'x-access-token' : token,
      }
    ); 
    
    return this._http.post(URL, params, {headers}).pipe( 
      res =>{
      //console.log('LoginResponse', res);
      return res;
    })
  }

  getLogin(){
    let into = JSON.parse(localStorage.getItem('into'));
    if (this.into != "undefined"){
      this.into = into;
    } else {
      this.into = null;
    }
    return this.into;
  }

  getToken(){
    let token = JSON.parse(localStorage.getItem('tok'));
    if (this.token != "undefined"){
      this.token = token;
    } else {
      this.token = null;
    }
    return this.token;
  }

  getIdentity(){
    this.user = new User();
    this.user.Empresa = JSON.parse(localStorage.getItem('empresa'));
    this.user.Username = JSON.parse(localStorage.getItem('user'));
    return this.user;
  }

  getUsername(id : string){
    let URL = this.global.Admin_URL + 'iduser/' + id;
    const headers = new Headers(
      {
        'Content-Type' : 'application/json',
        'x-access-token' : this.token,
      }
    );
    let options = new RequestOptions({headers : headers});

    //return this._http.get(URL, options).map(res)
    return this._http.get(
      URL, {headers}).pipe(
        res => {
          res => res.json();
          //console.log('GetUsername', res);
          return res;
        }
      )
  }
}
