import { Component, OnInit, Input, ViewChildren, ElementRef, AfterViewInit  } from '@angular/core';
import localeMX from '@angular/common/locales/es-MX';
import { registerLocaleData } from '@angular/common';
import { Conteo } from '../models/ConteoModel';
import { Articulo } from '../models/ArticuloModel';
import { Serie } from '../models/SerieModel';
import { User } from '../models/UserModel';
import { UserService } from '../services/user.service';
import { ConteoService } from '../services/conteo.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as jsPDF from 'jspdf';


@Component({
  selector: 'app-imprime',
  templateUrl: './imprime.component.html',
  styleUrls: ['./imprime.component.css']
})

export class ImprimeComponent implements OnInit {
  conteo : Conteo;
  articulos : Articulo[];
  articulos_filter : Articulo [];
  series : Serie[];
  public user : User;
  token;
  id;
  tipo;
  reporte : string;

  myDate : Date;

  @ViewChildren('content') content : ElementRef;
  opc_cont: any;

  constructor(private service : UserService, public conteo_ser : ConteoService, private router : Router,
    private activatedRouter : ActivatedRoute) { 
    registerLocaleData(localeMX);
  }

  getColor(estado) { 
    switch (estado) {
      case 'Guardado':
        return 'green';
      case 'Ajustado':
        return 'blue';
      case 'Descartado':
        return 'red';
    }
  }
  
  ongAfterViewInit(){

  }

  descargarPDF(){
    let printContents, popupWin;
    printContents = document.getElementById('content').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Reporte de conteo</title>
          <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,600" rel="stylesheet">
          <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
          <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
          <link rel="stylesheet" type="text/css" href="../imprime/imprime.component.css" />
        </head>
        <body onload="window.print();window.close()">${printContents}</body>
        <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>
      </html>`
    );
    popupWin.document.close();
    /*let doc = new jsPDF();
    let specialElementHandless = {
      '#editor': function(element, renderer){
        return true;
      }
    };

    let content = this.content.nativeElement;
    
    doc.fromHTML(document.getElementById("content").innerHTML, 15,15, {
      'width': 190,
      'elementHandless' : specialElementHandless
    });

    doc.save('ReporteConteo.pdf');*/
  }

  ngOnInit() {
    this.user = this.service.getIdentity();
    this.token = this.service.getToken();
    this.myDate = new Date();
    this.activatedRouter.params.subscribe(params => {
      this.id = params['id'];
      this.tipo = params['tipo'];
    });
    if (this.tipo === 'normal'){
      this.reporte = "Todos los artículos del conteo";
    } else {
      this.reporte = "Sólo los articulos con diferencia del conteo";
    }


    this.getConteo();
    this.getConteoDet();
  }

  getConteo(){
    this.conteo_ser.getConteo(this.token, this.id).subscribe(
      (response : any)  => {
        var Resp = response;
        var texto = Resp._body;
        var jey = JSON.parse(texto);
        if (!jey.conteos){
          console.log("ERROR EN LECTURA DE CONTEOS");
          console.log(jey.conteos[0]);
        }else {
          this.conteo = jey.conteos[0];
          //console.log(this.conteo);
        }
      error => {
        console.log(<any>error);
      }
    });
  }

  getConteoDet(){
    this.conteo_ser.getConteoDet(this.token, this.id).subscribe(
      (response : any)  => {
        var Resp = response;
        var texto = Resp._body;
        var jey = JSON.parse(texto);
        if (!jey.articulos){
          console.log("ERROR EN LECTURA DE DETALLE");
          //console.log(jey.articulos);
        }else {
          this.articulos = jey.articulos;
          //console.log(this.articulos);
          this.getAllSeries();
        }
      error => {
        console.log(<any>error);
      }
    });
  }

  regresar(){
    this.router.navigate(['portal-cliente/consulta/', this.conteo.id_conteo]);
  }

  getAllSeries() {
    this.conteo_ser.getAllSeries(this.token, this.conteo.id_conteo).subscribe(
      (response : any)  => {
        var Resp = response;
        var texto = Resp._body;
        var jey = JSON.parse(texto);
        if (!jey.series){
          console.log("ERROR EN LECTURA DE ALLSERIES");
        }else {
          this.series = jey.series;
          this.setEsDiferencia();
          //console.log(this.series);
        }
      error => {
        console.log(<any> error);
      }
    });
  }

  setEsDiferencia(){
    for (let articulo of this.articulos){
      articulo.es_diferencia = false;
      var contar : number = 0;
      if (articulo.es_series === 'S'){
        if (articulo.conteo === articulo.existencia){
          for (let serie of this.series){
            if (serie.cod_prod === articulo.cod_prod){
              if (serie.estatus === "Disponible"){
                contar = contar + 1;
              }
            }
          }
          if (contar !== articulo.conteo){
            articulo.es_diferencia = true;
          } 
        }
      } 
    }
    this.setOpcCont();
  }

  setOpcCont(){
    this.articulos_filter = [];
    console.log('Tipo: ', this.tipo);
    if (this.tipo === 'normal'){
      this.articulos_filter = this.articulos;
    } else {
      for (let articulo of this.articulos){
        //console.log(articulo.diferencia);
        if (articulo.diferencia !== 0 || articulo.es_diferencia) {
          //console.log(articulo.diferencia);
          this.articulos_filter.push(articulo);
          //console.log(articulo.diferencia);
        }
      }
    }
  }

}
