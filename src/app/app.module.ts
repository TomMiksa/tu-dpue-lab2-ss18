import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { ArchwizardModule } from 'ng2-archwizard';
import {ngfModule} from 'angular-file';
import {FileSizeModule} from 'ngx-filesize';
import {HttpClientModule} from '@angular/common/http';
import {TissService} from './tiss.service';
import {OpenDoarService} from './opendoar.service';
import {JsonService} from "./json.service";
import {PDFService} from "./pdf.service";


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ngfModule,
    FileSizeModule,
    HttpClientModule,
    ArchwizardModule.forRoot() ],
  providers: [
    TissService,
    OpenDoarService,
    PDFService,
    JsonService

  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
