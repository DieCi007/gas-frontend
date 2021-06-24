import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.scss']
})
export class ErrorDialogComponent {
  @Input() visible: boolean;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() size = '4rem';

}
