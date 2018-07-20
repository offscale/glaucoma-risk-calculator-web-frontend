import { Component, OnInit } from '@angular/core';

import { RiskResService } from '../../api/risk_res/risk_res.service';
import { IRiskRes } from '../../api/risk_res/risk_res';
import { Table } from '../table';

@Component({
  selector: 'app-risk-res',
  templateUrl: './risk-res.component.html',
  styleUrls: ['./risk-res.component.css']
})
export class RiskResComponent extends Table<IRiskRes> implements OnInit {
  constructor(private riskResService: RiskResService) {
    super();
    ['age', 'client_risk', 'gender', 'ethnicity', 'parent',
      'study', 'myopia', 'id', 'createdAt', 'updatedAt'].forEach(
      k => this.columns.push({ title: k, name: k, filtering: { filterString: '', placeholder: `Filter by ${k}` } })
    );
  }

  ngOnInit() {
    this.riskResService
      .readAll()
      .subscribe(risk_res => this.data = risk_res,
        console.error
      );
    this.onChangeTable(this.config);
  }
}
