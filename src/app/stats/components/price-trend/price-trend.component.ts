import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonFuelType } from '../../../shared/model/CommonFuelType';
import { PriceStatType } from '../../../shared/model/PriceStatType';
import { PriceService } from '../../service/price.service';
import { catchError, debounceTime, finalize, tap } from 'rxjs/operators';
import { FormBuilder, FormControl } from '@angular/forms';
import { ISelectInputData } from '../../../shared/component/select-input/select-input.component';
import { Chart, ChartDataset, ChartOptions, registerables } from 'chart.js';
import { IDatePrice } from '../../model/IDatePrice';
import { truncateDouble } from '../../../utils/price-utils';
import { ModalService } from '../../../../../../gas-angular-ui/dist/g-ui';
import { fromEvent, Subscription, throwError } from 'rxjs';
import 'chartjs-adapter-date-fns';
import { it } from 'date-fns/locale';

Chart.register(...registerables);
const CHART_OPTIONS: ChartOptions = {
  responsive: true,
  elements: {
    line: {
      tension: 0.3
    }
  },
  maintainAspectRatio: false,
  normalized: true,
  indexAxis: 'x',
  scales: {
    yAxis: {
      axis: 'y',
      title: {
        text: 'Prezzo',
        display: true,
      }
    },
    x: {
      // offset: true
      type: 'time',
      adapters: {
        date: {
          locale: it
        }
      },
      time: {
        unit: 'day',
        displayFormats: {minute: 'dd/MM/yyyy'},
        tooltipFormat: 'dd/MM/yyyy'
      },
      ticks: {
        minRotation: 15,
        maxRotation: 15,
      }
    }
  },
  plugins: {
    legend: {
      labels: {
        boxHeight: 0,
        boxWidth: 0
      }
    }
  }
};

@Component({
  selector: 'app-price-trend',
  templateUrl: './price-trend.component.html',
  styleUrls: ['./price-trend.component.scss']
})
export class PriceTrendComponent implements OnInit, AfterViewInit, OnDestroy {

  fuelOptions: ISelectInputData<string>[] = Object.values(CommonFuelType).map(v => ({
    label: v,
    value: CommonFuelType[v]
  }));

  priceStatOptions: ISelectInputData<string>[] = Object.values(PriceStatType).map(v => ({
    label: v === 'AVG' ? 'MEDIO' : v,
    value: PriceStatType[v]
  }));

  filterForm = this.fb.group({
    fuelType: [CommonFuelType.GASOLIO],
    statType: [PriceStatType.AVG],
  });
  @ViewChild('chart') chartRef: ElementRef;
  chart: Chart;
  chartOptions = CHART_OPTIONS;
  chartData: IDatePrice[] = [];
  loading = false;
  resizeSub: Subscription;

  constructor(
    private service: PriceService,
    private fb: FormBuilder,
    private modalService: ModalService
  ) {
  }

  ngOnInit(): void {
    this.getPriceTrend(this.fuelType.value, this.statType.value);
    this.filterForm.valueChanges.pipe(
      tap(v => this.getPriceTrend(v.fuelType, v.statType))
    ).subscribe();
    this.resizeSub = fromEvent(window, 'resize').pipe(
      debounceTime(1000),
      tap(() => console.log('resize')),
      tap(() => {
        if (this.chart) {
          this.updateChartGradient();
        }
      })
    ).subscribe();
  }

  ngAfterViewInit(): void {
    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'line',
      data: undefined,
      options: this.chartOptions
    });
    this.updateChart();
  }

  updateChart(): void {
    if (!this.chart) {
      return;
    }
    const datasets: ChartDataset[] = [{
      label: `PREZZO ${this.statType.value === 'AVG' ? 'MEDIO' : this.statType.value} ${this.fuelType.value}`,
      data: this.chartData.map(d => d.price),
      borderColor: '#ffd54f',
      type: 'line',
      fill: true,
      backgroundColor: this.chartGradient
    }];
    const labels = this.chartData.map(d => d.date);
    this.chart.data = {
      labels,
      datasets
    };
    this.chart.update();
  }

  getPriceTrend(fuel: CommonFuelType, statType: PriceStatType): void {
    this.loading = true;
    this.service.getPriceTrend(fuel, statType).pipe(
      tap(v => {
        this.chartData = v.map(a => ({
          ...a,
          price: truncateDouble(a.price)
        }));
        this.updateChart();
      }),
      finalize(() => this.loading = false),
      catchError(err => {
        this.loading = false;
        this.modalService.handleError(err.error);
        return throwError(err);
      })
    ).subscribe();
  }

  get chartGradient(): CanvasGradient {
    const height = this.chartRef?.nativeElement?.offsetHeight;
    const gradient = this.chart?.ctx.createLinearGradient(0, height, 0, 0);
    gradient.addColorStop(0, '#43a047');
    gradient.addColorStop(1, '#d0021b');
    return gradient;
  }

  get fuelType(): FormControl {
    return this.filterForm.get('fuelType') as FormControl;
  }

  get statType(): FormControl {
    return this.filterForm.get('statType') as FormControl;
  }

  ngOnDestroy(): void {
    this.resizeSub.unsubscribe();
  }

  updateChartGradient(): void {
    this.chart.data = {
      ...this.chart.data,
      datasets: this.chart.data.datasets?.map(d => ({
        ...d,
        backgroundColor: this.chartGradient
      }))
    };
    this.chart.update();
  }
}
