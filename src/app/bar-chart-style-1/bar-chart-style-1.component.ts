import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { toParamify } from '../../utils/paramify.util';

let internalUniqueNumber = 0;
function getUniqueNumber() {
  return ++internalUniqueNumber;
}

export type ChartXAxisFormatter = (value: number) => string;
export type ChartYAxisFormatter = (value: number) => string;

export class ChartData {
  public xAxisData: number;
  public xAxisFormat = '$x';

  public yAxisData: number;

  public imageUrl: string;

  private readonly uniqueNumber = getUniqueNumber();

  public xAxisFormatter: ChartXAxisFormatter = () => {
    return this.xAxisFormat.replace('$x', this.xAxisData + '');
  }

  public valueOf() {
    return this.uniqueNumber;
  }
}

class EmptyChartData extends ChartData {
  public yAxisData = 0;
  public xAxisFormatter = () => '';
}

@Component({
  selector: 'app-bar-chart-style-1',
  templateUrl: './bar-chart-style-1.component.html',
  styleUrls: ['./bar-chart-style-1.component.scss'],
})
export class BarChartStyle1Component {
  private data: ChartData[];

  private rootPositionData: DOMRect;

  private surface: d3.Selection<any, any, any, any>;

  private xAxisScaleData: d3.ScaleBand<ChartData>;
  private yAxisScaleData: d3.ScaleLinear<number, any>;

  private xAxisPositionData: DOMRect;
  private yAxisPositionData: DOMRect;
  private yAxisLinePositionData: DOMRect;
  private yAxisTextOriginalPositionData: DOMRect;

  private barListTransformAttributes: string;

  private readonly CONFIGURATION_YAXIS_POSITION_TOP_MARGIN = 55;
  private readonly CONFIGURATION_YAXIS_POSITION_BOTTOM_MARGIN = -10;
  private readonly CONFIGURATION_XAXIS_POSITION_TOP_MARGIN = 0;


  @Input() maxItemCount = -1;
  @Input() startFromLeft = true;

  private root: HTMLDivElement;
  // eslint-disable-next-line accessor-pairs
  @ViewChild('surface1', { static: false }) set setSurface(surface: ElementRef<HTMLDivElement>) {
    if (surface != null && surface.nativeElement != null) {
      this.root = surface.nativeElement;
    }
    this.update();
  }

  @Input()
  public barData(data: ChartData[]) {
    this.data = (() => {
      const original = Array.from(data);
      const generated = Array.from({ length: this.maxItemCount - original.length }, () => new EmptyChartData());
      if (this.startFromLeft && this.maxItemCount > -1 && original.length < this.maxItemCount) {
        return Array.of(...original, ...generated);
      }
      if (!this.startFromLeft && this.maxItemCount > -1 && original.length < this.maxItemCount) {
        return Array.of(...generated, ...original);
      }
      return original;
    })();
  }

  @Input() yAxisFormatter: ChartYAxisFormatter = (v) => v + '';

  constructor() { }

  ngOnInit() {
    console.log('init')
  }

  ngOnDestroy() {
    console.log('destroy')
  }

