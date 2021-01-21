import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExploreContainer2Component } from './explore-container-2.component';
import { BarChartStyle1ComponentModule } from '../../bar-chart-style-1/bar-chart-style-1.module';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, BarChartStyle1ComponentModule],
  declarations: [ExploreContainer2Component],
  exports: [ExploreContainer2Component]
})
export class ExploreContainer2ComponentModule {}
