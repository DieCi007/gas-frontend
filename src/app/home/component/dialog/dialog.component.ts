import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  @Input() visible: boolean;
  @Output() visibleChange = new EventEmitter<boolean>();

  ngOnInit(): void {
  }

}
