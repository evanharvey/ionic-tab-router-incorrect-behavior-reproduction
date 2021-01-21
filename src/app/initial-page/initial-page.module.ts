import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InitialPageComponent } from './initial-page.component';
import { InitialPageRoutingModule } from './initial-page-routing.module';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    InitialPageRoutingModule,
  ],
  declarations: [
    InitialPageComponent,
  ],
})
export class InitialPageModule {}
