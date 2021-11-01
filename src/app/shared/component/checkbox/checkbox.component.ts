import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent {

  @Input() label: string;
  @Input() form: FormGroup;
  @Input() controlName: string;

  get control(): FormControl {
    return this.form?.get(this.controlName) as FormControl;
  }

}
