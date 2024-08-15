import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home-portal',
  templateUrl: './home-portal.component.html',
  styleUrls: ['./home-portal.component.css']
})
export class HomePortalComponent {
  usedStorage: number = 600; // Storage in GB
  totalStorage: number = 2000; // Total Storage in GB
  currentLanguage: string;

  constructor(private translate: TranslateService) {
    this.currentLanguage = this.translate.getDefaultLang() || 'es';
    this.translate.setDefaultLang(this.currentLanguage);
  }

  getStoragePercentage(): number {
    return (this.usedStorage / this.totalStorage) * 100;
  }

  switchLanguage(language: string) {
    this.translate.use(language);
    this.currentLanguage = language;
  }
}
