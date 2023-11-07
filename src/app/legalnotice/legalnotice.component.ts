import { Component } from '@angular/core';
import { ModalsControls } from '../services/modal-controls/modals.controls';

@Component({
  selector: 'app-legalnotice',
  templateUrl: './legalnotice.component.html',
  styleUrls: ['./legalnotice.component.scss']
})
export class LegalnoticeComponent {
  constructor(
    public modalControl: ModalsControls
  ) { }
}
