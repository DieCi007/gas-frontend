import { Component, Input, OnInit } from '@angular/core';
import { StationService } from '../../service/station.service';
import { combineLatest, Observable } from 'rxjs';
import { StationData } from '../../model/station-data';
import { StationPrice } from '../../model/station-price';
import { tap } from 'rxjs/operators';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

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

  stationDetails$: Observable<[StationData, StationPrice[]]>;
  form: FormGroup;

  constructor(
    private service: StationService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
  }

  private buildObservable(value: number): void {
    const data$ = this.service.getStationById(value);
    const price$ = this.service.getStationPrice(value);
    this.stationDetails$ = combineLatest([data$, price$]).pipe(
      tap(([details, prices]) => this.buildForm(details, prices))
    );
  }

  private buildForm(details: StationData, prices: StationPrice[]): void {
    this.form = this.fb.group({
      owner: [details.owner],
      flag: [details.flag],
      type: [details.type],
      name: [details.name],
      address: [details.address],
      municipality: [details.municipality],
      province: [details.province],
      prices: this.fb.array(prices.map(p => this.fb.group({
        price: [p.price],
        isSelf: [p.isSelf ? 'Si' : 'No', [Validators.required]],
        readDate: [p.readDate],
        description: [p.description],
      })))
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

  get prices(): FormArray {
    return this.form.get('prices') as FormArray;
  }

  get priceGroups(): FormGroup[] {
    return this.prices.controls as FormGroup[];
  }
}
