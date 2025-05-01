import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TicketSupportComponent } from './ticket-support/ticket-support.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent, TicketSupportComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HighchartsChartModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
