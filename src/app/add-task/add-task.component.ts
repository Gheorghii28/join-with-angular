import { Component } from '@angular/core';
import { ModalsControls } from '../services/modal-controls/modals.controls';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent {

  constructor(
    public modalControls: ModalsControls
  ) {
    modalControls.page = 'addTask';
  }
}