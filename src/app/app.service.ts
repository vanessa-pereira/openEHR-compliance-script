import { Component, OnInit, Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import {RequestOptions, URLSearchParams, Request, RequestMethod, Headers} from '@angular/http';
import { HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { APIResponse, Archetypes, Templates } from './APIResponse';
import { HttpClientModule } from '@angular/common/http';
import { Http, Response } from '@angular/http';
import 'rxjs/Rx';
import { map } from 'rxjs/operators';
import { AppComponent } from './app.component';
import { Observable, Subject, asapScheduler, pipe, of, from, interval, merge, fromEvent } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import * as globals from './globals';
import {NgForm} from '@angular/forms';



@Injectable()

export class getArchetypesFromADL{

   
constructor(private http: Http){
}



getArchetypesListAdlDesigner(username: string, password:string, repositoryId:string): Observable <Archetypes[]> {
    let token = btoa(username + ':' + password);
    var headers = new Headers();
    headers.append('Authorization', `Basic ${token}`);
    return this.http.get('https://ehrscape.marand.si/designerv2srv/api/repository/entry/list?repositoryId=' + repositoryId + '&cache=false&type=archetype&depth=-1' , {headers: headers})
                        .map((res) => this.extractDataFromLists(res).json())
                        .catch((err) => this.loginError(err));
                            
      }
 


getTemplatesListAdlDesigner(username: string, password:string, repositoryId:string): Observable <Templates[]> {
    let token = btoa(username + ':' + password);
    var headers = new Headers();
    headers.append('Authorization', `Basic ${token}`);
    return this.http.get('https://ehrscape.marand.si/designerv2srv/api/repository/entry/list?repositoryId=' + repositoryId + '&cache=false&type=template&depth=-1' , {headers: headers})
                        .map((res) => this.extractDataFromLists(res).json())
                        .catch((err) => this.loginError(err));
                        
      }



private extractDataFromLists(res: Response | any){
  if (res.status < 200 || res.status >= 300) {
    throw new Error('Bad response status: ' + res.status);
  }
    let body = res;
    let sumArchOK = 0;
    return body || [];    
}


private handleError (error: Response | any) {
    let errMsg = error.message || 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }



private loginError (error: Response | any) {
    let errMsg = error.message || 'Wrong credentials or repositoryID';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}