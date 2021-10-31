import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-fab',
  templateUrl: './fab.component.html',
  styleUrls: ['./fab.component.scss']
})
export class FabComponent implements OnInit {
  /**
   * any valid prime-ng icon name
   */
  @Input() icon: string;
  @Input() size = '3rem';
  @Input() iconSize = '1.3rem';
  @Input() color: 'primary' | 'secondary' | string = 'primary';
  @Input() raised = true;

  constructor() {
  }

  ngOnInit(): void {
  }

}
