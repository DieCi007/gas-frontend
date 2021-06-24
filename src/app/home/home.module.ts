import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeMainComponent } from './page/home-main/home-main.component';
import { HomeMapComponent } from './page/home-map/home-map.component';
import { RouterModule } from '@angular/router';
import { HomeRoutingModule } from './home-routing.module';
import { SunsetComponent } from './component/sunset/sunset.component';
import { DialogComponent } from './component/dialog/dialog.component';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { StationDetailsComponent } from './component/station-details/station-details.component';
import { InputFieldComponent } from './component/input-field/input-field.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SpinnerComponent } from './component/spinner/spinner.component';
import { ErrorDialogComponent } from './component/error-dialog/error-dialog.component';

@NgModule({
  declarations: [
    HomeMainComponent, HomeMapComponent,
    SunsetComponent, DialogComponent,
    StationDetailsComponent, InputFieldComponent,
    SpinnerComponent,
    ErrorDialogComponent],
  imports: [
    CommonModule,
    RouterModule,
    HomeRoutingModule,
    DialogModule,
    RippleModule,
    ReactiveFormsModule
  ]
})
export class HomeModule {
}
