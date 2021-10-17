import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

export interface ISelectInputData<T> {
  label: string,
  value: T
}

@Component({
  selector: 'app-select-input',
  templateUrl: './select-input.component.html',
  styleUrls: ['./select-input.component.scss']
})
export class SelectInputComponent<T> implements OnInit {
  private _data: ISelectInputData<T>[];
  @Input() set data(newData: ISelectInputData<T>[]) {
    let data = [
      {
        label: '-',
        value: null
      },
    ];
    if (newData) {
      data = [...data, ...newData];
    }
    this._data = data;
  }

  get data(): ISelectInputData<T>[] {
    return this._data;
  }

  @Output() selected = new EventEmitter<T>();
  @Input() form: FormGroup;
  @Input() controlName: string;
  @Input() label: string;
  @Input() font: 'normal' | 'large' = 'large';
  @Input() requiredFieldMessage: string;
  @Input() width: string;

  constructor() {
  }

  ngOnInit(): void {
  }

  get control(): FormControl {
    return this.form?.get(this.controlName) as FormControl;
  }
}

export function selectInputRequired(control: AbstractControl): { [key: string]: boolean } | null {
  if (!control.value || control.value === 'null') {
    return {required: true};
  }
  return null;
}
