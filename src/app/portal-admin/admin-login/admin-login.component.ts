import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminUserService } from '../services/admin-user.service' ;
import { UsuarioAdmin } from '../models/UsuarioAdmin'
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
  public admin : UsuarioAdmin;
  public Login : any;
  public Resp : any;
  public Success : boolean = true;
  public Message : string;
  public identity;
  public texto;
  public jey;
  public hola;
  public into;
  LoginForm : FormGroup;

  constructor(private router : Router, private form : FormBuilder, private service : AdminUserService) {
    this.admin = new UsuarioAdmin ();
   }
  
  ngOnInit() {
    this.into = this.service.getLogin();
      if (this.into){
        this.router.navigate(['adminportal']);
      }

      this.admin = this.service.getAdminIdentity();
      this.LoginForm = this.form.group({
        username:[''],
        password:['']
      })    
  } 

  onSubmit(){
    try{
      this.Login = this.SaveLogin();
      console.log(this.Login);
      this.service.logUser(this.Login).subscribe(response => {
        this.Resp = response;
        this.texto = this.Resp._body;
        this.jey = JSON.parse(this.texto);
        this.Success = this.jey.success;
        this.Message = this.jey.message;
        console.log(this.jey);
        if (this.Success){
          this.router.navigate(['adminportal']);
          localStorage.setItem('admin-into', JSON.stringify(this.Success));
          localStorage.setItem('encrypted', JSON.stringify(this.jey.token));
          localStorage.setItem('admin', JSON.stringify(this.jey.admin));
        }
      })
    } catch(error){
      console.log('Error de logueo');
    }
  }

  SaveLogin(){
    const SaveLogin = {
      Username : this.LoginForm.get('username').value,
      Password : this.LoginForm.get('password').value,
    }

    return SaveLogin;
  }

}
