import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {getArchetypesFromADL} from './app.service'
import { HttpModule } from '@angular/http';
import {NgForm} from '@angular/forms';
import {NgxPrintModule} from 'ngx-print';
//import { CookieService } from 'angular2-cookie/services/cookies.service';

import { AppComponent } from './app.component';


@NgModule({
  declarations: [ AppComponent ],
  imports: [ BrowserModule, HttpClientModule, FormsModule, HttpModule, NgxPrintModule ],
  providers: [getArchetypesFromADL ],

  bootstrap: [ AppComponent ]
})

export class AppModule { }