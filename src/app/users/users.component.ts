import { Component, OnInit } from '@angular/core';

import { map } from 'rxjs/operators';

import { UserService } from '../../api/user/user.service';
import { IAuthReq } from '../../api/auth/auth.interfaces';
import { Table } from '../table';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent extends Table<IAuthReq> implements OnInit {
  constructor(private userService: UserService) {
    super();
    this.columns.push({ title: 'email', name: 'email', filtering: { filterString: '', placeholder: 'Filter by email' } });
  }

  ngOnInit() {
    this.userService
      .getAll()
      .pipe(map(user => user.users))
      .subscribe(users => this.data = users,
        console.error
      );
    this.onChangeTable(this.config);
  }
}
