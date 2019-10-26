import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

LineChart: any = [];

  constructor() { }

  ngOnInit() {
     this.LineChart = new Chart('lineChart', {
       type: 'line',
       data: {
         labels: ["Jan","Feb", "March","April","May","June","July","August","September","October","November","December"],
         datasets: [{
           label: 'numberof items sold',
           data: [9,7,3,5,15,11,20,22,6,18,21,14],
           fill: false,
           lineTension: 0.2,
           borderColor: "black",
           borderWidth: 1
         }]
       },
       options:{
         title: {
           text: "Line Chart",
           display: true
         },
         scales: {
           yAxes: [{
             ticks: {
               beginAtZero: true
             }
           }]
         }
       }
     });
  }

  onChartClick(event) {
    console.log(event);
  }

}

export class Data {
  PlayerName: string;
  Run: string;
}
