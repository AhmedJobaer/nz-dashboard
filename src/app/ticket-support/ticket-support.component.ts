import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-ticket-support',
  templateUrl: './ticket-support.component.html',
  styleUrls: ['./ticket-support.component.css'],
})
export class TicketSupportComponent {
  Highcharts: typeof Highcharts = Highcharts;
  form: FormGroup;
  today: string;
  currencies = ['All', 'USD', 'EUR', 'MYR', 'JPY', 'GBP'];

  statusColors: { [key: string]: string } = {
    Confirmed: '#28a745', // green
    Booked: '#007bff', // blue
    Process: '#ffc107', // yellow
    'In Process': '#fd7e14', // orange
    Canceled: '#dc3545', // red
    Reject: '#6c757d', // gray
    Void: '#6610f2', // purple
  };

  data = {
    startDate: '2025-04-01',
    endDate: '2025-04-23',
    total: 92,
    statusSummary: [
      { status: 'Confirmed', count: 59 },
      { status: 'Booked', count: 10 },
      { status: 'Process', count: 5 },
      { status: 'In Process', count: 5 },
      { status: 'Canceled', count: 3 },
      { status: 'Reject', count: 8 },
      { status: 'Void', count: 2 },
    ],
  };

  constructor(private fb: FormBuilder) {
    this.today = new Date().toISOString().split('T')[0];

    this.form = this.fb.group({
      startDate: [this.today],
      endDate: [this.today],
      currency: ['All'],
    });
  }

  validateDateRange(start: string, end: string) {
    if (new Date(start) > new Date(end)) {
      console.warn('Start date is after end date!');
    }
  }

  ngOnInit(): void {
    this.form.valueChanges.subscribe((value) => {
      if (value.startDate && value.endDate) {
        this.validateDateRange(value.startDate, value.endDate);
        return;
      }
    });

    this.form.setValue({
      startDate: this.today,
      endDate: this.today,
      currency: 'All',
    });
  }

  onSearch() {
    console.log('Filters:', this.form.value);
    // implement your filter/search logic here
  }

  onReset() {
    const today = new Date().toISOString().split('T')[0];
    this.form.setValue({
      startDate: today,
      endDate: today,
      currency: 'All',
    });
  }

  setToday() {
    const today = new Date().toISOString().split('T')[0];
    this.form.patchValue({ startDate: today, endDate: today });
  }

  setYesterday() {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    const yesterday = date.toISOString().split('T')[0];
    this.form.patchValue({ startDate: yesterday, endDate: yesterday });
  }

  setThisWeek() {
    const now = new Date();
    const firstDay = new Date(now.setDate(now.getDate() - now.getDay())); // Sunday
    const lastDay = new Date();
    const start = firstDay.toISOString().split('T')[0];
    const end = lastDay.toISOString().split('T')[0];
    this.form.patchValue({ startDate: start, endDate: end });
  }

  setThisMonth() {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const today = new Date();

    const start = firstDay.toISOString().split('T')[0];
    const end = today.toISOString().split('T')[0];

    this.form.patchValue({ startDate: start, endDate: end });
  }

  chartOptions: Highcharts.Options = {
    chart: {
      type: 'pie',
      backgroundColor: '#ffffff',
      plotShadow: false,
    },
    title: {
      text: 'Ticket Status Distribution (Apr 1, Apr 23, 2025)',
    },
    subtitle: {
      text: 'Source: Ticket Support System',
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
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
        // custom colors are provided manually in the data array
        data: this.data.statusSummary.map((item) => ({
          name: item.status,
          y: item.count,
          color: this.statusColors[item.status] || '#999999',
        })),
      },
    ],
  };
}
