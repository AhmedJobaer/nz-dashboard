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
  airlineBarChartOptions: Highcharts.Options = {};
  top5AirlinesChartOptions: Highcharts.Options = {};
  routeBarChartOptions: Highcharts.Options = {};
  routeDonutChartOptions: Highcharts.Options = {};
  top5RouteBarChartOptions: Highcharts.Options = {};
  top5RouteDonutChartOptions: Highcharts.Options = {};

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
      this.prepareSummaryAndPieChart();
      this.prepareAirlineBarChart();
      this.prepareTop5AirlinesChart(); // ✅ new chart
      this.prepareRouteCharts();
      this.prepareTop5RouteCharts();
    });
  }

  prepareSummaryAndPieChart() {
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
          colorByPoint: false,
          data: chartData,
        },
      ] as Highcharts.SeriesOptionsType[],
    };
  }

  prepareAirlineBarChart() {
    // Filter confirmed tickets
    const confirmedTickets = this.data.filter(
      (item) => item.status && item.status.toUpperCase() === 'CONFIRMED'
    );

    // Count by plating_carrier
    const carrierCountMap: { [carrier: string]: number } = {};
    confirmedTickets.forEach((item) => {
      const carrier = item.plating_carrier || 'UNKNOWN';
      carrierCountMap[carrier] = (carrierCountMap[carrier] || 0) + 1;
    });

    const categories = Object.keys(carrierCountMap);
    const counts = Object.values(carrierCountMap);

    this.airlineBarChartOptions = {
      chart: {
        type: 'bar',
      },
      title: {
        text: 'Confirmed Tickets by Airline Code',
      },
      xAxis: {
        categories: categories,
        title: {
          text: 'Plating Carrier',
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Ticket Count',
          align: 'high',
        },
        labels: {
          overflow: 'justify',
        },
      },
      tooltip: {
        valueSuffix: ' tickets',
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true,
          },
        },
      },
      series: [
        {
          name: 'Confirmed Tickets',
          type: 'bar',
          data: counts,
        },
      ],
    };
  }

  prepareTop5AirlinesChart() {
    const confirmedData = this.data.filter(
      (item) => (item.status || '').toUpperCase() === 'CONFIRMED'
    );

    const airlineCounts: { [airline: string]: number } = {};
    confirmedData.forEach((item) => {
      const airline = item.plating_carrier || 'Unknown';
      airlineCounts[airline] = (airlineCounts[airline] || 0) + 1;
    });

    const sortedAirlines = Object.entries(airlineCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    this.top5AirlinesChartOptions = {
      chart: {
        type: 'column',
      },
      title: {
        text: 'Top 5 Airlines with Confirmed Tickets',
      },
      xAxis: {
        categories: ['Confirmed Tickets'],
        title: {
          text: null,
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Ticket Count',
        },
      },
      tooltip: {
        pointFormat: '<b>{series.name}</b>: {point.y} tickets',
      },
      plotOptions: {
        column: {
          dataLabels: {
            enabled: true,
          },
          grouping: true,
        },
      },
      legend: {
        enabled: true,
        title: {
          text: '',
        },
      },
      series: sortedAirlines.map(([airline, count], index) => ({
        name: airline,
        type: 'column',
        data: [count],
        color: Highcharts.getOptions().colors?.[index % 10] || '#888',
      })),
    };
  }
  prepareRouteCharts() {
    const routeCounts: { [route: string]: number } = {};

    this.data.forEach((item) => {
      const route = item.routes || 'Unknown';
      routeCounts[route] = (routeCounts[route] || 0) + 1;
    });

    const sortedRoutes = Object.entries(routeCounts).sort(
      (a, b) => b[1] - a[1]
    );

    const barCategories = sortedRoutes.map(([route]) => route);
    const barData = sortedRoutes.map(([, count]) => count);
    const donutData = sortedRoutes.map(([route, count]) => ({
      name: route,
      y: count,
    }));

    // Horizontal Bar Chart
    this.routeBarChartOptions = {
      chart: {
        type: 'bar',
      },
      title: {
        text: 'All Routes - Horizontal Bar Chart',
      },
      xAxis: {
        categories: barCategories,
        title: {
          text: 'Routes',
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Ticket Count',
        },
      },
      tooltip: {
        valueSuffix: ' tickets',
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true,
          },
        },
      },
      series: [
        {
          name: 'Tickets',
          type: 'bar',
          data: barData,
        },
      ],
    };

    // Donut Chart
    this.routeDonutChartOptions = {
      chart: {
        type: 'pie',
      },
      title: {
        text: 'All Routes - Donut Chart',
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.y}</b>',
      },
      accessibility: {
        point: {
          valueSuffix: '',
        },
      },
      plotOptions: {
        pie: {
          innerSize: '50%',
          dataLabels: {
            enabled: true,
            format: '{point.name}: {point.y}',
          },
        },
      },
      series: [
        {
          name: 'Tickets',
          type: 'pie',
          colorByPoint: true,
          data: donutData,
        } as Highcharts.SeriesPieOptions,
      ],
    };
  }

  prepareTop5RouteCharts() {
    const routeCounts: { [route: string]: number } = {};

    this.data.forEach((item) => {
      const route = item.routes || 'Unknown';
      routeCounts[route] = (routeCounts[route] || 0) + 1;
    });

    const top5Routes = Object.entries(routeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const barCategories = top5Routes.map(([route]) => route);
    const barData = top5Routes.map(([, count]) => count);
    const donutData = top5Routes.map(([route, count]) => ({
      name: route,
      y: count,
    }));

    this.top5RouteBarChartOptions = {
      chart: {
        type: 'bar',
      },
      title: {
        text: 'Top 5 Routes - Horizontal Bar Chart',
      },
      xAxis: {
        categories: barCategories,
        title: {
          text: 'Routes',
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Ticket Count',
        },
      },
      tooltip: {
        valueSuffix: ' tickets',
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true,
          },
        },
      },
      series: [
        {
          name: 'Tickets',
          type: 'bar',
          data: barData,
        },
      ],
    };

    this.top5RouteDonutChartOptions = {
      chart: {
        type: 'pie',
      },
      title: {
        text: 'Top 5 Routes - Donut Chart',
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.y}</b>',
      },
      accessibility: {
        point: {
          valueSuffix: '',
        },
      },
      plotOptions: {
        pie: {
          innerSize: '50%',
          dataLabels: {
            enabled: true,
            format: '{point.name}: {point.y}',
          },
        },
      },
      series: [
        {
          name: 'Tickets',
          type: 'pie',
          colorByPoint: true,
          data: donutData,
        } as Highcharts.SeriesPieOptions,
      ],
    };
  }
}
