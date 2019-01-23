import { AfterContentInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { RiskResService, TSingleSeries } from '../../api/risk_res/risk_res.service';
import { IRiskRes } from '../../api/risk_res/risk_res';
import { Table } from '../table';
import { Ng2TableModule } from 'ng2-table';
import { NgTableComponent } from 'ng2-table/components/table/ng-table.component';


@Component({
  selector: 'app-risk-res',
  templateUrl: './risk-res.component.html',
  styleUrls: ['./risk-res.component.css']
})
export class RiskResComponent extends Table<IRiskRes> implements OnInit, AfterContentInit {
  @ViewChild('tableContainer') tableContainer: NgTableComponent;

  ethnicity_agg: TSingleSeries;
  age_distr: Array<{name: string, series: Array<{name: string, value: number}>}>;
  view: [number, number];

  constructor(private router: Router,
              private riskResService: RiskResService) {
    super();
    this.columns = ['age', 'client_risk', 'gender', 'ethnicity', 'parent',
      'study', 'myopia', 'id', 'createdAt', 'updatedAt'].map(
      title => ({
        title,
        name: title,
        filtering: {
          filterString: '',
          placeholder: `Filter by ${(['age', 'client_risk'].indexOf(title) > -1 ? '>= ' : '') + title}`
        }
      })
    );

    this.config = Object.assign(this.config, {
      columns: this.columns,
      className: this.config.className.concat(['calculations-tbl'])
    });
  }

  ngOnInit() {
    this.riskResService
      .readAll()
      .subscribe(r => {
          this.data = r.risk_res.map(rr => Object.assign(rr, {
            sibling: rr.sibling || false,
            parent: rr.parent || false,
            myopia: rr.myopia || false,
          }));
          this.ethnicity_agg = r.ethnicity_agg;
          this.graphInit();
        },
        console.error
      );
    this.onChangeTable(this.config);
  }

  ngAfterContentInit() {
    console.info('this.tableContainer', this.tableContainer, ';');
    this.tableContainer.rows[3].className = 'bg-red';
    console.info('this.tableContainer.rows[3]', this.tableContainer.rows[3],';');
    // const trs = this.tableContainer.nativeElement.children[0].children[0].children[1].children;
    /*if (rowNumber !== -1) {
      if (rowNumber > -1 && rowNumber < trs.length) { // Avoid updating class if no need to
        if (trs[rowNumber].className === 'active') {
          return;
        }
      }
      for (let i = 0; i < trs.length; i++) {
        trs[i].className = (i === rowNumber) ? 'active' : '';
      }
    }*/
  }

  changeFilter(data: IRiskRes[], config: any): IRiskRes[] {
    const ret = super.changeFilter(data, config);
    this.graphInit();
    return ret;
  }

  private graphInit() {
    const age_to_riskids = new Map<number, number[]>();
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].forEach(
      k => age_to_riskids.set(k, [])
    );
    const riskid_to_risk = new Map<number, IRiskRes>();
    this.data.forEach(risk_res => {
      riskid_to_risk.set(risk_res.id, risk_res);
      const k = Math.floor(risk_res.age / 10);
      age_to_riskids.set(k, age_to_riskids.get(k).concat(risk_res.id));
    });
    this.age_distr = Array
      .from(age_to_riskids.values())
      .map((risk_ids, idx) => ({
        name: (sr => `${sr}-${sr + 9}`)(idx * 10),
        series: risk_ids.map(k => (risk_res => ({
          name: risk_res.id.toString(),
          value: risk_res.age
        }))(riskid_to_risk.get(k)))
      }))
      .filter(o => o.series.length);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    const statsNum = document.getElementById('stats-num');
    // [350,250]
    // this.view = [statsNum.clientHeight - 20, statsNum.clientWidth];
  }

  getHeight(row: any, index: number): number {
    console.info('row.client_risk', row.client_risk, ';');
    return 50;
  }

  onCellClick(data: {column: string, row: IRiskRes}): any {
    this.router
      .navigateByUrl(`/results/${data.row.id}`)
      .catch(console.error);
  }
}
