import { Injectable, Injector } from '@angular/core';
import { BaseResourceModel } from '../models/base-resource.model';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError  } from 'rxjs/operators';



@Injectable()
export abstract class BaseResourceService<T extends BaseResourceModel>  {

  protected http: HttpClient;


  constructor(protected url: string, protected injector: Injector) {
    this.http = injector.get(HttpClient);
  }

  getAll(): Observable<T[]> {
    return this.http.get(this.url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToResources)
    );
  }

  getById(id: number): Observable<T> {
    return this.http.get(this.url + '/' + id).pipe(
      catchError(this.handleError),
      map(this.jsonDataToResource)
    );
  }

  create(resource: T): Observable<T> {
    return this.http.post(this.url, resource).pipe(
      catchError(this.handleError),
      map(this.jsonDataToResource)
    );
  }

  update(resource: T): Observable<T> {
    return this.http.put(this.url, resource.id).pipe(
      catchError(this.handleError),
      map(this.jsonDataToResource)
    );
  }

  delete(resource: T): Observable<T> {
    return this.http.delete(this.url + '/' + resource.id).pipe(
      catchError(this.handleError),
      map(() => null)
    );
  }


  // PROTECTED METHODS

  protected jsonDataToResources(jsonData: any[]): T[] {
    const resources: T[] = [];
    jsonData.forEach(element => resources.push(element as T));
    return resources;
  }

  protected jsonDataToResource(jsonData: any): T {
    return jsonData as T;
  }

  protected handleError(error: any): Observable<any> {
    console.log('Erro na requisição: ', error );
    return throwError(error);
  }


}
