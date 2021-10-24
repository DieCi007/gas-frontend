import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BreakpointService } from 'g-ui';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnDestroy {

  @Input() form: FormGroup;
  @Input() controlName: string;
  @Input() label: string;
  isMobile = false;
  bpSubscription: Subscription;

  constructor(
    private bp: BreakpointService
  ) {
  }

  ngOnInit(): void {
    this.bpSubscription = this.bp.mobile().pipe(
      tap(r => this.isMobile = r.matches)
    ).subscribe();
  }

  get control(): FormControl {
    return this.form?.get(this.controlName) as FormControl;
  }

  ngOnDestroy(): void {
    this.bpSubscription.unsubscribe();
  }
}
