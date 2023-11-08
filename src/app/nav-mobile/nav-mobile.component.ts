import { Component } from '@angular/core';
import { ModalsControls } from '../services/modal-controls/modals.controls';

@Component({
  selector: 'app-nav-mobile',
  templateUrl: './nav-mobile.component.html',
  styleUrls: ['./nav-mobile.component.scss']
})
export class NavMobileComponent {
  constructor(
    public modalControl: ModalsControls
  ) { }
}
