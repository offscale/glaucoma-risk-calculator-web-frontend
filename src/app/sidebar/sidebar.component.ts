import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { AppService } from '../app.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SidebarComponent {
  constructor(public appService: AppService) {
  }
}
