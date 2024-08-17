import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-home-portal',
  templateUrl: './home-portal.component.html',
  styleUrls: ['./home-portal.component.css']
})
export class HomePortalComponent implements OnInit {
  usedStorage: number = 600;
  totalStorage: number = 2000;
  currentLanguage: string;

  constructor(
    private translate: TranslateService,
    private loaderService: LoaderService
  ) {
    this.currentLanguage = this.translate.getDefaultLang() || 'es';
    this.translate.setDefaultLang(this.currentLanguage);
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.loaderService.hideLoader();
    }, 2000);
  }

  getStoragePercentage(): number {
    return (this.usedStorage / this.totalStorage) * 100;
  }

  switchLanguage(language: string) {
    this.translate.use(language);
    this.currentLanguage = language;
  }
}
