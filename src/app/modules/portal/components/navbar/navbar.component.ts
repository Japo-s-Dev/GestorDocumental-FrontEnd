import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PrivilegeService } from '../../../../services/privilege.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  showSearch = false;
  showAdd = false;
  showAdmin = false;
  showReports = false;
  username: string | null = null;
  privileges: number[] = [];
  currentLanguage: string;
  isAdminExpanded = false;
  isReportsExpanded = false;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private privilegeService: PrivilegeService
  ) {
    this.currentLanguage = this.translate.getDefaultLang() || 'es';
    this.translate.setDefaultLang(this.currentLanguage);
  }

  ngOnInit(): void {
    const userStatus = localStorage.getItem('userStatus');
    if (userStatus) {
      const parsedStatus = JSON.parse(userStatus);
      this.username = parsedStatus.username;

      this.privilegeService.fetchPrivileges(parsedStatus.role).subscribe(
        (response) => {
          if (response.body?.result && Array.isArray(response.body.result)) {
            this.privileges = response.body.result.map((privilege: any) => privilege.privilege_id);
            this.privilegeService.setPrivileges(this.privileges);
            this.determineVisibility();
          }
        }
      );
    }
  }

  determineVisibility(): void {
    const hasPrivilege = (id: number) => this.privileges.includes(id);
    this.showAdmin = hasPrivilege(1) || hasPrivilege(3) || hasPrivilege(5);
    this.showReports = hasPrivilege(7);
  }

  toggleAdmin(): void {
    this.isAdminExpanded = !this.isAdminExpanded;
    if (this.isAdminExpanded) {
      this.isReportsExpanded = false;
    }
    this.closeMenuOnOptionClick(); // Cerrar menú al hacer clic
  }

  toggleReports(): void {
    this.isReportsExpanded = !this.isReportsExpanded;
    if (this.isReportsExpanded) {
      this.isAdminExpanded = false;
    }
    this.closeMenuOnOptionClick(); // Cerrar menú al hacer clic
  }

  navigate(path: string): void {
    this.router.navigate([path]);
  }
}
