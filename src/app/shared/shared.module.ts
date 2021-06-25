import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './component/header/header.component';
import { RouterModule } from '@angular/router';
import { ErrorDialogComponent } from './component/error-dialog/error-dialog.component';
import { DialogComponent } from './component/dialog/dialog.component';
import { ModalModule } from 'g-ui';


@NgModule({
  declarations: [HeaderComponent, ErrorDialogComponent, DialogComponent],
  exports: [
    HeaderComponent,
    DialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ModalModule
  ]
})
export class SharedModule {
}
