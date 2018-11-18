import { Component, OnInit, Input} from '@angular/core';
import { HttpClient, HttpParams, jsonpCallbackContext } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { APIResponse, Archetypes, Templates } from './APIResponse';
import { HttpClientModule } from '@angular/common/http';
import { Observable, Subject, asapScheduler, pipe, of, from, interval, merge, fromEvent } from 'rxjs'; 
import { getArchetypesFromADL } from './app.service';
import {NgModel} from '@angular/forms'
import { HttpHeaders } from '@angular/common/http';
import {RequestOptions, URLSearchParams, Request, RequestMethod, Http, Response, Headers} from '@angular/http';
import * as globals from './globals';
import {NgForm} from '@angular/forms';


@Component(
  {
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [getArchetypesFromADL]
  }
)


export class AppComponent implements OnInit {
  title = 'OpenEHR archetypes compliance with openEHR CKM';
  results = '';
  errorMessage: string = "ERROR MESSAGE";
  archetypeLists: Archetypes[];
  templatesLists: Templates[];
  templateDepends: Templates[];
  arc: string;
  temp: string;
  response: string;
  specializedArchYES: string = 'Specialized Archetype';
  specializedArchNO: string = 'Not specialized archetype'
  sumArchError = 0;
  specializedCount = 0;
  username : string;
  password : string;
  repositoryId: string;




  public constructor(private myService: getArchetypesFromADL, private http: Http, private http1: HttpClient ) {  }
    
  ngOnInit() {}


  createauthenticationheader(){
    this.getArchetypesListAdlDesigner() 
    this.getTemplatesListAdlDesigner() 
  }


  getTemplatesListAdlDesigner() {
    this.myService.getTemplatesListAdlDesigner(this.username, this.password, this.repositoryId)
        .subscribe(
          (templatesLists) => this.templatesLists = templatesLists,
          (error) => this.errorMessage = <any>error,
          () => {
            this.processListTemplates(this.templateDepends)
          }
        );
  };

  processListTemplates(templateDepends: Templates[]) {
   for (let i = 0; i < this.templatesLists.length; i++) {
    var dependsOn=this.templatesLists[i].dependsOn.archetypes;
      for(var archetype in this.templatesLists[i].dependsOn.archetypes){
        console.log(archetype);
        console.log(this.templatesLists[i].dependsOn.archetypes[archetype]);
        var sliceArchDependsOn= this.templatesLists[i].dependsOn.archetypes[archetype];
      };
    };
  }




  getArchetypesListAdlDesigner() {
    this.myService.getArchetypesListAdlDesigner(this.username, this.password, this.repositoryId)
        .subscribe(
          (archetypeLists) => this.archetypeLists = archetypeLists,
          (error) => this.errorMessage = <any>error,
          () => {
          for (let i = 0; i < this.archetypeLists.length; i++) {
              if (this.archetypeLists[i].dependsOn && this.archetypeLists[i].dependsOn.archetypes) {
                if (this.archetypeLists[i].dependsOn.archetypes[0].indexOf('openEHR') >= 0) {
                    this.specializedCount++;
               }
             }
          }
          this.processList(this.archetypeLists)
    });
  };


  private handleError(error: Response | any) {
    let errMsg = error.message || 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }

