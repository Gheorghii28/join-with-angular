import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ModalsControls } from '../services/modal-controls/modals.controls';


@Component({
  selector: 'app-privacypolicy',
  templateUrl: './privacypolicy.component.html',
  styleUrls: ['./privacypolicy.component.scss']
})
export class PrivacypolicyComponent {
  constructor(
    public modalControl: ModalsControls
  ) { }
}
