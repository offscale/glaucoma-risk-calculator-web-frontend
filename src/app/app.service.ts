import { Injectable } from '@angular/core';

import { BehaviorSubject, Subject } from 'rxjs';


@Injectable()
export class AppService {
  navbarPaddingChange: Subject<number> = new Subject();

  constructor() {
    // this.navbarPadding = this._navbarPadding;
  }

  private _navbarPadding = 16;

  navbarPadding$: BehaviorSubject<number> = new BehaviorSubject(this._navbarPadding);

  get navbarPadding(): number {
    return this._navbarPadding;
  }

  set navbarPadding(val: number) {
    this._navbarPadding = val;
    this.navbarPadding$.next(this._navbarPadding);
  }
}
