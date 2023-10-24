import { Component } from '@angular/core';
import { UsersListServices } from '../services/firebase-services/users-list.services';
import { onSnapshot } from '@firebase/firestore';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent {

  userId: any;
  user: any;
  tasks: any;
  tasksCount: number = 0;
  todoCount: number = 0;
  inProgressCount: number = 0;
  feedbackCount: number = 0;
  doneCount: number = 0;
  urgentCount: number = 0;
  urgentTasks: string = '';
  urgentDate: string = '';
  greetings: string = '';
  userName: string = '';
  unsubUser;

  constructor(
    private userListService: UsersListServices
  ) {
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
      this.initializeVariable();
    })
  }

  initializeVariable() {
    this.tasks = this.user[`tasks`];
    this.tasksCount = this.tasks.length;
    this.todoCount = this.tasks.filter((obj: any) => obj.status === "to-do").length;
    this.inProgressCount = this.tasks.filter((obj: any) => obj.status === "in-progress").length;
    this.feedbackCount = this.tasks.filter((obj: any) => obj.status === "awaiting-feedback").length;
    this.doneCount = this.tasks.filter((obj: any) => obj.status === "done").length;
    this.urgentCount = this.tasks.filter((obj: any) => obj.prio === "urgent").length;
    this.urgentTasks = this.tasks.filter((obj: any) => obj.prio === "urgent");
    this.urgentDate = this.getDate(this.urgentTasks);
    this.greetings = this.getGreeting();
    this.userName = this.user['name']
  }

  getDate(urgentTasks: any) {
    if (urgentTasks.length > 0) {
      const earliestDate = urgentTasks.reduce((minDate: any, obj: any) => {
        const currentDate = new Date(obj.date);
        return currentDate < minDate ? currentDate : minDate;
      }, new Date(urgentTasks[0].date));
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric"
      };
      const formattedDate = earliestDate.toLocaleDateString("en-US", options);
      return formattedDate;
    }
    return "";
  }

  getGreeting() {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) {
      return "Good morning, ";
    } else if (currentHour >= 12 && currentHour < 18) {
      return "Good afternoon, ";
    } else if (currentHour >= 18 && currentHour < 22) {
      return "Good evening, ";
    } else {
      return "Good night, ";
    }
  }
}