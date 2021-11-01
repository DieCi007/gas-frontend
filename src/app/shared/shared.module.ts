import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './component/header/header.component';
import { RouterModule } from '@angular/router';
import { ModalModule } from 'g-ui';
import { SelectInputComponent } from './component/select-input/select-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CalendarComponent } from './component/calendar/calendar.component';
import { CalendarModule } from 'primeng/calendar';
import { FabComponent } from './component/fab/fab.component';
import { CheckboxComponent } from './component/checkbox/checkbox.component';


@NgModule({
  declarations: [HeaderComponent, SelectInputComponent, CalendarComponent, FabComponent, CheckboxComponent],
    exports: [
        HeaderComponent,
        SelectInputComponent,
        CalendarComponent,
        FabComponent,
        CheckboxComponent,
    ],
  imports: [
    CommonModule,
    RouterModule,
    ModalModule,
    ReactiveFormsModule,
    CalendarModule
  ]
})
export class SharedModule {
}
