import { Component, Input, EventEmitter, OnInit, Output } from '@angular/core';
import { StationService } from '../../service/station.service';
import { combineLatest, Observable, throwError } from 'rxjs';
import { StationData } from '../../model/station-data';
import { StationPrice } from '../../model/station-price';
import { catchError, tap } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DialogService } from '../../../shared/service/dialog.service';

@Component({
  selector: 'app-station-details',
  templateUrl: './station-details.component.html',
  styleUrls: ['./station-details.component.scss']
})
export class StationDetailsComponent implements OnInit {
  private _stationId;

  get stationId(): number {
    return this._stationId;
  }

  @Input() set stationId(value) {
    this._stationId = value;
    if (value) {
      this.buildObservable(value);
    }
  }

  @Output() closeRequested = new EventEmitter<void>();
  stationDetails$: Observable<[StationData, StationPrice[]]>;
  form: FormGroup;
  prices: StationPrice[];

  constructor(
    private service: StationService,
    private fb: FormBuilder,
    private readonly dialogService: DialogService
  ) {
  }

  ngOnInit(): void {
  }

  private buildObservable(value: number): void {
    const data$ = this.service.getStationById(value);
    const price$ = this.service.getStationPrice(value);
    this.stationDetails$ = combineLatest([data$, price$]).pipe(
      tap(([details, prices]) => {
        if (details && prices) {
          this.buildForm(details);
          this.prices = prices;
        }
      }),
      catchError(err => {
        this.dialogService.showErrorDialog();
        this.closeRequested.emit();
        return throwError(err);
      }));
  }

  private buildForm(details: StationData): void {
    this.form = this.fb.group({
      owner: [{value: details.owner, disabled: true}],
      flag: [{value: details.flag, disabled: true}],
      type: [{value: details.type, disabled: true}],
      name: [{value: details.name, disabled: true}],
      address: [{value: details.address, disabled: true}],
      municipality: [{value: details.municipality, disabled: true}],
      province: [{value: details.province, disabled: true}]
    });
  }

  get owner(): FormControl {
    return this.form.get('owner') as FormControl;
  }

  get flag(): FormControl {
    return this.form.get('flag') as FormControl;
  }

  get type(): FormControl {
    return this.form.get('type') as FormControl;
  }

  get name(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get address(): FormControl {
    return this.form.get('address') as FormControl;
  }

  get municipality(): FormControl {
    return this.form.get('municipality') as FormControl;
  }

  get province(): FormControl {
    return this.form.get('province') as FormControl;
  }

}
