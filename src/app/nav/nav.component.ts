import { Component } from '@angular/core';
import { ModalsControls } from '../services/modal-controls/modals.controls';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {

  constructor(
    public modalControl: ModalsControls
  ) { }

  reloadPage() {
    window.location.reload();
  }
}
