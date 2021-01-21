import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BarChartStyle1Component } from './bar-chart-style-1.component';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule],
  declarations: [BarChartStyle1Component],
  exports: [BarChartStyle1Component]
})
export class BarChartStyle1ComponentModule {}
