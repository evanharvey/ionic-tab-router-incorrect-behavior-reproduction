import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tab2Page } from './tab2.page';

const routes: Routes = [
  {
    path: 'something-something',
    loadChildren: () => import('../something-something-great-page/something-something-great-page.module').then(m => m.SomethingSomethingGreatPageModule)
  },
  {
    path: '',
    component: Tab2Page,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tab2PageRoutingModule {}
