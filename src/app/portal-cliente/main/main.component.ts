import { Component, OnInit, DoCheck } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../models/UserModel';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, DoCheck{
  public title : string;
  public token;
  public into;
  public user : User;
  public empresa : string;
  public usuario : string;

  constructor(private service : UserService, private router : Router){
    this.title = 'Arisoft Web App';
  }

  ngOnInit() {
    this.user = this.service.getIdentity();
  }

  ngDoCheck(){
    this.into = this.service.getLogin();
  }

  public logout(){
    localStorage.clear();
    this.into = null;
    this.token = null;
    this.router.navigate(['']);
  }

}
