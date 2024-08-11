import { Router } from '@angular/router';
import { AccesoService } from './../../../services/Acceso/acceso.service';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Login } from '../../../interfaces/Login';
import { language } from '../../../settings/language';
import { appsettings } from '../../../settings/appsettings';

import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatCardModule,MatFormFieldModule,MatInputModule,MatButtonModule,ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private AccesoService = inject(AccesoService);
  private router = inject(Router);
  private formBuild = inject(FormBuilder);
  public language: any=language;
  private _snackBar = inject(MatSnackBar);

  public formLogin: FormGroup = this.formBuild.group({
    NombreUsuario: ['', Validators.required],
    contrasena: ['', Validators.required],
  });

  Login() {
    if (this.formLogin.invalid) return;
    const obj: Login = {
      NombreUsuario:this.formLogin.value.NombreUsuario,
      contrasena: this.formLogin.value.contrasena,
    };
    this.AccesoService.Login(obj).subscribe({
      next:(data)=>{
        if(data.isSuccess){
          const token = data.token.token;
          localStorage.setItem("token",token);
          this.router.navigate(['home'])
        }else{
          this.openSnackBar(this.language.alert_invalid_login);
        }
      },error:(error)=>{
        console.error(error)
        this.openSnackBar(this.language.alert_invalid_login);
      }
    })
  }

  Registro(){
    this.router.navigate(['registro'])
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, language.button_action_close, {
      duration: appsettings.login_alert_duration_in_ss * 1000,
    });
  }


}
