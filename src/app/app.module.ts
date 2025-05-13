import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TicketSupportComponent } from './ticket-support/ticket-support.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule as httpClientModule } from '@angular/common/http';
import { TicketSupport2Component } from './ticket-support2/ticket-support2.component';

@NgModule({
  declarations: [AppComponent, TicketSupportComponent, TicketSupport2Component],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HighchartsChartModule,
    ReactiveFormsModule,
    httpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
