import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { AppService } from '../app.service';


@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  navbarPadding: number;
  subNavbarPadding: Subscription;

  constructor(public appService: AppService) {}

  ngOnInit() {
    this.navbarPadding = this.appService.navbarPadding;
    this.subNavbarPadding = this.appService.navbarPaddingChange.subscribe(value =>
      this.navbarPadding = value
    );
  }

  ngOnDestroy() {
    this.subNavbarPadding.unsubscribe();
  }

  increase() {
    this.appService.navbarPadding += 50;
  }
}
