import { Component } from '@angular/core';
import { ModalsControls } from '../services/modal-controls/modals.controls';
import { onSnapshot, updateDoc } from '@angular/fire/firestore';
import { UsersListServices } from '../services/firebase-services/users-list.services';

@Component({
  selector: 'app-modal-task-opened',
  templateUrl: './modal-task-opened.component.html',
  styleUrls: ['./modal-task-opened.component.scss']
})
export class ModalTaskOpenedComponent {

  task: any;
  tasks: any;
  userId: any;
  user: any;
  unsubUser;

  constructor(
    public modalControls: ModalsControls,
    private userListService: UsersListServices
  ) {
    this.task = modalControls.openedTask;
    const storedValue = localStorage.getItem('id-key');
    this.userId = storedValue ? JSON.parse(storedValue) : null;
    this.unsubUser = this.subUserList();
  }

  ngOnDestroy() {
    this.unsubUser();
  }

  subUserList() {
    return onSnapshot(this.userListService.getUserDocRef('users', this.userId), (list: any) => {
      this.user = list.data();
      this.initializeTasks();
    })
  }

  initializeTasks() {
    this.tasks = this.user[`tasks`];
    this.tasks.forEach((task: any) => {
      if (task.id == this.modalControls.openedTaskId) {
        this.task = task;
      }
    });
  }

  async deleteTask(task: any) {
    try {
      this.modalControls.showLoadingAnimation();
      await updateDoc(this.userListService.getUserDocRef('users', this.userId), {
        "tasks": this.getDeletedUpdatedTasks(task)
      });
      this.modalControls.showDeletedTaskMessage();
    } catch (error) {
      this.showErrorMessageBox(error);
    } finally {
      this.modalControls.hideLoadingAnimation();
    }
  }

  getDeletedUpdatedTasks(deletedTask: any) {
    const updatedTasks = this.tasks.filter((task: any) => task.id !== deletedTask.id);
    return updatedTasks;
  }

  showErrorMessageBox(message: any) {
    console.log(message);
  }

  async changeSubtaskStatus(task: any, index: number) {
    await updateDoc(this.userListService.getUserDocRef('users', this.userId), {
      "tasks": this.getSubtasksUpdatedTasks(task, index)
    });
  }

  getSubtasksUpdatedTasks(task: any, index: number) {
    let updatedTasks: any = [];
    this.tasks.forEach((taskObj: any) => {
      if (taskObj.id == task.id) {
        if (task.subTasks[index].status == 'opened') {
          taskObj.subTasks[index].status = 'closed';
          taskObj.closedSubTasks++;
          taskObj.progress = taskObj.closedSubTasks / taskObj.subTasks.length * 100;
        } else if (task.subTasks[index].status == 'closed') {
          taskObj.subTasks[index].status = 'opened';
          taskObj.closedSubTasks--;
          taskObj.progress = taskObj.closedSubTasks / taskObj.subTasks.length * 100;
        }
      }
      updatedTasks.push(task);
    });
    return updatedTasks;
  }
}
