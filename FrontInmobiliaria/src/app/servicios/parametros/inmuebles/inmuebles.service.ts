import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { inmuebleModel } from 'src/app/Modelos/inmuebles.model';
import { LocalStorageService } from '../../Shared/local-storage.service';
import { SeguridadService } from '../../Shared/seguridad.service';

@Injectable({
  providedIn: 'root'
})
export class InmuebleService {

  tk:string=this.servicioLocalStorage.ObtenerToken();

  constructor(
    private http: HttpClient,
    private servicioSeguridad: SeguridadService,
    private servicioLocalStorage: LocalStorageService
  ) { }

  ConsultarInmuebles():Observable<inmuebleModel[]>{
    return this.http.get<inmuebleModel[]>(`${this.servicioSeguridad.url}/inmuebles`)
  }

  EditarProducto(inmueble:inmuebleModel){
    return this.http.put(`${this.servicioSeguridad.url}/inmuebles/${inmueble.id}`,
    {
      id:inmueble.id,
      precio: inmueble.precio,
      direccion: inmueble.direccion,
      imagen: inmueble.imagen,
      linkyoutube: inmueble.linkyoutube,
    
      headers: new HttpHeaders({
        Authoriation: `Bearer ${this.tk}`
      })
    });
  }

  ConsultarInmueble(id:string):Observable<inmuebleModel>{
    return this.http.get<inmuebleModel>(`${this.servicioSeguridad.url}/inmuebles/${id}`,{
      headers: new HttpHeaders({
        Authoriation: `Bearer ${this.tk}`
      })
    })
  }

}
