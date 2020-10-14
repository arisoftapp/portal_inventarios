import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ConteoService } from '../services/conteo.service';
import { AjusteService } from '../services/ajuste.service';
import { Conteo } from '../models/ConteoModel';
import { Articulo } from '../models/ArticuloModel';
import { Serie } from '../models/SerieModel';
import { Global } from '../models/global';
import { Costo } from '../models/Costo';
import { UserService } from '../services/user.service';
import { User } from '../models/UserModel';
import { Alert } from 'selenium-webdriver';
import localeMX from '@angular/common/locales/es-MX';
import { registerLocaleData, DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

import { ImprimeComponent } from '../imprime/imprime.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-conteo',
  templateUrl: './conteo.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./conteo.component.css'],
  providers: [DatePipe]
})
export class ConteoComponent implements OnInit {
  public usuario;
  global: Global;
  //conteos : Conteo[];
  Date = new Date();
  public user: User;
  public Passw: any;
  public Resp: any;
  public MacroSuccess: boolean;
  public Success: boolean;
  public ExistenciaSuccess: boolean;
  public AjusteSuccess: boolean;
  public ECSuccess: boolean;
  public Message: string;
  public texto;
  public jey;
  public Contra;
  public conteo: Conteo;
  public costo: Costo;
  articulos: Articulo[];
  articulos_filter: Articulo[];
  id: string;
  token;
  series: Serie[] = [];
  allseries: Serie[];
  display = 'none'; //Modal Variable
  success;
  modal;
  articulo_series: Articulo;
  articulo_coment: Articulo;
  color_dif;
  opc_cont = true; // Si es 'true', sólo diferencias. Si es 'false', todo el conteo.
  ConfirmForm: FormGroup;
  p: number = 1;

  constructor(public service: UserService, public conteo_ser: ConteoService, private router: Router,
    private activatedRouter: ActivatedRoute, public ajuste_ser: AjusteService, private pf: FormBuilder,
    private datePipe: DatePipe, private commentsModal: NgbModal, private seriesModal: NgbModal, private ajusteModal: NgbModal,
    private spinnerService: NgxSpinnerService) {
    this.global = new Global;
    registerLocaleData(localeMX);
    this.ConfirmForm = this.pf.group({
      passw: ["", [Validators.required]]
    });
  }

  ngOnInit() {
    this.spinner();
    this.token = this.service.getToken();
    this.user = this.service.getIdentity();
    this.usuario = JSON.parse(localStorage.getItem('user'));
    //console.log(this.user.Empresa + " usuario: " + this.usuario );
    this.getConteo();
    this.getConteoDet();
  }

  getConteo() {
    this.activatedRouter.params.subscribe(params => {
      this.id = params['id'];
      this.conteo_ser.getConteo(this.token, this.id).subscribe(
        (response: any) => {
          var Resp = response;
          var texto = Resp._body;
          var jey = JSON.parse(texto);
          if (!jey.conteos) {
            console.log("ERROR EN LECTURA DE CONTEO");
            //console.log(jey.conteos[0]);
          } else {
            this.conteo = jey.conteos[0];
            console.log("CONTEO:", this.conteo);
          }
          error => {
            console.log(<any>error + "ON INIT ERROR");
          }
        });
    })
  }

  getConteoDet() {
    this.conteo_ser.getConteoDet(this.token, this.id).subscribe(
      (response: any) => {
        var Resp = response;
        var texto = Resp._body;
        var jey = JSON.parse(texto);
        if (!jey.articulos) {
          console.log("ERROR EN LECTURA DE DETALLE DEL CONTEO");
          //console.log(jey.articulos);
        } else {
          this.articulos = jey.articulos;
          this.getAllSeries();
          //console.log("CONTEO DETALLES:", this.articulos);
        }
        error => {
          console.log(<any>error);
        }
      });
  }

