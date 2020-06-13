import { Component, OnInit } from '@angular/core';

import { ServerStatusService } from '../../api/server-status/server-status.service';
import { IServerStatus } from '../../api/server-status/server-status.interfaces';


@Component({
  selector: 'app-server-status',
  templateUrl: './server-status.component.html',
  styleUrls: ['./server-status.component.scss']
})
export class ServerStatusComponent implements OnInit {
  serverStatus: IServerStatus;

  constructor(private serverStatusService: ServerStatusService) { }

  ngOnInit(): void {
    this.serverStatusService.get()
      .subscribe(serverStatus => this.serverStatus = serverStatus);
  }

}
