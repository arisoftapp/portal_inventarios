import { Component, OnInit} from '@angular/core';
import { Empresa } from '../models/EmpresaModel';
import { UsuarioEmpresa } from '../models/UsuarioEmpresaModel'
import { EmpresaService } from '../services/empresa.service'
import localeMX from '@angular/common/locales/es-MX';
import { registerLocaleData } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Global } from '../../Global';
import {FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms'

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.css']
})
export class EmpresaComponent implements OnInit {
  global : Global;
  empresa : Empresa;
  usuarios : UsuarioEmpresa[];
  EmpresaForm : FormGroup;
  EditUser : boolean;
  ShowPass : boolean;
  EnabledAppMovil : boolean = false;
  ModificarEmpresaForm : FormGroup;
  RegistrarUsuarioForm : FormGroup;
  DetallesUsuarioForm : FormGroup;
  ModificarUsuarioForm : FormGroup;
  portalusuario: FormControl;
  appmovil: FormControl;
  existencia: FormControl;
  existencia_alm: FormControl;
  articulos: FormControl;
  precios: FormControl; 
  familias: FormControl;
  ajuste: FormControl;
  entrega: FormControl;
  recibido : FormControl;

  constructor(private empresa_serv : EmpresaService, private router : Router, private pf: FormBuilder,
    private activatedRouter : ActivatedRoute) {
      this.global = new Global;
      registerLocaleData(localeMX);
      this.EmpresaForm = this.pf.group({
        empresa: [""],
        puerto: [""],
      });
      this.ModificarEmpresaForm = this.pf.group({
        mod_empresa: [""],
        mod_puerto: [""],
      });
      this.RegistrarUsuarioForm = this.pf.group({
        username: ["", [Validators.required]],
        password: ["", [Validators.required]],
        portalusuario: [false],
        appmovil: [false],
        existencia: [{ value: false, disabled: true }],
        existencia_alm: [{ value: false, disabled: true }],
        articulos: [{ value: false, disabled: true }],
        precios: [{ value: false, disabled: true }],
        familias: [{ value: false, disabled: true }],
        ajuste: [{ value: false, disabled: true }],
        entrega: [{ value: false, disabled: true }],
        recibido: [{ value: false, disabled: true }],
      });
      this.DetallesUsuarioForm = this.pf.group({
        det_username: [""],
        det_password: [""],
        det_portalusuario: [{ value: false, disabled: true }],
        det_appmovil: [{ value: false, disabled: true }],
        det_existencia: [{ value: false, disabled: true }],
        det_existencia_alm: [{ value: false, disabled: true }],
        det_articulos: [{ value: false, disabled: true }],
        det_precios: [{ value: false, disabled: true }],
        det_familias: [{ value: false, disabled: true }],
        det_ajuste: [{ value: false, disabled: true }],
        det_entrega: [{ value: false, disabled: true }],
        det_recibido: [{ value: false, disabled: true }],
      });
      
    }

  ngOnInit() {
    this.activatedRouter.params.subscribe(params =>{
      var id = params['id'];
      this.empresa_serv.getEmpresa(id).subscribe(
        (response : any)  => {
          var Resp = response;
          var texto = Resp._body;
          var jey = JSON.parse(texto);
          if (!jey.empresa){
            console.log("ERROR EN LECTURA DE EMPRESA");
            console.log(jey.empresa[0]);
          }else {
            this.empresa = jey.empresa[0];
            console.log(this.empresa);
          }
        error => {
          console.log(<any>error);
        }
      });

      this.empresa_serv.getEmpresaUsers(id).subscribe(
        (response : any)  => {
          var Resp = response;
          var texto = Resp._body;
          var jey = JSON.parse(texto);
          if (!jey.usuarios){
            console.log("ERROR EN LECTURA DE USUARIOS");
            console.log(jey.usuarios);
          }else {
            this.usuarios = jey.usuarios;
            console.log(this.usuarios);
          }
        error => {
          console.log(<any>error);
        }
      });
    })
    /*this.ModificarEmpresaForm = this.pf.group({
      empresa: [""],
      puerto: [""],
    });*/
  }

