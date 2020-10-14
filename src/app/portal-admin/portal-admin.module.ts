import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminMainComponent } from './admin-main/admin-main.component';
import { AdminInicioComponent } from './admin-inicio/admin-inicio.component';
import { EmpresaComponent } from './empresa/empresa.component';


//ROUTING
import { AdminRoutingModule } from './portal-admin-routing.module';

//DIRECTIVES
import { ShowPassDirective } from './empresa/show-pass.directive';


@NgModule({
  declarations: [
    AdminLoginComponent, 
    AdminMainComponent, 
    AdminInicioComponent, 
    EmpresaComponent, ShowPassDirective],
  
    imports: [
    CommonModule,
    AdminRoutingModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PortalAdminModule { }
