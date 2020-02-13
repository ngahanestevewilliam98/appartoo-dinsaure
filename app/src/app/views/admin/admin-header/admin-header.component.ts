import { Component, Inject } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss']
})
export class AdminHeaderComponent {

  constructor(public router: Router, @Inject(SESSION_STORAGE) private storage: StorageService) { }

  disconnect(): void {
    this.storage.clear();
    this.router.navigate(['']);
  }

}
