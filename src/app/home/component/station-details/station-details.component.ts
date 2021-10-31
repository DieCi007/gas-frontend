import { Component, Input, EventEmitter, OnInit, Output } from '@angular/core';
import { StationService } from '../../service/station.service';
import { combineLatest, Observable, throwError } from 'rxjs';
import { IStationData } from '../../model/IStationData';
import { IStationPrice } from '../../model/IStationPrice';
import { catchError, tap } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { IStationLocation } from '../../model/IStationLocation';
import { ModalService } from 'g-ui';

@Component({
  selector: 'app-station-details',
  templateUrl: './station-details.component.html',
  styleUrls: ['./station-details.component.scss']
})
export class StationDetailsComponent implements OnInit {
  private _station;

  get station(): IStationLocation {
    return this._station;
  }

  @Input() set station(value: IStationLocation) {
    this._station = value;
    if (value) {
      this.buildObservable(value.id);
    }
  }

  @Output() closeRequested = new EventEmitter<void>();
  stationDetails$: Observable<[IStationData, IStationPrice[]]>;
  form: FormGroup;
  prices: IStationPrice[];

  constructor(
    private service: StationService,
    private fb: FormBuilder,
    private readonly modalService: ModalService
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
        this.modalService.handleError(err.error);
        this.closeRequested.emit();
        return throwError(err);
      }));
  }

  private buildForm(details: IStationData): void {
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

  onDirectionsClick(): void {
    let redirect;
    if (this.service.lastKnownLocation) {
      redirect = `https://www.google.com/maps/dir/?api=1&origin=
      ${this.service.lastKnownLocation.lat},${this.service.lastKnownLocation.lon}&destination=${this.station.latitude},${this.station.longitude}`;
    } else {
      redirect = `https://www.google.com/maps/search/?api=1&query=${this.station.latitude},${this.station.longitude}`;
    }
    location.href = redirect;
  }

  onClose(): void {
    this.closeRequested.emit();
  }
}
