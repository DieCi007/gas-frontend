import { Component, OnInit } from '@angular/core';
import { MunicipalityService } from '../../service/municipality.service';
import { ProvinceService } from '../../service/province.service';
import { combineLatest, throwError } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { ModalService } from '../../../../../../gas-angular-ui/dist/g-ui';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ISelectInputData, selectInputRequired } from '../../../shared/component/select-input/select-input.component';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {

  loading = false;
  provinceData: ISelectInputData<string>[];
  municipalityData: ISelectInputData<string>[];
  filterForm = this.fb.group({
    province: [null],
    municipality: [null],
    date: [new Date()],
  });

  constructor(
    private municipalityService: MunicipalityService,
    private provinceService: ProvinceService,
    private modalService: ModalService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.loadFilters();
    this.filterForm.valueChanges.pipe().subscribe(console.log);
  }

  loadFilters(): void {
    this.loading = true;
    const municipality$ = this.municipalityService.getAllMunicipalities().pipe(
      map(res => res.map(r => ({
        label: r,
        value: r
      }))),
      tap(res => this.municipalityData = res)
    );
    const province = this.provinceService.getAllProvinces().pipe(
      map(res => res.map(r => ({
        label: r,
        value: r
      }))),
      tap(res => this.provinceData = res)
    );
    combineLatest([municipality$, province]).pipe(
      catchError(err => {
        this.loading = false;
        this.modalService.handleError(err.error);
        return throwError(err);
      }),
      finalize(() => this.loading = false)
    ).subscribe();
  }
}