  spinner() {
    this.spinnerService.show();

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinnerService.hide();
    }, 5000);
  }

  searchProduct(search: string) {
    this.articulos_filter = this.articulos;
    if (search.length > 0) {
      search = search.toUpperCase();
      this.articulos_filter = [];
      for (let articulo of this.articulos) {
        var codigo = new String(articulo.cod_prod);
        var desc = new String(articulo.descripcion);
        if (codigo.indexOf(search) >= 0 || desc.indexOf(search) >= 0) {
          this.articulos_filter.push(articulo);
        }
      }
    }

  }

  changeStatus(status) {
    this.conteo_ser.putContStatus(this.token, this.id, status).subscribe(
      (response: any) => {
        var Resp = response;
        var texto = Resp._body;
        var jey = JSON.parse(texto);
        var Success = jey.success;
        if (Success) {
          location.reload();
        }
      });
  }

  openComments(content) {
    this.commentsModal.open(content, { centered: true });
  }

  openSeries(content) {
    this.seriesModal.open(content, { centered: true, size: 'lg' });
  }

  imprime() {
    if (this.opc_cont) {
      this.router.navigate(['portal-cliente/imprime-conteo/' + this.id + '/normal']);
    } else {
      this.router.navigate(['portal-cliente/imprime-conteo/' + this.id + '/diferencias']);
    }
  }
  prueba_serie(codigo) {
    var renglon_series = "";
    for (let serie of this.allseries) {
      if (serie.cod_prod == codigo) {
        //console.log(serie.cod_prod + " " + serie.serie + " " + serie.estatus);
        if (serie.estatus != "Disponible") {
          renglon_series += "S/" + serie.serie + '\n';
        }

      }
    }
    //console.log(this.getSeriesArt)

    return renglon_series;
  }
  getSeriesArt(producto: Articulo) {

    this.conteo_ser.getSeries(this.token, this.conteo.id_conteo, producto.cod_prod).subscribe(
      (response: any) => {
        var Resp = response;
        var texto = Resp._body;
        var jey = JSON.parse(texto);
        if (!jey.series) {
          console.log("ERROR EN LECTURA DE SERIES");
          //console.log(jey.series[0]);
          this.success = false;
        } else {
          this.series = jey.series;
          //console.log("ARTICULO_SERIES " , this.series);
          this.articulo_series = producto;

        }
        error => {
          console.log(<any>error);
          this.success = false;
        }
      });

    return "xd"
  }
  generar_txt() {

    //console.log(this.prueba_serie("SERIE2"))


    var long_cant = 12;
    var entradas = "";
    var renglon = "";
    var salidas = "";

    for (let articulo of this.articulos) {
      if (articulo.diferencia < 0) {
        //console.log("CONTEO DETALLES:", articulo.diferencia, articulo.cod_prod, articulo.es_series);
        var dif = (articulo.diferencia) * (-1);
        renglon = "";
        renglon = "" + dif;
        var len = long_cant - renglon.length;
        for (let i = 0; i < len; i++) {
          renglon += " ";
        }
        renglon += "  " + articulo.cod_prod;
        entradas += renglon + '\n';
        if (articulo.es_series == "S") {
          console.log("articulo con serie entrada");
          let ser = this.prueba_serie(articulo.cod_prod)
          if (ser != "") {
            entradas += ser;
          }
        }
      }
      if (articulo.diferencia > 0) {
        //console.log("CONTEO DETALLES:", articulo.diferencia, articulo.cod_prod, articulo.es_series);
        renglon = "";
        renglon = "" + articulo.diferencia;
        var len = long_cant - renglon.length;
        for (let i = 0; i < len; i++) {
          renglon += " ";
        }
        renglon += "  " + articulo.cod_prod;

        salidas += renglon + '\n';
        if (articulo.es_series == "S") {

          let ser = this.prueba_serie(articulo.cod_prod);
          if (ser != "") {

            salidas += ser;
          }

        }
      }

    }
    let comentarios = "-1            Folio: 000" + this.conteo.id_conteo + '\n'
      + "-1            Realizado por:" + this.conteo.username + '\n'
      + "-1            Alm:" + this.conteo.nombre_alm + '\n'
      + "-1            Clas:" + this.conteo.id_clf + " - " + this.conteo.nom_clf + '\n'
      + "-1            Fecha:" + this.datePipe.transform(this.conteo.fecha, 'dd/MM/yyyy') + '\n'

    entradas += '\n' + comentarios;
    salidas += '\n' + comentarios;

    var filename = "";
    if (!filename) filename = 'entradas.txt'
    var blob = new Blob([entradas], { type: 'text/plain' }),
      e = document.createEvent('MouseEvents'),
      a = document.createElement('a')

    // FOR IE:
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, filename);
    }
    else {
      var e = document.createEvent('MouseEvents'),
        a = document.createElement('a');

      a.download = filename;
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ['text/plain', a.download, a.href].join(':');
      e.initEvent('click', true, false);
      a.dispatchEvent(e);
    }
    filename = "";
    if (!filename) filename = 'salidas.txt'
    var blob = new Blob([salidas], { type: 'text/plain' }),
      e = document.createEvent('MouseEvents'),
      a = document.createElement('a')

    // FOR IE:
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, filename);
    }
    else {
      var e = document.createEvent('MouseEvents'),
        a = document.createElement('a');

      a.download = filename;
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ['text/plain', a.download, a.href].join(':');
      e.initEvent('click', true, false);
      a.dispatchEvent(e);
    }

  }
  generar_InvFisico() {
    var long_cant = 12;
    var entradas = "";
    var renglon = "";
    var salidas = "";
    var general = "";
    for (let articulo of this.articulos) {
      if (articulo.diferencia < 0) {
        //console.log("CONTEO DETALLES:", articulo.diferencia, articulo.cod_prod, articulo.es_series);
        var dif = (articulo.diferencia) * (-1);
        renglon = "";
        renglon = "" + dif;
        var len = long_cant - renglon.length;
        for (let i = 0; i < len; i++) {
          renglon += " ";
        }
        renglon += "  " + articulo.cod_prod;
        general += renglon + '\n';
        if (articulo.es_series == "S") {
          console.log("articulo con serie entrada");
          let ser = this.prueba_serie(articulo.cod_prod)
          if (ser != "") {
            general += ser;
          }
        }
      }
      if (articulo.diferencia > 0) {
        //console.log("CONTEO DETALLES:", articulo.diferencia, articulo.cod_prod, articulo.es_series);
        renglon = "";
        renglon = "" + articulo.diferencia;
        var len = long_cant - renglon.length;
        for (let i = 0; i < len; i++) {
          renglon += " ";
        }
        renglon += "  " + articulo.cod_prod;

        general += renglon + '\n';
        if (articulo.es_series == "S") {

          let ser = this.prueba_serie(articulo.cod_prod);
          if (ser != "") {
            general += ser;
          }

        }
      }

    }
    let comentarios = "-1            Folio: 000" + this.conteo.id_conteo + '\n'
      + "-1            Realizado por:" + this.conteo.username + '\n'
      + "-1            Alm:" + this.conteo.nombre_alm + '\n'
      + "-1            Clas:" + this.conteo.id_clf + " - " + this.conteo.nom_clf + '\n'
      + "-1            Fecha:" + this.datePipe.transform(this.conteo.fecha, 'dd/MM/yyyy') + '\n'
    general += '\n' + comentarios
    var filename = "";
    if (!filename) filename = 'invFisico.txt'
    var blob = new Blob([general], { type: 'text/plain' }),
      e = document.createEvent('MouseEvents'),
      a = document.createElement('a')

    // FOR IE:
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, filename);
    }
    else {
      var e = document.createEvent('MouseEvents'),
        a = document.createElement('a');

      a.download = filename;
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ['text/plain', a.download, a.href].join(':');
      e.initEvent('click', true, false);
      a.dispatchEvent(e);
    }
    //console.log(general);
  }
  setOpcCont(opc) {
    this.articulos_filter = [];
    this.opc_cont = opc;
    if (this.opc_cont) {
      this.articulos_filter = this.articulos;
    } else {
      for (let articulo of this.articulos) {
        //console.log(articulo.diferencia);
        if (articulo.diferencia !== 0 || articulo.es_diferencia) {
          //console.log(articulo.diferencia);
          this.articulos_filter.push(articulo);
          //console.log(articulo.diferencia);
        }
      }
    }
  }

  setEsDiferencia() {
    for (let articulo of this.articulos) {
      articulo.es_diferencia = false;
      var contar: number = 0;
      if (articulo.es_series === 'S') {
        if (articulo.conteo === articulo.existencia) {
          for (let serie of this.allseries) {
            if (serie.cod_prod === articulo.cod_prod) {
              if (serie.estatus === "Disponible") {
                contar = contar + 1;
              }
            }
          }
          if (contar !== articulo.conteo) {
            articulo.es_diferencia = true;
          }
        }
      }
    }
    this.setOpcCont(true);
  }

  getAllSeries() {
    this.conteo_ser.getAllSeries(this.token, this.id).subscribe(
      (response: any) => {
        var Resp = response;
        var texto = Resp._body;
        var jey = JSON.parse(texto);
        if (!jey.series) {
          console.log("ERROR EN LECTURA DE SERIES");
          //console.log(jey.series[0]);
          this.success = false;
        } else {
          this.allseries = jey.series;
          this.setEsDiferencia();
          //console.log("ARTICULO_SERIES " , this.series);
        }
        error => {
          console.log(<any>error);
        }
      });
  }



  getColor(estado) {
    switch (estado) {
      case 'Guardado':
        return 'green';
      case 'Ajustado':
        return '#0068b8';
      case 'Descartado':
        return 'red';
    }
  }

  closeAlert() {
    this.success = true;
  }

  setColorDif(diferencia) {
    switch (diferencia) {
      case diferencia < 0:
        return '#f44336'; //red
      case diferencia > 0: // green
        return '#4caf50';
      default:
        return '#03a9f4'; // blue
    }
  }

  getSeries(modal, producto: Articulo) {
    if (producto.es_series === "S") {
      this.conteo_ser.getSeries(this.token, this.conteo.id_conteo, producto.cod_prod).subscribe(
        (response: any) => {
          var Resp = response;
          var texto = Resp._body;
          var jey = JSON.parse(texto);
          if (!jey.series) {
            console.log("ERROR EN LECTURA DE SERIES");
            //console.log(jey.series[0]);
            this.success = false;
          } else {
            this.series = jey.series;
            //console.log("ARTICULO_SERIES " , this.series);
            this.articulo_series = producto;
            this.openSeries(modal);
          }
          error => {
            console.log(<any>error);
            this.success = false;
          }
        });
    }
  }

  getComentario(modal, articulo_con: Articulo) {
    for (let articulo of this.articulos) {
      if (articulo.cod_prod === articulo_con.cod_prod) {
        this.articulo_coment = articulo;
        this.openComments(modal);
        break;
      }
    }
  }


  /*ajusteMacro(){
    let validarEntrada = false;
    let validarSalida = false;
    let posPartEnt = 0;
    let posPartSal = 0;
    for (let articulo of this.articulos){
      if (articulo.es_series === "N") {
        //OBTENER COSTO UNITARIO Y VALOR
        this.ajuste_ser.getCostoUnitario(this.conteo.id_alm, articulo.cod_prod).subscribe(
          (response : any)  => {
            var Resp = response;
            var texto = Resp._body;
            var jey = JSON.parse(texto);
            if (!jey.costo){
              console.log("No se obtuvo el costo");
              console.log(jey.costo[0]);
            }else {
              this.costo = jey.costo[0];
              let auxcostoUnitario = 0;
              let auxdif = 0;
              let auxvalor = 0;
              let valor = 0;
              let movimiento = 0;
              let folio = "XD-00002";
              let fecha = this.datePipe.transform(this.Date, 'yyyyMMdd');
              let hora = this.datePipe.transform(this.Date, 'HHmmss');
              let costeo = 0;
              let cantidad = 0;
              let ent = false;
              let sal = false;
              cantidad = articulo.diferencia * (-1);
              console.log("costo:", this.costo.costo + " " + this.costo.valor );
              auxcostoUnitario = this.costo.costo;
              valor = this.costo.valor;
              auxdif = articulo.diferencia
              costeo = cantidad*(valor / articulo.existencia);
              console.log(fecha, hora);
              if (articulo.diferencia < 0){
                validarSalida=true;
                posPartSal++;
                movimiento = 7; //SALIDA
                auxvalor = valor - (auxdif * auxcostoUnitario);
                //MODIFICAR EXITENCIA
                this.modificarExistencia(this.conteo.id_alm, articulo.conteo, articulo.conteo, auxvalor);
                this.ajuste_ser.modificarExistencia(this.conteo.id_alm, articulo.conteo, articulo.conteo, auxvalor).subscribe(response => {
                  this.Resp = response;
                  var texto = Resp._body;
                  var jey = JSON.parse(texto);
                  //this.ExistenciaSuccess = jey.success;
                  if (jey.success) {
                    //AJUSTE
                    /*this.ajuste_ser.ajuste(movimiento, posPartSal, fecha, this.conteo.id_alm, cantidad, articulo.cod_prod, auxcostoUnitario, costeo, fechaSys, hora, fechaMod).subscribe(
                      (res : any) => {
                      var resp = res;
                      var text = resp._body;
                      var jeyson = JSON.parse(text);
                      if (jeyson.success) {
                        //MODIFICAR-EC
                      }
                    })
                    
                  }
                  
                })
              } else if (articulo.diferencia > 0) {
                validarEntrada=true;
                posPartEnt++;
                movimiento = 6; //ENTRADA
                auxvalor = valor + (auxdif * auxcostoUnitario);
              }
              
            }
          error => {
            console.log(<any>error);
          }
        });


      }
    }
  }*/

  modificarExistencia(almacen, codigo, conteo, valor) {
    this.ajuste_ser.modificarExistencia(almacen, codigo, conteo, valor).subscribe(response => {
      this.Resp = response;
      this.texto = this.Resp._body;
      this.jey = JSON.parse(this.texto);
      this.ExistenciaSuccess = this.jey.success;
    })
  }



  checkPass() {
    var passw = this.ConfirmForm.get('passw').value;
    try {
      this.Passw = this.savePass();
      console.log(this.Passw);
      this.service.checkPass(this.Passw).subscribe(response => {
        this.Resp = response;
        this.texto = this.Resp._body;
        this.jey = JSON.parse(this.texto);
        this.Success = this.jey.success;
        this.Message = this.jey.message;
        if (this.Success) {
          //this.ajusteMacro();
          /*setTimeout(() => {
            location.reload();
          },
          3000);*/
        }
      })
    } catch (error) {
      console.log('Error de logueo');
    }
  }

  savePass() {
    const SavePass = {
      Password: this.ConfirmForm.get('passw').value
    }
    return SavePass;
  }







}
