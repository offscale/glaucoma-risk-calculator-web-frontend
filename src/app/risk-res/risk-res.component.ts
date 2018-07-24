import { Component, OnInit } from '@angular/core';

import { RiskResService, TSingleSeries } from '../../api/risk_res/risk_res.service';
import { IRiskRes } from '../../api/risk_res/risk_res';
import { Table } from '../table';

@Component({
  selector: 'app-risk-res',
  templateUrl: './risk-res.component.html',
  styleUrls: ['./risk-res.component.css']
})
export class RiskResComponent extends Table<IRiskRes> implements OnInit {
  ethnicity_agg: TSingleSeries;

  constructor(private riskResService: RiskResService) {
    super();
    this.columns = ['age', 'client_risk', 'gender', 'ethnicity', 'parent',
      'study', 'myopia', 'id', 'createdAt', 'updatedAt'].map(
      title => ({
        title,
        name: title,
        filtering: { filterString: '', placeholder: `Filter by ${title}` }
      })
    );
  }

  ngOnInit() {
    this.riskResService
      .readAll()
      .subscribe(r => {
          this.data = r.risk_res;
          this.ethnicity_agg = r.ethnicity_agg;
        },
        console.error
      );
    this.onChangeTable(this.config);
  }

  getHeight(row: any, index: number): number {
    console.info('row.client_risk', row.client_risk, ';');
    return 50;
  }
}
