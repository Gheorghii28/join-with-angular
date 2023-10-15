import { Component } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { UsersListServices } from '../services/firebase-services/users-list.services';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent {

  loading: boolean = true;
  userId: any;
  user: any;
  tasks: any;
  todoTasks: any;
  inProgressTasks: any;
  awaitFeedbackTasks: any;
  doneTasks: any;
  
  constructor(
    private usersListRef: UsersListServices
  ) { }
  
  ngOnInit(): void {
    this.initializeUserId();
    this.updateData().then(() => {
      this.loading = false;
    });
  }

  initializeUserId() {
    const storedValue = localStorage.getItem('id-key');
    this.userId = storedValue ? JSON.parse(storedValue) : null;
  }
  
  async updateData() {
    await this.getUser();
    this.initializeTasks();
  }

  async getUser() {
    const user: User = await this.usersListRef.fetchUserData('users', this.userId);
    this.user = user;
  }
  
  initializeTasks() {
    this.tasks = this.user[`tasks`];
    this.filterTasks();
    console.log('tasks:', this.tasks);
  }

  filterTasks() {
    this.todoTasks = this.tasks.filter((task:any) => task.status === 'to-do');
    this.inProgressTasks = this.tasks.filter((task:any) => task.status === 'in-progress');
    this.awaitFeedbackTasks = this.tasks.filter((task:any) => task.status === 'await-feedback');
    this.doneTasks = this.tasks.filter((task:any) => task.status === 'done');
  }
}
