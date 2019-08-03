import { Injectable } from '@angular/core';

import { MatStepper } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class StepperService {
  constructor() { }

  private _stepper: MatStepper;

  public get stepper(): MatStepper {
    return this._stepper;
  }

  public set stepper(stepper: MatStepper) {
    if (stepper == null) {
      return;
    }
    this._stepper = stepper;
  }
}
