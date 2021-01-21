import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExploreContainer2Component } from './explore-container-2/explore-container-2.component';
import { ExploreContainerComponent } from './explore-container/explore-container.component';

const routes: Routes = [
  {
    path: 'explore-1',
    component: ExploreContainerComponent,
  },
  {
    path: 'explore-2',
    component: ExploreContainer2Component,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SomethingSomethingGreatPageRoutingModule {}
