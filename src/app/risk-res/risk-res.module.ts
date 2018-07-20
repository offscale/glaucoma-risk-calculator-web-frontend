import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgbPaginationModule, NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2TableModule } from 'ng2-table';

import { RiskResComponent } from './risk-res.component';


@NgModule({
  imports: [
    CommonModule, FormsModule,
    NgbPaginationModule.forRoot(), NgbTabsetModule, Ng2TableModule
  ],
  declarations: [RiskResComponent]
})
export class RiskResModule {}
