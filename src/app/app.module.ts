import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { ArchwizardModule } from 'ng2-archwizard';
import {ngfModule} from 'angular-file';
import {FileSizeModule} from 'ngx-filesize';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ngfModule,
    FileSizeModule,
    ArchwizardModule.forRoot() ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
