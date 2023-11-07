import { Component, ElementRef, QueryList, Renderer2, ViewChildren, ViewChild, inject } from '@angular/core';
import { UsersListServices } from '../services/firebase-services/users-list.services';
import { Firestore, onSnapshot, updateDoc } from '@angular/fire/firestore';
import { ModalsControls } from '../services/modal-controls/modals.controls';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent {

  firestore: Firestore = inject(Firestore);
  loading: boolean = false;
  userId: any;
  user: any;
  tasks: any;
  filteredTasks: any;
  todoTasks: any = [];
  inProgressTasks: any = [];
  awaitFeedbackTasks: any = [];
  doneTasks: any = [];
  currentDraggedElement: any;
  searchField: any;
  unsubUser;

  @ViewChildren('tasks') tasksRef!: QueryList<ElementRef>;
  @ViewChild('searchField') searchFieldRef!: ElementRef;

  constructor(
    private userListService: UsersListServices,
    private renderer: Renderer2,
    public modalControls: ModalsControls
  ) {
    const storedValue = localStorage.getItem('id-key');
    this.userId = storedValue ? JSON.parse(storedValue) : null;
    this.unsubUser = this.subUserList();
  }

  ngOnDestroy() {
    this.unsubUser();
  }

  ngAfterViewInit() {
    this.searchField = this.searchFieldRef.nativeElement;
  }

  subUserList() {
    return onSnapshot(this.userListService.getUserDocRef('users', this.userId), (list: any) => {
      this.user = list.data();
      this.initializeTasks();
    })
  }

  initializeTasks() {
    this.tasks = this.user[`tasks`];
    this.tasks.forEach((task:any)=> {
      task.isChoise = false;
    })
    this.filterTasks(this.tasks);
  }

  filterTasks(tasks: any) {
    this.todoTasks = tasks.filter((task: any) => task.status === 'to-do');
    this.inProgressTasks = tasks.filter((task: any) => task.status === 'in-progress');
    this.awaitFeedbackTasks = tasks.filter((task: any) => task.status === 'await-feedback');
    this.doneTasks = tasks.filter((task: any) => task.status === 'done');
  }

  startDragging(el: any, id: number) {
    this.currentDraggedElement = id;
  }

  endDragging(el: any, id: number) {
    this.renderer.removeClass(el.target, 'rotated');
    this.tasksRef.forEach((ul: ElementRef) => {
      this.renderer.removeClass(ul.nativeElement, 'opacity05');
      this.renderer.removeClass(ul.nativeElement, 'bg-ul-tasks');
    });

  }

  onMouseDown(el: any) {
    this.renderer.addClass(el.target, 'rotated');
    this.tasksRef.forEach((ul: ElementRef) => {
      this.renderer.addClass(ul.nativeElement, 'opacity05');
      this.renderer.addClass(ul.nativeElement, 'bg-ul-tasks');
    });
    this.renderer.removeClass(el.target.parentElement, 'opacity05');
    this.renderer.removeClass(el.target.parentElement, 'bg-ul-tasks');
  }

  onMouseUp(el: any) {
    this.renderer.removeClass(el.target, 'rotated');
    this.tasksRef.forEach((ul: ElementRef) => {
      this.renderer.removeClass(ul.nativeElement, 'opacity05');
      this.renderer.removeClass(ul.nativeElement, 'bg-ul-tasks');
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
    this.filterTasks(this.tasks);
  }

  leaveDragging(el: any, status: string) {
    if (el.target.parentElement.tagName == 'UL') {
      this.renderer.addClass(el.target.parentElement, 'opacity05');
      this.renderer.addClass(el.target.parentElement, 'bg-ul-tasks');
    }
  }

  overDragging(el: any, status: string) {
    el.preventDefault();
    this.renderer.removeClass(el.target.parentElement, 'opacity05');
    this.renderer.removeClass(el.target.parentElement, 'bg-ul-tasks');
  }

  searchTask() {
    let searchValue = this.searchField.value.toLowerCase();
    this.filteredTasks = [];
    this.tasks.forEach((task: any) => {
      let title = task.title.toLowerCase();
      let description = task.description.toLowerCase();
      if (title.includes(searchValue) || description.includes(searchValue)) {
        this.filteredTasks.push(task);
      }
    });
    this.filterTasks(this.filteredTasks);
  }

  openTask(task: any) {
    this.modalControls.openedTask = task;
    this.modalControls.openedTaskId = task.id;
    this.modalControls.isModalContainerOpen = true;
    this.modalControls.isTaskOpen = true;
  }

  openChoiseListStatus(event: Event, task:any) {
    event.stopPropagation();
    task.isChoise = !task.isChoise;
    this.currentDraggedElement = task.id;
  }

  moveToChoiseListe(status:string, event:Event) {
    event.stopPropagation();
    this.moveTo(status);
  }
}