  getModificarEmpresa(){
    this.ModificarEmpresaForm = this.pf.group({
      mod_empresa: [this.empresa.nombre_empresa],
      mod_puerto: [this.empresa.dominio],
    });
    
  }

  updateEmpresa(){
    
  }

  onSubmit(){

  }

  usuarioDown(){
    
  }


  getDetallesUsuario(user : UsuarioEmpresa){
    this.EditUser = false;
    this.ShowPass = false;
    this.DetallesUsuarioForm = this.pf.group({
      det_username: [user.username],
      det_password: [user.password],
      det_portalusuario: [{value:user.webApp, disabled:true}],
      det_appmovil: [{value:user.webApp, disabled:true}],
      det_existencia: [{ value: user.existencia, disabled: true }],
      det_existencia_alm: [{ value: user.existencia_alm, disabled: true }],
      det_articulos: [{ value: user.articulos, disabled: true }],
      det_precios: [{ value: user.precios, disabled: true }],
      det_familias: [{ value: user.familias, disabled: true }],
      det_ajuste: [{ value: user.ajuste_inv, disabled: true }],
      det_entrega: [{ value: user.entrega, disabled: true }],
      det_recibido: [{ value: user.recibido, disabled: true }],
    });
  }

  setEditUser(form : FormGroup){
    this.EditUser = !this.EditUser;
    if (this.EditUser) {
      form.get('det_portalusuario').enable();
      form.get('det_appmovil').enable();
      //this.enableDetAppModules(form);
      if (form.get('det_appmovil').value) {
        form.get('det_existencia').enable();
        form.get('det_existencia_alm').enable();
        form.get('det_articulos').enable();
        form.get('det_precios').enable();
        form.get('det_familias').enable();
        form.get('det_ajuste').enable();
        form.get('det_entrega').enable();
        form.get('det_recibido').enable();
      } else {
        form.get('det_existencia').disable();
        form.get('det_existencia_alm').disable();
        form.get('det_articulos').disable();
        form.get('det_precios').disable();
        form.get('det_familias').disable();
        form.get('det_ajuste').disable();
        form.get('det_entrega').disable();
        form.get('det_recibido').disable();
      }
    }else{
      form.get('det_portalusuario').disable();
      form.get('det_appmovil').disable();
      form.get('det_existencia').disable();
      form.get('det_existencia_alm').disable();
      form.get('det_articulos').disable();
      form.get('det_precios').disable();
      form.get('det_familias').disable();
      form.get('det_ajuste').disable();
      form.get('det_entrega').disable();
      form.get('det_recibido').disable();
    }
  }

  showPass(){
    this.ShowPass = !this.ShowPass;
  }

  enableAppModules(form : FormGroup){
    if (!form.get('appmovil').value) {
      form.get('existencia').enable();
      form.get('existencia_alm').enable();
      form.get('articulos').enable();
      form.get('precios').enable();
      form.get('familias').enable();
      form.get('ajuste').enable();
      form.get('entrega').enable();
      form.get('recibido').enable();
    }else{
      form.get('existencia').disable();
      form.get('existencia_alm').disable();
      form.get('articulos').disable();
      form.get('precios').disable();
      form.get('familias').disable();
      form.get('ajuste').disable();
      form.get('entrega').disable();
      form.get('recibido').disable();
    }
  }

  enableDetAppModules(form: FormGroup) {
    console.log(!form.get('det_appmovil').value);
    if (!form.get('det_appmovil').value) {
      form.get('det_existencia').enable();
      form.get('det_existencia_alm').enable();
      form.get('det_articulos').enable();
      form.get('det_precios').enable();
      form.get('det_familias').enable();
      form.get('det_ajuste').enable();
      form.get('det_entrega').enable();
      form.get('det_recibido').enable();
    } else {
      form.get('det_existencia').disable();
      form.get('det_existencia_alm').disable();
      form.get('det_articulos').disable();
      form.get('det_precios').disable();
      form.get('det_familias').disable();
      form.get('det_ajuste').disable();
      form.get('det_entrega').disable();
      form.get('det_recibido').disable();
    }
  }



}
