import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { ArchwizardModule } from 'ng2-archwizard';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ArchwizardModule.forRoot() ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
