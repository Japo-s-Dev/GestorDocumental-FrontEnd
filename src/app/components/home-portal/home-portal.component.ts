import { Component } from '@angular/core';

@Component({
  selector: 'app-home-portal',
  templateUrl: './home-portal.component.html',
  styleUrls: ['./home-portal.component.css']
})
export class HomePortalComponent {
  usedStorage: number = 600; // Storage in GB
  totalStorage: number = 2000; // Total Storage in GB

  getStoragePercentage(): number {
    return (this.usedStorage / this.totalStorage) * 100;
  }
}
