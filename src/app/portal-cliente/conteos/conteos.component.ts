import { Component, OnInit } from '@angular/core';
import { ConteoService } from '../services/conteo.service';
import { Conteo } from '../models/ConteoModel';
import { Agrupado } from '../models/AgrupadoModel';
import { Global } from '../models/global';
import { UserService } from '../services/user.service';
import { User } from '../models/UserModel';
import { Alert } from 'selenium-webdriver';
import localeMX from '@angular/common/locales/es-MX';
import { registerLocaleData } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { toDate } from '@angular/common/src/i18n/format_date';
import { Month } from '../models/MonthModel';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-conteos',
  templateUrl: './conteos.component.html',
  styleUrls: ['./conteos.component.css']
})
export class ConteosComponent implements OnInit {
  global: Global;
  token;
  agrupado: Agrupado;
  conteos: Conteo[];
  agrupados: Agrupado[];
  conteos_disp_group: Conteo[];
  conteos_seleccionados: Conteo[];
  conteos_filter: Conteo[];
  agrupados_filter: Agrupado[];
  conteos_mes: Conteo[];
  conteos_status: Conteo[];
  Resp;
  texto;
  jey;
  filter_month: boolean = false;
  filter_status: boolean = false;
  agrupando: boolean = false;
  selected_month: number;
  selected_status: String;
  busqueda = '';

  months: Month[] = [
    new Month(1, "Enero"),
    new Month(2, "Febrero"),
    new Month(3, "Marzo"),
    new Month(4, "Abril"),
    new Month(5, "Mayo"),
    new Month(6, "Junio"),
    new Month(7, "Julio"),
    new Month(8, "Agosto"),
    new Month(9, "Septiembre"),
    new Month(10, "Octubre"),
    new Month(11, "Noviembre"),
    new Month(12, "Diciembre"),
  ]

  constructor(public service: UserService, public conteo_ser: ConteoService, private router: Router) {
    this.global = new Global;
    registerLocaleData(localeMX);
  }

  ngOnInit() {
    this.cargarConteosBD();
    
  }
  cargarConteosBD() {
    this.token = this.service.getToken();
    this.conteo_ser.getConteosAll(this.token).subscribe(
      (response: any) => {
        this.Resp = response;
        this.texto = this.Resp._body;
        this.jey = JSON.parse(this.texto);
        if (!this.jey.success || !this.jey.conteos) {
          Swal.fire({
            text: 'La sesión ha caducado.', 
            icon: "error", 
            confirmButtonColor: "#DD6B55",
          });
          console.log("ERROR EN LECTURA DE CONTEOS");
          //console.log(this.jey.conteos);
        } else {
          this.getAgrupados();
          this.conteos = this.jey.conteos;
          this.conteos_filter = this.conteos;
          //console.log(this.conteos);
        }
        error => {
          console.log(<any>error);
        }
      });
  }

  getAgrupados(){
    this.token = this.service.getToken();
    this.conteo_ser.getAgrupados(this.token).subscribe(
      (response: any) => {
        this.Resp = response;
        this.texto = this.Resp._body;
        this.jey = JSON.parse(this.texto);
        if (!this.jey.conteos) {
          console.log("ERROR EN LECTURA DE CONTEOS");
          //console.log(this.jey.conteos);
        } else {
          this.agrupados = this.jey.conteos;
          this.agrupados_filter = this.agrupados;
          //console.log(this.conteos);
        }
        error => {
          console.log(<any>error);
        }
      });
  }
  btn_prueba() {

  }
  toggleVisibility(e, conteo: Conteo) {
    //= e.target.checked;
    e.checked = false;
    console.log("toggleS " + e + "|" + conteo.agrupando);
  }
  buscarConteoSelect() {
    this.conteos_seleccionados = [];

  }
  detalle(conteo: Conteo) {
    this.router.navigate(['portal-cliente/consulta/', conteo.id_conteo]);
  }

  detalleAgrupado(conteo: Agrupado) {
    console.log(conteo);
    this.router.navigate(['portal-cliente/consulta-agrupado/', conteo.id_conteo_agrupado]);
  }

