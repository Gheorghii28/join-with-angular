import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  submenuShow:boolean = false;

  constructor() {

  }

  reloadPage() {
    window.location.reload();
  }

  toggleSubmenu() {
    this.submenuShow = !this.submenuShow;
  }
}
