import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConteoComponent } from '../portal-cliente/conteo/conteo.component';
import { LoginComponent } from '../portal-cliente/login/login.component';
import { MainComponent } from '../portal-cliente/main/main.component';
import { ConteosComponent } from '../portal-cliente/conteos/conteos.component';
import { ImprimeComponent } from '../portal-cliente/imprime/imprime.component';

const adminRoutes: Routes = [
    { 
      path : '', component : LoginComponent
        /*children : [
          { path : '', component : LoginComponent},
          { path : 'portal_cliente', component : MainComponent },
          { path : 'consulta/:id', component : ConteoComponent}
        ]*/
    },
    { path : 'portal-cliente', component : MainComponent,
        children : [
            { path : '', component : ConteosComponent}, //LISTA DE CONTEOS
            { path : 'consulta/:id', component : ConteoComponent}, //DETALLE DE CONTEO
            { path : 'imprime-conteo/:id/:tipo', component : ImprimeComponent},
            { path: '**', redirectTo: 'portal-cliente', pathMatch: 'full' },
            
            
        ]
    },
    //{ path: '**', redirectTo: 'portal-cliente', pathMatch: 'full' },
];
    
@NgModule({
    imports: [RouterModule.forChild(adminRoutes)],
    exports: [RouterModule]
})

export class ClientRoutingModule { }   