import { CommonModule, DOCUMENT  } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inject, Injectable, InjectionToken } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {
    
  }

  getNoticias(parametros: any = ""): Observable<any> {
    const URL = 'https://newsapi.org/v2/everything?'
      + parametros
      + '&apiKey=fde173e2f95f49929936a59bb2f453f8';

    return this.http.get(URL);
  }

  getNoticiasTop(parametros: any): Observable<any> {
    const URL = 'https://newsapi.org/v2/top-headlines?'
      + parametros
      + '&apiKey=fde173e2f95f49929936a59bb2f453f8';

    return this.http.get(URL);
  }

  public saveData(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  public getData(key: string) {
    const value = localStorage.getItem(key);
    return value;
  }

  public removeData(key: string) {
    localStorage.removeItem(key);
  }

  public clearData() {
    localStorage.clear();
  }
}