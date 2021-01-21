import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SomethingSomethingGreatPageRoutingModule } from './something-something-great-page-routing.module';
import { ExploreContainerComponentModule } from './explore-container/explore-container.module';
import { ExploreContainer2ComponentModule } from './explore-container-2/explore-container-2.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    ExploreContainer2ComponentModule,
    SomethingSomethingGreatPageRoutingModule,
  ],
})
export class SomethingSomethingGreatPageModule {}
