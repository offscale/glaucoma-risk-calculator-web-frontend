import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AppService {
  navbarPaddingChange: Subject<number> = new Subject();

  private _navbarPadding = 0;
  navbarPadding$: BehaviorSubject<number> = new BehaviorSubject(this._navbarPadding);

  constructor() {
    // this.navbarPadding = this._navbarPadding;
  }

  get navbarPadding(): number {
    return this._navbarPadding;
  }

  set navbarPadding(val: number) {
    this._navbarPadding = val;
    this.navbarPadding$.next(this._navbarPadding);
  }
}
