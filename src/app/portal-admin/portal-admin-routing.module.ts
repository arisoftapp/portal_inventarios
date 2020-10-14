import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminMainComponent } from './admin-main/admin-main.component'
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminInicioComponent } from './admin-inicio/admin-inicio.component';
import { EmpresaComponent } from './empresa/empresa.component';

const adminRoutes: Routes = [
  { path : 'adminlogin', component : AdminLoginComponent },
  { path : 'adminportal', component : AdminMainComponent,
        children : [
          { path : '', component : AdminInicioComponent},
          { path : 'empresa/:id', component : EmpresaComponent,
              children : [
                { path : 'ModificarEmpresa', component : EmpresaComponent},
                { path : 'RegistroUsuario', component : EmpresaComponent},
                { path : 'DetallesUsuario', component : EmpresaComponent},
                { path : 'ModificarUsuario', component : EmpresaComponent},
                { path : 'confirm', component : EmpresaComponent},
              ]}
        ]
  },
];
    
  @NgModule({
    imports: [RouterModule.forChild(adminRoutes)],
    exports: [RouterModule]
  })

export class AdminRoutingModule { }   