import { Component, OnInit } from '@angular/core';
import { ConteoService } from '../services/conteo.service';
import { Conteo } from '../models/ConteoModel';
import { Global } from '../models/global';
import { UserService } from '../services/user.service';
import { User } from '../models/UserModel';
import { Alert } from 'selenium-webdriver';
import localeMX from '@angular/common/locales/es-MX';
import { registerLocaleData } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { toDate } from '@angular/common/src/i18n/format_date';
import { Month } from '../models/MonthModel';

@Component({
  selector: 'app-conteos',
  templateUrl: './conteos.component.html',
  styleUrls: ['./conteos.component.css']
})
export class ConteosComponent implements OnInit {
  global: Global;
  token;
  conteos: Conteo[];
  conteos_disp_group: Conteo[];
  conteos_seleccionados: Conteo[];
  conteos_filter: Conteo[];
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
        if (!this.jey.conteos) {
          console.log("ERROR EN LECTURA DE CONTEOS");
          //console.log(this.jey.conteos);
        } else {
          this.conteos = this.jey.conteos;
          this.conteos_filter = this.conteos;
          console.log(this.conteos);
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
  btn_agrupar(conteo: Conteo) {
    this.agrupando = true;
    this.setConteosDisp();
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
