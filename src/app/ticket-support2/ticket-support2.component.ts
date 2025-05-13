import { Component } from '@angular/core';
import { DataService } from '../data.service';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-ticket-support2',
  templateUrl: './ticket-support2.component.html',
  styleUrls: ['./ticket-support2.component.css'],
})
export class TicketSupport2Component {
  data: any[] = [];
  statusSummary: { status: string; count: number }[] = [];
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};

  statusColors: { [key: string]: string } = {
    CONFIRMED: '#28a745',
    PROCESS: '#17a2b8',
    BOOKED: '#007bff',
    'TICKET IN PROCESS': '#6f42c1',
    REJECT: '#fd7e14',
    CANCELED: '#dc3545',
    VOID: '#6c757d',
  };

  constructor(private dataService: DataService) {
    this.dataService.getJsonData().subscribe((response: any) => {
      this.data = response;
      console.log(this.data);
      this.prepareSummaryAndChart();
    });
  }

  prepareSummaryAndChart() {
    const statusCountMap: { [status: string]: number } = {};

    this.data.forEach((item) => {
      const status = (item.status || 'Unknown').toUpperCase();
      statusCountMap[status] = (statusCountMap[status] || 0) + 1;
    });

    this.statusSummary = Object.entries(statusCountMap)
      .map(([status, count]) => ({ status, count }))
      .sort((a, b) => b.count - a.count);

    const chartData = this.statusSummary.map((item) => ({
      name: item.status,
      y: item.count,
      color: this.statusColors[item.status] || '#999999',
    }));

    this.chartOptions = {
      chart: {
        type: 'pie',
      },
      title: {
        text: 'Ticket Status Distribution',
      },
      tooltip: {
        pointFormat:
          '<b>{point.name}</b>: {point.y} tickets ({point.percentage:.1f}%)',
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
            format: '<b>{point.name}</b>: {point.y} ({point.percentage:.1f}%)',
            connectorColor: 'silver',
          },
          showInLegend: true,
        },
      },
      series: [
        {
          name: 'Tickets',
          colorByPoint: false, // use the manual color set above
          data: chartData,
        },
      ] as Highcharts.SeriesOptionsType[],
    };
  }
}