  public draw() {
    if (this.data == null || this.data.length === 0) { return; }

    const rootView = this.root != null ? d3.select(this.root) : undefined;

    if (rootView == null || rootView.node() == null) { return; }

    try {
      let rootViewSize: DOMRect;
      if (rootView.node() instanceof SVGGraphicsElement) {
        rootViewSize = (rootView.node() as unknown as SVGGraphicsElement).getBBox();
      } else if (rootView.node() instanceof Element) {
        rootViewSize = (rootView.node() as Element).getBoundingClientRect();
      } else {
        return;
      }

      if (rootViewSize != null) {
        this.rootPositionData = rootViewSize;
      } else {
        return;
      }
    } catch (e) {
      console.log(e);
      return;
    }

    this.surface = rootView.append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${this.rootPositionData.width} ${this.rootPositionData.height}`)
      .attr('preserveAspectRatio', 'xMinYMin');

    this.buildYAxis();
    this.buildXAxis();
    this.reduceYAxis();
    this.buildBars();
  }

  public update(data?: ChartData[]) {
    if (data != null) {
      this.barData(data);
    }
    if (this.surface != null) {
      this.surface.remove();
    }
    setTimeout(() => this.draw(), 0);
  }

  private buildXAxis(maxWidth?: number) {
    const width = (maxWidth ?? this.rootPositionData.width);
    this.xAxisScaleData = d3.scaleBand(this.data, [0, width]);

    const xAxisInstance = this.surface.append('g')
      .attr('class', 'xAxisIndicator');

    const xAxisScaleInstance = d3.axisBottom(this.xAxisScaleData).tickFormat(v => v.xAxisFormatter(v.xAxisData));

    xAxisInstance.call(xAxisScaleInstance);
    xAxisInstance.select('path').remove();
    xAxisInstance.selectAll('g').each((_, index, array) => {
      const item = d3.select(array[index]);
      item.select('line').remove();
      item.select('text').attr('y', 0).attr('dy', 0);
    });

    const xAxisOriginalPositionData = (xAxisInstance.node() as SVGGraphicsElement).getBBox();

    console.log(xAxisOriginalPositionData);

    const actualPositionXMargin = this.yAxisTextOriginalPositionData?.width ?? 0;
    const startPositionY = this.rootPositionData.height;
    const actualPositionWidthScale = (width - actualPositionXMargin) / width;
    const actualPositionHeightScale = 1;

    this.xAxisPositionData = new DOMRect(
      (this.rootPositionData.width - actualPositionWidthScale * xAxisOriginalPositionData.width) / 2,
      (this.rootPositionData.height - actualPositionHeightScale * xAxisOriginalPositionData.height) / 2,
      actualPositionWidthScale * xAxisOriginalPositionData.width,
      actualPositionHeightScale * xAxisOriginalPositionData.height,
    );

    const transformAttributes = toParamify({
      translate: `${actualPositionXMargin} ${startPositionY + this.CONFIGURATION_XAXIS_POSITION_TOP_MARGIN}`,
      scale: `${actualPositionWidthScale} ${actualPositionHeightScale}`,
    });

    xAxisInstance.attr('transform', transformAttributes);
  }

  private buildYAxis(maxHeight?: number) {
    const height = (maxHeight ?? this.rootPositionData.height);

    this.yAxisScaleData = d3.scaleLinear([0, 1000], [
      height - (this.xAxisPositionData?.height ?? 0) -
      this.CONFIGURATION_YAXIS_POSITION_BOTTOM_MARGIN -
      this.CONFIGURATION_YAXIS_POSITION_TOP_MARGIN, 0
    ]);

    const yAxisInstance = this.surface.append('g')
      .attr('class', 'yAxisIndicator');

    const yAxisScaleInstance = d3.axisLeft(this.yAxisScaleData).tickFormat(v => this.yAxisFormatter(v.valueOf())).ticks(5);

    yAxisInstance.call(yAxisScaleInstance);
    yAxisInstance.select('path').remove();

    this.yAxisTextOriginalPositionData = (yAxisInstance.node() as SVGGraphicsElement).getBBox();

    const textInstances: d3.Selection<any, any, any, any>[] = [];

    yAxisInstance.selectAll('g').each((_, index, array: SVGGElement[]) => {
      const item = d3.select<SVGGElement, any>(array[index]);
      const textInstance = item.select<SVGTextElement>('text');

      textInstances.push(textInstance);
      item.node().removeChild(textInstance.node());
      item.select('line').remove();

      item.append('line')
        .attr('x1', 0)
        .attr('x2', Math.floor(this.rootPositionData.width - this.yAxisTextOriginalPositionData.width))
        .attr('y1', 0)
        .attr('y2', 0)
        .attr('stroke-width', 1);
    });

    this.yAxisLinePositionData = (yAxisInstance.node() as SVGGraphicsElement).getBBox();

    yAxisInstance.selectAll('g').each((_, index, array: SVGGElement[]) => {
      const item = d3.select<SVGGElement, any>(array[index]);
      item.node().appendChild(textInstances[index].node());
    });

    yAxisInstance.selectAll('g').each((_, index, array) => {
      d3.select(array[index]).select('text').attr('x', -10).attr('dy', 0);
    });

    const yAxisOriginalPositionData = (yAxisInstance.node() as SVGGraphicsElement).getBBox();
    const actualPositionXMargin = this.yAxisTextOriginalPositionData?.width ?? 0;
    const actualPositionYMargin = this.CONFIGURATION_YAXIS_POSITION_TOP_MARGIN;
    const actualPositionWidthScale = 1;
    const actualPositionHeightScale = 1;

    this.yAxisPositionData = new DOMRect(
      (this.rootPositionData.width - actualPositionWidthScale * yAxisOriginalPositionData.width) / 2,
      (this.rootPositionData.height - actualPositionHeightScale * yAxisOriginalPositionData.height) / 2,
      actualPositionWidthScale * yAxisOriginalPositionData.width,
      actualPositionWidthScale * yAxisOriginalPositionData.height
    );

    const transformAttributes = toParamify({
      translate: `${actualPositionXMargin} ${actualPositionYMargin}`,
      scale: `${actualPositionWidthScale} ${actualPositionHeightScale}`,
    });

    yAxisInstance.attr('transform', transformAttributes);

    this.yAxisLinePositionData.width = this.yAxisLinePositionData.width - actualPositionXMargin;
    this.yAxisLinePositionData.x = actualPositionXMargin;

    this.yAxisPositionData.y = actualPositionYMargin;

    console.log(this.yAxisLinePositionData);
  }

  private reduceYAxis() {
    const yAxisInstance = this.surface.select('.yAxisIndicator');
    yAxisInstance.remove();
    this.buildYAxis(this.rootPositionData.height - this.xAxisPositionData.height);
  }

  private buildBars() {
    const barListInstance = this.surface.append('g')
      .attr('class', 'bars');

    barListInstance.selectAll()
      .data(this.data)
      .enter()
      .append('svg');

    barListInstance.selectAll('svg').each((_, index, array) => {
      const item = d3.select(array[index]).attr('class', 'barItem' + index);
      this.buildSingleBar(
        item,
        index,
        this.yAxisLinePositionData.width + this.yAxisLinePositionData.x,
        this.yAxisLinePositionData.height + this.yAxisLinePositionData.y,
      );
    });

    const instancePositionData = (barListInstance.node() as SVGGraphicsElement).getBBox();

    this.barListTransformAttributes = toParamify({
      translate: [
        this.yAxisLinePositionData.x + ((this.yAxisLinePositionData.width + this.yAxisLinePositionData.x) - instancePositionData.width) / 2,
        this.yAxisPositionData.y + this.yAxisLinePositionData.y,
      ].join(' '),
    });

    barListInstance.attr('transform', this.barListTransformAttributes);
  }

  private buildSingleBar(
    element: d3.Selection<any, any, any, any>,
    index: number,
    maxWidth: number,
    maxHeight: number,
  ) {
    const itemValue = this.data[index].yAxisData;
    const itemApplicableMaxWidth = maxWidth / this.data.length;
    const itemWidth = itemApplicableMaxWidth / 2;
    const itemWidthStart = itemApplicableMaxWidth * (index);
    const itemHeight = maxHeight * (itemValue / this.yAxisScaleData.domain()[1]);
    const itemHeightStart = maxHeight - itemHeight;

    const itemSymbolInstance = element.append('symbol');
    itemSymbolInstance.attr('id', 'barItem' + index);
    itemSymbolInstance.attr('viewBox', `0 0 ${itemWidth} ${itemHeight}`);

    itemSymbolInstance.append('path').attr('d', [
      `M 0 ${itemHeight}`, // Head to left-bottom
      'V 0', // Head to left-top
      `H ${itemWidth}`, // Head to right-top
      `V ${itemHeight}`, // Head to right-bottom
      `H ${itemWidth}` // Back to left-bottom
    ].join(' '));

    const itemUseInstance = element.append('use');
    itemUseInstance.attr('xlink:href', '#barItem' + index);
    itemUseInstance.attr('x', itemWidthStart);
    itemUseInstance.attr('y', itemHeightStart);
    itemUseInstance.attr('width', itemWidth);
    itemUseInstance.attr('height', itemHeight);
  }
}
