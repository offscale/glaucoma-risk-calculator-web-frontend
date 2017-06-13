import { Component, Input, OnInit } from '@angular/core';
import { ServerStatusService } from '../api/server-status.service';
import { ServerStatus } from '../api/ServerStatus';

@Component({
  selector: 'app-api-version',
  templateUrl: './server-status.component.html',
  styleUrls: ['./server-status.component.css']
})
export class ServerStatusComponent implements OnInit {
  @Input() serverStatus: ServerStatus = {} as ServerStatus;

  constructor(private serverStatusService: ServerStatusService) {
  }

  ngOnInit() {
    this.serverStatus = {version: 'App 0.0.14; '};
    this.serverStatusService.get().then(
      serverStatus => this.serverStatus.version += `API ${serverStatus.version}`
    ).catch(error => this.serverStatus.version += 'API server not available');
  }
}
