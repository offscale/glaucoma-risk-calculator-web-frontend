import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable()
export class AppService {
  private _navbarPadding: number = 0;
  navbarPadding$: BehaviorSubject<number> = new BehaviorSubject(this._navbarPadding);
  navbarPaddingChange: Subject<number> = new Subject();

  constructor() {
    //this.navbarPadding = this._navbarPadding;
  }

  get navbarPadding(): number {
    return this._navbarPadding;
  }

  set navbarPadding(val: number) {
    this._navbarPadding = val;
    this.navbarPadding$.next(this._navbarPadding);
  }
}
