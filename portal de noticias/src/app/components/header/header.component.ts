import { Inject, PLATFORM_ID, Component, Input } from '@angular/core';
import { ApiService } from '../../services/seo/api.service';
import { HttpClient } from '@angular/common/http';

declare const bootstrap: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  
  loginContrasenia: any = '';
  loginCorreo: any = '';
  modalLogearse: any;
  modalRegistro: any;
  modalSesion: any;
  changeLogins: any = false;
  nombre: any = '';
  respuesta: any;
  
  registroCorreo: any = '';
  registroContra: any = '';
  registroNombre: any = '';
  constructor(@Inject(PLATFORM_ID) private platformId: object,
            private apiService: ApiService, 
            private http: HttpClient){
    this.checkLogin();
  }
  // se revisa si ya está logeado el usuario
  checkLogin(){
    let log = this.apiService.getData('correo');
    let pass = this.apiService.getData('contra');
    let nom = this.apiService.getData('nombre');
    let logged = this.apiService.getData('logeado');
    if(logged == 'Si'){
      this.nombre = nom;
      this.changeLogins = true;
    }else{
      this.changeLogins = false;
      this.nombre = '';
    }
    
  }
  //Abre modal para iniciar sesión
  logear(){
    if (this.modalLogearse === undefined) {
      this.modalLogearse = new bootstrap.Modal(document.getElementById('loginModal'), {
        keyboard: true
      })
      const selectPlayer = document.getElementById('loginModal')
      selectPlayer?.addEventListener('hidden.bs.modal', this.cerrarModalLogin.bind(this));
    }
    this.modalLogearse?.show();
  }
  //Abre modal para registrar un nuevo usuario
  openRegister(){
    if (this.modalRegistro === undefined) {
      this.modalRegistro = new bootstrap.Modal(document.getElementById('loginRegistro'), {
        keyboard: true
      })
      const selectPlayer = document.getElementById('loginRegistro')
      selectPlayer?.addEventListener('hidden.bs.modal', this.cerrarModalRegistro.bind(this));
    }
    this.modalRegistro?.show();
  }
  //Abre modal para poder cerrar sesión
  cerrarSesion(){
    this.loginCorreo = localStorage.getItem('correo');
    this.loginContrasenia = localStorage.getItem('contra');
    if (this.modalSesion === undefined) {
      this.modalSesion = new bootstrap.Modal(document.getElementById('modalSesion'), {
        keyboard: true
      })
      const selectPlayer = document.getElementById('modalSesion')
      selectPlayer?.addEventListener('hidden.bs.modal', this.cerrarModalSesion.bind(this));
    }
    this.modalSesion?.show();
  }
  //Cierra y limpia variables al cerrar modal de inicio de sesión
  cerrarModalLogin(){
    this.loginContrasenia = '';
    this.loginCorreo = '';
    this.modalLogearse?.hide();
  }

  //Cierra y limpia variables al cerrar modal de registro
  cerrarModalRegistro(){
    this.registroCorreo = '';
    this.registroContra = '';
    this.registroNombre = '';
    this.modalRegistro?.hide();
  }
  //Cierra y limpia variables al cerrar modal de cerrar sesión
  cerrarModalSesion(){
    this.modalSesion?.hide();
  }

  //Inicia sesión con el usuario ingresado
  loggearse(){
    let login = {
      correo: this.loginCorreo, contra: this.loginContrasenia
    }
    this.http.post("http://localhost:8000/api/portal/usuarios/login",login).subscribe((data) => {
      this.respuesta = data;
      this.apiService.saveData('logeado','Si');
      this.apiService.saveData('correo',this.respuesta['data'][0]['correo']);
      this.apiService.saveData('contra',this.respuesta['data'][0]['contra']);
      this.apiService.saveData('nombre',this.respuesta['data'][0]['nombre']);
      this.nombre = this.respuesta['data'][0]['nombre'];
      this.changeLogins = true;
      this.loginContrasenia = '';
      this.loginCorreo = '';
      this.modalLogearse.hide();
    },error => alert('Usuario o contraseña incorrectos.'));
  }
  //Registra un nuevo usuario e inicia sesión con el.
  registrarse(){
    if(this.registroContra == ''){
      alert('Favor de escribir una contraseña.');
      return;
    }
    if(this.registroNombre == ''){
      alert('Favor de escribir su nombre.');
      return;
    }
    if(this.registroCorreo == ''){
      alert('Favor de escribir un correo.');
      return;
    }
    let data = {
      nombre: this.registroNombre,
      correo: this.registroCorreo,
      contra: this.registroContra
    }
    this.http.post("http://localhost:8000/api/portal/usuarios",data).subscribe((data) => {
      this.respuesta = data;
      this.changeLogins = true;
      this.apiService.saveData('logeado','Si');
      this.apiService.saveData('correo',this.registroCorreo);
      this.apiService.saveData('contra',this.registroContra);
      this.apiService.saveData('nombre',this.registroNombre);
      this.nombre = this.registroNombre;
      this.registroCorreo = '';
      this.registroContra = '';
      this.registroNombre = '';
      this.modalRegistro.hide();
    },error => alert('El usuario ya existe.'));
  }

  //Cierra sesión y limpia las variables de localStorage
  cerrar(){
    this.apiService.clearData();
    this.changeLogins = false;
    this.modalSesion.hide();
  }

  actualizarPerfil(){
    if(this.loginContrasenia == ''){
      alert('Favor de escribir una contraseña.');
      return;
    }
    if(this.nombre == ''){
      alert('Favor de escribir su nombre.');
      return;
    }
    if(this.loginCorreo == ''){
      alert('Favor de escribir un correo.');
      return;
    }
    let data = {
      nombre: this.nombre,
      correo: this.loginCorreo,
      contra: this.loginContrasenia
    }
    this.http.put("http://localhost:8000/api/portal/usuarios",data).subscribe((data) => {
      this.respuesta = data;
      this.changeLogins = true;
      this.apiService.saveData('logeado','Si');
      this.apiService.saveData('correo',this.loginCorreo);
      this.apiService.saveData('contra',this.loginContrasenia);
      this.apiService.saveData('nombre',this.nombre);
      this.modalSesion.hide();
    },error => alert(error['mensaje']));
  }
}