import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service' ;
import { User } from '../models/UserModel'
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers : [
    UserService
  ] 
})
export class LoginComponent implements OnInit {
  public user : User;
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

  constructor(private router : Router, private form : FormBuilder, private service : UserService) {
    this.user = new User ();
   }

  ngOnInit() {
    this.into = this.service.getLogin();
      if (this.into){
        this.router.navigate(['portal-cliente']);
      }

      this.user = this.service.getIdentity();
      this.LoginForm = this.form.group({
        username:[''],
        password:['']
      })   
  }

  onSubmit(){
    try{
      this.Login = this.SaveLogin();
      //console.log(this.Login);
      this.service.logUser(this.Login).subscribe(response => {
        this.Resp = response;
        this.texto = this.Resp._body;
        this.jey = JSON.parse(this.texto);
        this.Success = this.jey.success;
        this.Message = this.jey.message;
        this.hola = this.jey.hola;
        if (this.Success){
          this.router.navigate(['/portal-cliente']);
          localStorage.setItem('into', JSON.stringify(this.Success));
          localStorage.setItem('tok', JSON.stringify(this.jey.token));
          localStorage.setItem('empresa', JSON.stringify(this.jey.empresa));
          localStorage.setItem('user', JSON.stringify(this.jey.username));
          localStorage.setItem('COBF', JSON.stringify(this.jey.dominio));
        }
      })
    } catch(error){
      //console.log('Error de logueo');
    }
  }

  SaveLogin(){
    const SaveLogin = {
      Username : this.LoginForm.get('username').value,
      Password : this.LoginForm.get('password').value,
    }

    return SaveLogin;
  }

  toAdmin(){
    this.router.navigate(['adminportal']);
  }

}
