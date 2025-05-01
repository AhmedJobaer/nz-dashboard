import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-ticket-support',
  templateUrl: './ticket-support.component.html',
  styleUrls: ['./ticket-support.component.css'],
})
export class TicketSupportComponent {
  Highcharts: typeof Highcharts = Highcharts;

  chartOptions: Highcharts.Options = {
    chart: {
      type: 'pie',
      backgroundColor: '#ffffff',
      plotShadow: false,
    },
    title: {
      text: 'Ticket Status Distribution (Apr 1 , Apr 23, 2025)',
    },
    subtitle: {
      text: 'Source: Ticket Support System',
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
    },
    accessibility: {
      point: {
        valueSuffix: '%',
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %',
        },
        showInLegend: true,
      },
    },
    series: [
      {
        type: 'pie',
        name: 'Tickets',
        colorByPoint: true,
        data: [
          { name: 'Confirmed', y: 59 },
          { name: 'Booked', y: 10 },
          { name: 'Process', y: 5 },
          { name: 'In Process', y: 5 },
          { name: 'Canceled', y: 3 },
          { name: 'Reject', y: 8 },
          { name: 'Void', y: 2 },
        ],
      } as Highcharts.SeriesPieOptions,
    ],
  };
}
