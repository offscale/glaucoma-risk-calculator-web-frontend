import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Ng2TableModule } from 'ng2-table/ng2-table';
import { PaginationModule, TabsModule } from 'ngx-bootstrap';

import { dashboardRoutes } from '../dashboard/dashboard.routes';
import { UsersComponent } from './users.component';
import { UserService } from '../../api/user/user.service';


@NgModule({
  imports: [
    CommonModule, RouterModule.forChild(dashboardRoutes), FormsModule,
    PaginationModule.forRoot(), TabsModule, Ng2TableModule
  ],
  providers: [UserService],
  declarations: [UsersComponent]
})
export class UsersModule {
}
