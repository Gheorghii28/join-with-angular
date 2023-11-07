import { Component } from '@angular/core';
import { ModalsControls } from '../services/modal-controls/modals.controls';

@Component({
  selector: 'app-help-info',
  templateUrl: './help-info.component.html',
  styleUrls: ['./help-info.component.scss']
})
export class HelpInfoComponent {
  constructor(
    public modalControl: ModalsControls
  ) { }
}
