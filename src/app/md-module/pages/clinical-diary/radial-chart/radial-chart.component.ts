import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ChartComponent} from "ng-apexcharts";
import {
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexChart
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  plotOptions: ApexPlotOptions;
  colors:string[];
};

@Component({
  selector: 'app-radial-chart',
  templateUrl: './radial-chart.component.html',
  styleUrls: ['./radial-chart.component.scss']
})
export class RadialChartComponent implements OnInit {

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  @Input()
  public param:number;

  @Input()
  public nameChart:string;

  color:string="";
  format:string="";
  constructor() {

  }

  ngOnInit(): void {
    console.log(this.param)
    if(this.nameChart=="aderenza"){
      this.color="#7EC8E3";
      this.format="%"
    }
    else{
      if(this.param<=30)
        this.color= "#f44336";
      else if(this.param>30 && this.param<=60)
        this.color="#FFD700";
      else
        this.color= "#2C9200";
    }
    this.chartOptions = {
      series: [this.param],
      chart: {
        height: 270,
        type: "radialBar"
      },
      plotOptions: {
        radialBar: {
          hollow: {
            background:"transparent",
            size: "50%"

          },

          dataLabels: {
            name:{
              show:false
            },
            value: {
              color: "black",
              fontSize: "30px",
              show: true
            },
          }
        },
      },
      colors: [this.color],
      labels: [""],
    };

    if(this.nameChart=="rilevazioni"){
      this.chartOptions.plotOptions= {
        radialBar: {
          hollow: {
            background:"transparent",
            size: "50%"

          },
          dataLabels: {
            name:{
              show:false
            },
            value: {
              color: "black",
              fontSize: "30px",
              formatter(val: number): string {

                return val+""
              },
              show: true
            },
          }
        },
      }
    }

        }

}
