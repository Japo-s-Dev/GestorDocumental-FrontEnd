import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgClass } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-modal',
  templateUrl: './profile-modal.component.html',
  styleUrls: ['./profile-modal.component.css']
})
export class ProfileModalComponent implements OnInit {
  username: string | null = '';
  role: string | null = '';
  lastLogin: string | null = '';
  roleIcon: string = 'fa-user-circle';
  roleStyle: string = '';

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    const userStatus = JSON.parse(localStorage.getItem('userStatus') || '{}');
    this.username = userStatus.username;
    this.role = userStatus.role;
    this.lastLogin = localStorage.getItem('lastLogin') || 'No disponible';

    if (this.role === 'ADMIN') {
      this.roleIcon = 'fa-solid fa-user-tie';
      this.roleStyle = 'admin-role';
    } else if (this.role === 'ADMIN JUNIOR') {
      this.roleIcon = 'fa-solid fa-user-tie';
      this.roleStyle = 'admin-junior-role';
    }
  }

  close() {
    this.activeModal.dismiss();
  }

  exit() {
    this.activeModal.close('exit');
  }

  logout() {
    localStorage.removeItem('userStatus');
    localStorage.removeItem('lastLogin');
    this.activeModal.close('logout');
  }
}
