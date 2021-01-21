import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { BarChartStyle1Component, ChartData } from '../../bar-chart-style-1/bar-chart-style-1.component';

@Component({
  selector: 'app-explore-container-2',
  templateUrl: './explore-container.component-2.html',
  styleUrls: ['./explore-container.component-2.scss'],
})
export class ExploreContainer2Component implements OnInit {
  private graph: BarChartStyle1Component;

  @ViewChild('graph', { read: BarChartStyle1Component, static: false }) set setGraph(content: BarChartStyle1Component) {
    if (content != null) {
      this.graph = content;
      setTimeout(() => {
        this.graph.update(this.data);
      }, 0);
    }
  }

  private data: ChartData[] = [
    {
      yAxisData: 100,
      xAxisData: 0,
    },
    {
      yAxisData: 300,
      xAxisData: 1,
    },
    {
      yAxisData: 250,
      xAxisData: 2,
    },
    {
      yAxisData: 500,
      xAxisData: 3,
    },
    {
      yAxisData: 1000,
      xAxisData: 4,
    },
    {
      yAxisData: 760,
      xAxisData: 5,
    },
    {
      yAxisData: 400,
      xAxisData: 6,
    },
  ].map((value: ChartData) => Object.assign(new ChartData(), {
    ...value,
    xAxisFormatter: (xAxisValue) => xAxisValue,
  }, true, true));

  constructor() { }

  ngOnInit() {}

}
