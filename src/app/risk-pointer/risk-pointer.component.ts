import { AfterViewInit, Component, Input } from '@angular/core';
import { numToColour } from '../colours';

@Component({
  selector: 'app-risk-pointer',
  templateUrl: './risk-pointer.component.html',
  styleUrls: ['./risk-pointer.component.css']
})
export class RiskPointerComponent implements AfterViewInit {
  @Input() risk_value: number;
  numToColour = numToColour;

  constructor() { }

  ngAfterViewInit() {
    // this.risk_value;
  }
}
