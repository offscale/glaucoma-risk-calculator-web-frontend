import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Ng2TableModule } from 'ng2-table/ng2-table';
import { PaginationModule } from 'ng2-bootstrap';
import { TabsModule } from 'ng2-bootstrap';
import { dashboardRoutes } from '../dashboard/dashboard.routes';
import { UsersComponent } from './users.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  imports: [
    CommonModule, RouterModule.forChild(dashboardRoutes), FormsModule,
    PaginationModule.forRoot(), TabsModule, Ng2TableModule
  ],
  declarations: [UsersComponent]
})
export class UsersModule {
}
