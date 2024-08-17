import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() alertType: string = 'alert-default'; // alert-success, alert-info, alert-danger, alert-warning, alert-dark
  @Input() iconType: string = 'icon-default'; // icon-success, icon-info, icon-danger, icon-warning, icon-dark

  @Output() closed = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void { }

  close() {
    this.closed.emit();
  }
}
