import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'something-something',
    loadChildren: () => import('./something-something-great-page/something-something-great-page.module').then(m => m.SomethingSomethingGreatPageModule)
  },
  {
    path: 'initial',
    loadChildren: () => import('./initial-page/initial-page.module').then(m => m.InitialPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: '',
    redirectTo: 'initial',
    pathMatch: 'full'
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
