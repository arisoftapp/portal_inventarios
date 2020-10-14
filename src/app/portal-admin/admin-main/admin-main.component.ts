import { Component, OnInit } from '@angular/core';
import { Empresa } from '../models/EmpresaModel';
import { EmpresaService } from '../services/empresa.service'
import localeMX from '@angular/common/locales/es-MX';
import { registerLocaleData } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Global } from 'src/app/Global';
import {FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdminUserService } from '../services/admin-user.service';
import { UsuarioAdmin } from '../models/UsuarioAdmin';

@Component({
  selector: 'app-admin-main',
  templateUrl: './admin-main.component.html',
  styleUrls: ['./admin-main.component.css']
})
export class AdminMainComponent implements OnInit {
  empresas : Empresa[];
  global : Global;
  empresa : Empresa;
  postEmpresa : Empresa;
  EmpresaForm : FormGroup;
  Success;
  Message;
  into;
  admin : UsuarioAdmin;

  constructor(private empresa_serv : EmpresaService, private router : Router,
    private activatedRouter : ActivatedRoute, private pf: FormBuilder, private user_serv : AdminUserService) {
      this.global = new Global;
      registerLocaleData(localeMX);
      this.EmpresaForm = this.pf.group({
        empresa: ["",[Validators.required]],
        puerto: ["", [Validators.required]],
      });
     }

  ngOnInit() {
    this.into = this.user_serv.getLogin();
    if (!this.into){
      this.router.navigate(['adminlogin']);
    }
    this.admin = this.user_serv.getAdminIdentity();   
    this.Success = null;
    this.empresa_serv.getEmpresas().subscribe(
      (response : any)  => {
        var Resp = response;
        var texto = Resp._body; 
        var jey = JSON.parse(texto);
        if (!jey.empresas){
          console.log("ERROR. No se obtuvieron los detalles de las empresas");
          console.log(jey.empresas);
        }else {
          this.empresas = jey.empresas;
          console.log(this.empresas);
        }
      error => {
        console.log(<any>error);
      }
    });
  }

  detalle(empresa: Empresa){
    this.router.navigate(['adminportal/empresa/', empresa.id_empresa]);
  }

  onSubmit(){
    this.postEmpresa = this.saveEmpresa();
    this.empresa_serv.postEmpresa(this.postEmpresa).subscribe(
      (response : any) => {
        var Resp = response;
        var texto = Resp._body;
        var jey = JSON.parse(texto);
        this.Success = jey.success;
        this.Message = jey.message;
        console.log(this.Message);
    })
  }

  saveEmpresa(){
    var postEmpresa = new Empresa;
    postEmpresa.nombre_empresa = this.EmpresaForm.get('empresa').value;
    postEmpresa.dominio = this.EmpresaForm.get('puerto').value;
    return postEmpresa;
  }

  public logout(){
    localStorage.clear();
    this.into = null;
    //this.token = null;
    this.router.navigate(['adminlogin']);
  }

  toAdmin() {
    this.router.navigate(['adminportal']);
  }

  

}