  processList(archetypeLists: Archetypes[]) {
    const statusOut = '<br>Attention Required! Outdated (Major Version on CKM) or internal archetype.';
    const statusUpd = '<br>Compliant archetype with CKM.';
    let imgOk = '<img src="https://help.healthycities.org/hc/en-us/article_attachments/209781707/met-green-500px.png" width="20" height="20" alt="">';
    let imgNotOk = '<img src="https://help.healthycities.org/hc/en-us/article_attachments/209781727/not-met-red-500px.png" width="20" height="20" alt="">';
    
    for (let i = 0; i < this.archetypeLists.length; i++) {
      const githubBaseUrl = "https://raw.githubusercontent.com/openEHR/CKM-mirror/master/local/archetypes/"
      let options = new RequestOptions();
      options.params = new URLSearchParams();

      this.http.get(githubBaseUrl + this.archetypeLists[i].rmType.toLowerCase() + '/' + this.archetypeLists[i].archetypeId + '.adl', options)
        .subscribe(
          response => {
            archetypeLists[i].temp_val = response.text().startsWith('archetype') ? imgOk + statusUpd : imgNotOk + statusOut;
        },

        response2 => {
          if (this.archetypeLists[i].rmType.toLowerCase() === 'action' || 'observation' || 'admin_entry' || 'evaluation' || 'instruction') {
            this.http.get(githubBaseUrl + 'entry/' + this.archetypeLists[i].rmType.toLowerCase() + '/' + this.archetypeLists[i].archetypeId + '.adl')
              .subscribe(
                response => {
                  archetypeLists[i].temp_val = response.text().startsWith('archetype') ? imgOk + statusUpd : imgNotOk + statusOut;
              },


              error => {
                if (error.status === 404) {
                  this.sumArchError++;

                  archetypeLists[i].temp_val = imgNotOk + statusOut;
                  let testeurl = this.http.get(githubBaseUrl + this.archetypeLists[i].rmType.toLowerCase() + '/' + this.archetypeLists[i].archetypeId + '.adl');
                  var url;

                  switch (this.archetypeLists[i].rmType.toLowerCase()) {
                    case "action":
                    case "observation":
                    case "admin_entry":
                    case "evaluation":
                    case "instruction":
                        url = githubBaseUrl + 'entry/' + this.archetypeLists[i].rmType.toLowerCase() + '/' + this.archetypeLists[i].archetypeId + '.adl';
                        break;
                    
                    default:
                        url = githubBaseUrl + this.archetypeLists[i].rmType.toLowerCase() + '/' + this.archetypeLists[i].archetypeId + '.adl'; 
                        break;
                  }


                  if (url.indexOf(".v0") > 0) {
                    var urlGithub = url.replace("v0", "v1");
                    console.log(urlGithub);
                    return this.http.get(urlGithub)
                      .subscribe(
                        data => archetypeLists[i].urlGithubReturn = urlGithub,
                        error => { archetypeLists[i].urlGithubReturn = (error.status === 200) ? urlGithub : "Internal Archetype" } 
                      );
                    }
                  

                  if (url.indexOf(".v1") > 0) {
                    var urlGithub = url.replace("v1", "v0");
                    return this.http.get(urlGithub)
                      .subscribe(
                        data => archetypeLists[i].urlGithubReturn = urlGithub,
                        error => {
                            var urlGithub = url.replace("v1", "v2");
                            return this.http.get(urlGithub)
                              .subscribe(
                                data => { archetypeLists[i].urlGithubReturn = urlGithub },
                                error => { archetypeLists[i].urlGithubReturn = (error.status === 200) ? urlGithub : "Internal Archetype" }
                              );
                        },
                     );
                   }



                  if (url.indexOf(".v2") > 0) {
                    var urlGithub = url.replace("v2", "v1");
                    return this.http.get(urlGithub)
                      .subscribe(
                      data => archetypeLists[i].urlGithubReturn = urlGithub,
                      error => {
                          var urlGithub = url.replace("v2", "v3");
                          return this.http.get(urlGithub)
                          .subscribe(
                            data => { archetypeLists[i].urlGithubReturn = urlGithub },
                            error => { archetypeLists[i].urlGithubReturn = (error.status === 200) ? urlGithub : "Internal Archetype" }
                          );
                     },
                   );
                  }



                  if (url.indexOf(".v3") > 0) {
                    var urlGithub = url.replace("v3", "v2");
                    return this.http.get(urlGithub)
                      .subscribe(
                        data => archetypeLists[i].urlGithubReturn = urlGithub,
                        error => {
                            var urlGithub = url.replace("v3", "v4");
                            return this.http.get(urlGithub)
                            .subscribe(
                                data => { archetypeLists[i].urlGithubReturn = urlGithub },
                                error => { archetypeLists[i].urlGithubReturn = (error.status === 200) ? urlGithub : "Internal Archetype" }
                            );  
                        }, 
                      );                                            
                    }
                  }
                }
              );
            }
          }
        );
      };
   }
}