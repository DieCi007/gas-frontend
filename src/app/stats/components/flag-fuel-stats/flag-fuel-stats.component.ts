import { Component, OnInit } from '@angular/core';
import { PriceService } from '../../service/price.service';
import { ModalService } from 'g-ui';
import { catchError, finalize, tap } from 'rxjs/operators';
import { IFlagFuelStatResponse } from '../../model/FlagFuelStatResponse';
import { throwError } from 'rxjs';
import { truncateDouble } from '../../../utils/price-utils';

@Component({
  selector: 'app-flag-fuel-stats',
  templateUrl: './flag-fuel-stats.component.html',
  styleUrls: ['./flag-fuel-stats.component.scss']
})
export class FlagFuelStatsComponent implements OnInit {
  loading = false;
  stats: IFlagFuelStatResponse[];

  constructor(
    private service: PriceService,
    private modalService: ModalService
  ) {
  }

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;
    this.service.getFlagPriceStat().pipe(
      tap(r => {
        this.stats = r.map(p => ({
          ...p,
          cheapestFlag: {
            ...p.cheapestFlag,
            price: truncateDouble(p.cheapestFlag?.price || 0)
          },
          mostExpensiveFlag: {
            ...p.mostExpensiveFlag,
            price: truncateDouble(p.mostExpensiveFlag?.price || 0)
          },
        }));
      }),
      finalize(() => this.loading = false),
      catchError(err => {
        this.loading = false;
        this.modalService.handleError(err.error);
        return throwError(err);
      })
    ).subscribe();
  }
}
