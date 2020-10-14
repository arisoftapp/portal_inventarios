import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ConteoComponent } from './conteo/conteo.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { NgxSpinnerModule } from 'ngx-spinner';

//ROUTING
import { ClientRoutingModule } from './portal-cliente-routing.module';
import { ConteosComponent } from './conteos/conteos.component';

import { UserService } from './services/user.service';
import { ConteoService } from './services/conteo.service';
import { ImprimeComponent } from './imprime/imprime.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    ConteoComponent, 
    LoginComponent, 
    MainComponent, 
    ConteosComponent, 
    ImprimeComponent
  ],

  imports: [
    CommonModule,
    ClientRoutingModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgxPaginationModule,
    NgxSpinnerModule
  ],

  bootstrap: [ConteoComponent]
})
export class PortalClienteModule { }
