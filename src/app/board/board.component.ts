import { Component, ElementRef, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { UsersListServices } from '../services/firebase-services/users-list.services';
import { updateDoc } from '@angular/fire/firestore';

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
  currentDraggedElement: any;

  @ViewChildren('tasks') tasksRef!: QueryList<ElementRef>;

  constructor(
    private userListService: UsersListServices,
    private renderer: Renderer2
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
    const user: User = await this.userListService.fetchUserData('users', this.userId);
    this.user = user;
  }

  initializeTasks() {
    this.tasks = this.user[`tasks`];
    this.filterTasks();
  }

  filterTasks() {
    this.todoTasks = this.tasks.filter((task: any) => task.status === 'to-do');
    this.inProgressTasks = this.tasks.filter((task: any) => task.status === 'in-progress');
    this.awaitFeedbackTasks = this.tasks.filter((task: any) => task.status === 'await-feedback');
    this.doneTasks = this.tasks.filter((task: any) => task.status === 'done');
  }

  startDragging(el: any, id: number) {
    this.currentDraggedElement = id;
  }

  endDragging(el: any, id: number) {
    this.renderer.removeClass(el.target, 'rotated');
    this.tasksRef.forEach((ul: ElementRef) => {
      this.renderer.removeClass(ul.nativeElement, 'opacity05');
    });

  }

  onMouseDown(el: any) {
    this.renderer.addClass(el.target, 'rotated');
    this.tasksRef.forEach((ul: ElementRef) => {
      this.renderer.addClass(ul.nativeElement, 'opacity05');
    });
    this.renderer.removeClass(el.target.parentElement, 'opacity05');
  }

  onMouseUp(el: any) {
    this.renderer.removeClass(el.target, 'rotated');
    this.tasksRef.forEach((ul: ElementRef) => {
      this.renderer.removeClass(ul.nativeElement, 'opacity05');
    });

  }

  async moveTo(status: string) {
    this.tasks.forEach((task: any) => {
      if (task.id == this.currentDraggedElement) {
        task.status = status;
      }
    });
    await updateDoc(this.userListService.getUserDocRef('users', this.userId), {
      "tasks": this.tasks
    });
    this.filterTasks();
  }

  leaveDragging(el: any, status: string) {
    if (el.target.parentElement.tagName == 'UL') {
      this.renderer.addClass(el.target.parentElement, 'opacity05');
    }
  }

  overDragging(el: any, status: string) {
    el.preventDefault();
    this.renderer.removeClass(el.target.parentElement, 'opacity05');
  }
}
