import { Component, inject, Input, ViewChild, SimpleChange } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { FlexLayoutModule } from "@angular/flex-layout";
import { ChartService, DEFAULT_HISTORY_DATA } from './services/fintachart.service';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexAxisChartSeries,
  ApexChart,
} from "ng-apexcharts";
import { AsyncPipe } from '@angular/common';
import ApexCharts from 'apexcharts';
import { IHistoricalObject } from './interfaces';

@Component({
  selector: 'app-history-chart',
  standalone: true,
  imports: [ NgApexchartsModule, FlexLayoutModule, MatListModule, AsyncPipe],
  styles: [`
    #chart { width: 100%;  height: auto; min-height: 400px;};
    ::ng-deep .apexcharts-text { fill: ivory };
    ::ng-deep .apexcharts-tooltip-box, ::ng-deep .apexcharts-menu { color: black };
  `],
  template: `
  <fieldset fxLayout="row" primary>
    <legend>Historical chart for {{currentPair.symbol}}</legend>   
    <apx-chart [series]="series" [chart]="chart" [plotOptions]="plotOptions" #history_chart id="chart"></apx-chart>
  </fieldset>
  `,
})
export class HistoryChartComponent {
  @Input() currentPair: any;
  @ViewChild('history_chart') history_chart!: ApexCharts;

  chartService = inject(ChartService);

  chartData = DEFAULT_HISTORY_DATA.map((obj: IHistoricalObject) => {
    return {
      x: obj['t'].slice(0, 10),
      y: new Array(obj['o'], obj['h'], obj['l'], obj['c'])
    }
  });
  series: ApexAxisChartSeries = [
    {
      name: "Historical",
      data: this.chartData
    }
  ];
  chart: ApexChart = {
    type: "candlestick"
  };
  plotOptions: {
    candlestick: {
      colors: {
        upward: '#3C90EB',
        downward: '#DF7D46'
      }
    }
  };


  ngOnChanges(changes: SimpleChange) {    
    this.chartService.getBarsCount(this.currentPair.id).subscribe(bars => {
      this.chartData = bars.map((obj: IHistoricalObject) => {
        return {
          x: obj['t'].match(/([-\d\s]*)T/)[1],
          y: new Array(obj['o'], obj['h'], obj['l'], obj['c'])
        }
      });
      console.log('Data for chart (get count back request) ', this.chartData);
      if (this.history_chart) {
        this.history_chart.updateSeries([{
          name: 'Historical',
          data: this.chartData
        }]);
      }
    });
  }
}

  





