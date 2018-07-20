import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Ng2TableModule } from 'ng2-table/ng2-table';
import { NgbPaginationModule, NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';

import { dashboardRoutes } from '../dashboard/dashboard.routes';
import { UserService } from '../../api/user/user.service';
import { UsersComponent } from './users.component';


@NgModule({
  imports: [
    CommonModule, RouterModule.forChild(dashboardRoutes), FormsModule,
    NgbPaginationModule.forRoot(), NgbTabsetModule, Ng2TableModule
  ],
  providers: [UserService],
  declarations: [UsersComponent]
})
export class UsersModule {
}
