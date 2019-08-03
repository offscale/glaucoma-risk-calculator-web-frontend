import { Component, Input } from '@angular/core';

import { IRiskResBase } from '../../api/risk_res/risk_res';


@Component({
  selector: 'app-results-table',
  templateUrl: './results-table.component.html',
  styleUrls: ['./results-table.component.scss']
})
export class ResultsTableComponent {
  displayedColumns: string[] = [
    'client_risk', 'id', 'age', 'gender', 'ethnicity', 'study', 'parent',
    'sibling', 'myopia', 'diabetes'
  ];
  @Input() public dataSource: IRiskResBase[];
}
