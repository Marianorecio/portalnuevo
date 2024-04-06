import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/seo/api.service';
import { HttpClient } from '@angular/common/http';

declare const bootstrap: any;
@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    imports: [CommonModule, RouterLink, RouterOutlet, FormsModule, DatePipe],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeComponent {
  searchField: any;
  noticiasTop: any[] = [];
  dominios: string = "https://www.eleconomista.com.mx/,https://www.merca20.com/,https://www.eluniversal.com.mx/"
  items: any[] = [];
  category: string = '';
  modal: any;
  title: any;
  description: any;
  urlToImage: any;
  content: any;
  autor: any;
  fecha: any;
  comments: any;
  url: any;
  nombre: any;
  correo: any;
  comt: any;
  tieneComentarios: boolean = true;
  modalComentarios: any;
  titulo: any = '';
  cargando: boolean = true;
  cargandoComentarios: boolean = true;
  loggeado: boolean = false;
  loginContrasenia: any = '';
  loginCorreo: any = '';
  
  categorias: any[] = [
    { value: 'general', nombre: 'General'}, 
    { value: 'business', nombre: 'Negocios'}, 
    { value: 'entertainment', nombre: 'Entretenimiento'}, 
    { value: 'health', nombre: 'Salud'},
    { value: 'science', nombre: 'Ciencia'},
    { value: 'sports', nombre: 'Deporte'}, 
    { value: 'technology', nombre: 'Tecnología'}
  ];
  constructor(private apiService: ApiService, private http: HttpClient) {
    this.searchField = '';
    this.runQuery();
  }
  //Carga las noticias y las noticias top
  runQuery(){
    this.cargando = true;
    this.searchField = '';
    this.category = '';
    this.apiService.getNoticias("q=mexico").subscribe((data) => {
      this.cargando = false;
      console.log(data.articles);
      this.items = data.articles;
    });
    this.apiService.getNoticiasTop("country=mx").subscribe((data) => {
      this.noticiasTop = data.articles;
    });
  }
  //Busca noticias con el texto ingresado en el campo.
  buscar(event: any){
    this.cargando = true;
    this.apiService.getNoticias("q="+this.searchField).subscribe((data) => {
      this.cargando = false;
      this.items = [];
      this.items = data.articles;
    });
  }
  //Busca noticia por categoría
  buscarPorCategoria(event: any){
    if(this.category != ''){
      this.apiService.getNoticiasTop("country=mx&category="+this.category).subscribe((data) => {
        this.items = [];
        this.items = data.articles;
      });
    } 
  }

  //Abre el modal con la noticia seleccionada
  abrirNoticia(item: any) {
    this.title = item.title;
    this.description = item.description;
    this.content = item.content;
    this.urlToImage = item.urlToImage;
    this.autor = item.author;
    this.fecha = item.publishedAt;
    this.url = item.url;
    if (this.modal === undefined) {
      this.modal = new bootstrap.Modal(document.getElementById('noticiaModal'), {
        keyboard: true
      })
      const selectPlayer = document.getElementById('noticiaModal')
      selectPlayer?.addEventListener('hidden.bs.modal', this.onCloseModal.bind(this));
    }
    this.modal?.show();
  }
  //Cierra el modal de la noticia seleccionada y limpia las variables.
  onCloseModal() {
    this.title = '';
    this.description = '';
    this.content = '';
    this.urlToImage = '';
    this.autor = '';
    this.fecha = '';
    this.url = '';
    this.modal.hide();
  }

  //Envia comentario para guardar en base de datos
  enviarComentario(){
    let data = {
      comentario: this.comt,
      nombre: this.nombre,
      correo: this.correo,
      noticiaid: this.titulo
    }
    this.http.post("http://localhost:8000/api/portal/comentarios/", data).subscribe((data) => {
      if(localStorage.getItem('logeado') != 'Si'){
        this.nombre = '';
        this.correo = '';
      }
      
      this.comt = '';
      this.tieneComentarios = true;
      this.comments = [];
      this.comments = data;
      this.comments = this.comments['data'];
      if (this.modalComentarios === undefined) {
        this.modalComentarios = new bootstrap.Modal(document.getElementById('comentariosModal'), {
          keyboard: true
        })
        const selectPlayer = document.getElementById('comentariosModal')
        selectPlayer?.addEventListener('hidden.bs.modal', this.onCloseModalComentarios.bind(this));
      }
      this.modalComentarios?.show();
    });
  }
  //Cierra modal de comentarios
  cerrarModalComentarios(){
    this.tieneComentarios = false;
    this.modalComentarios?.hide();
  }

  //Abre modal de comentarios
  verComentarios(title: any){
    if(localStorage.getItem('logeado') =='Si'){ 
      this.http.get("http://localhost:8000/api/portal/comentarios/"+title).subscribe((data) => {
        this.titulo = title;
        this.comments = [];
        this.comments = data;
        this.comments = this.comments['data'];
        if(this.comments.length == 0){
          this.tieneComentarios = false;
        }
        if(localStorage.getItem('logeado') =='Si'){
          this.nombre = localStorage.getItem('nombre');
          this.correo = localStorage.getItem('correo');
        }else{
          this.nombre = '';
          this.correo = '';
        }
        this.tieneComentarios = true;
        if (this.modalComentarios === undefined) {
          this.modalComentarios = new bootstrap.Modal(document.getElementById('comentariosModal'), {
            keyboard: true
          })
          const selectPlayer = document.getElementById('comentariosModal')
          selectPlayer?.addEventListener('hidden.bs.modal', this.onCloseModalComentarios.bind(this));
        }
        this.modalComentarios?.show();
      });
    } else {
      alert("No iniciaste sesion");
    }
   
  }
  //Cierra modal de comentarios
  onCloseModalComentarios() {
    this.modalComentarios?.hide();
    this.comments = [];
    this.titulo = '';
  }

}