  btn_agrupar() {
    let selected = [];
    let folios = [];
    let id_alm;
    let error = false;
    this.conteos_filter.map((conteo) => {
      if (conteo.selected){
        selected.push(conteo);
      }
    });
    if (selected.length >= 2){
      id_alm = selected[0].id_alm;
      selected.map((conteo) => {
        if (conteo.id_alm != id_alm){
          Swal.fire({
            text: "Los conteos deben pertenecer al mismo almacén.",
            icon: "warning",
            confirmButtonColor: "#DD6B55",
          });
          error = true;
        } else {
          folios.push(conteo.id_conteo);
        }
      });
      if (!error){
        console.log(folios.join());
        this.agrupado = new Agrupado;
        this.agrupado.id_conteo_agrupado = folios.join();
        this.agrupado.descripcion = 'Nuevo conteo agrupado';
        this.agrupado.id_empresa = selected[0].id_empresa;
        this.agrupado.id_alm = selected[0].id_alm;
        this.agrupado.nombre_alm = selected[0].nombre_alm;
        this.conteo_ser.postAgrupado(this.token, this.agrupado).subscribe(
          (response: any) => {
            let resp = JSON.parse(response._body);
            if (resp.success) {
              Swal.fire({
                text: resp.message,
                icon: "success",
                confirmButtonColor: "#4CAF50",
              });
              this.cargarConteosBD();
              this.getAgrupados();
            } else {
              Swal.fire({
                title: "Error",
                text: resp.message,
                icon: "error",
                confirmButtonColor: "#DD6B55",
              });
            }
          });
      }
    } else {
      Swal.fire({
        text: "Debes seleccionar al menos dos conteos para agruparlos",
        icon: "warning",
        confirmButtonColor: "#DD6B55",
      });
    }
  }
  btn_guardar(conteo: Conteo) {
    this.agrupando = false;
    this.cargarConteosBD();
  }
  setConteosDisp() {
    this.conteos_disp_group = [];
    for (let conteo of this.conteos) {
      if (conteo.id_clf) {
        conteo.agrupando = false;
        this.conteos_disp_group.push(conteo);
      }
    }
    this.conteos_filter = this.conteos_disp_group;
    //console.log(this.conteos_disp_group);
  }

  buscar() {
    if (this.busqueda.length > 0) {
      this.conteo_ser.buscar(this.token, this.busqueda).subscribe(
        (response: any) => {
          let resp = JSON.parse(response._body);
          if (resp.success) {
            this.conteos = resp.data;
            this.conteos_filter = resp.data;
          }
          error => {
            console.log(<any>error);
          }
        });
    } else {
      this.cargarConteosBD();
    }

  }
  
  setFilterMonth(month: number) {
    if (month !== 0) {
      this.filter_month = true;
      this.selected_month = month;
      //console.log(this.selected_month);
    } else {
      this.filter_month = false;
    }
    this.setFilters();
  }

  setFilterStatus(status: string) {
    if (status !== "Todos") {
      this.filter_status = true;
      this.selected_status = status;
      //console.log(this.selected_status);
    } else {
      this.filter_status = false;
    }
    this.setFilters();
  }

  setFilters() {
    this.conteos_mes = [];
    this.conteos_status = [];
    //FILTRAR POR MES SELECCIONADO
    if (this.filter_month) {
      //console.log("Selected Month: " + this.selected_month);
      for (let conteo of this.conteos) {
        var date = new Date(conteo.fecha);
        var mes = date.getMonth() + 1;
        //console.log("Mes " + mes);
        if (mes === this.selected_month) {
          this.conteos_mes.push(conteo);
        }
      }
      if (this.filter_status) {
        //console.log("Selected Status", this.selected_status);
        for (let conteo of this.conteos_mes) {
          if (conteo.estado === this.selected_status) {
            this.conteos_status.push(conteo);
          }
        }
        //SI HAY MES Y ESTADO SELECCIONADO
        this.conteos_filter = this.conteos_status;
      } else {
        //SI HAY MES PERO NO ESTADO SELECCIONADO.
        this.conteos_filter = this.conteos_mes;
      }

    } else {
      //FILTRAR POR ESTADO SELECCIONADO
      if (this.filter_status) {
        //console.log("Selected Status", this.selected_status);
        for (let conteo of this.conteos) {
          if (conteo.estado === this.selected_status) {
            this.conteos_status.push(conteo);
          }
        }
        this.conteos_filter = this.conteos_status; //SI HAY ESTADO PERO NO MES SELECCIONADO
      } else {
        this.conteos_filter = this.conteos;
      }
    }
    //console.log(this.conteos_filter);
  }

}
