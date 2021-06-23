import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {
  @Input() borderRadius = '20px';
  @Input() height;
  @Input() width;
  @Input() resizable = false;
  @Input() visible: boolean;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() draggable: boolean;
  @Input() position: 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}
