import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class ModalsControls {
    isModalContainerOpen:boolean = false;
    isTaskFormOpen:boolean = false;

    isResultInfoOpen:boolean = false;
    isTaskLoading:boolean = false;
    isTaskSaved:boolean = false;
    isTaskDeleted:boolean = false;
    isResultInfoHidden:boolean = false;

    taskStatus:string = 'to-do';

    openedTask:any;
    openedTaskId:any;
    isTaskOpen:boolean = false;

    constructor(
        private router: Router
    ) { }

    openTaskForm(newTaskStatus: string) {
        this.isModalContainerOpen = true;
        this.isTaskFormOpen = true;
        this.taskStatus = newTaskStatus;
        this.openedTask = undefined;
    }

    closeTaskForm() {
        this.isModalContainerOpen = false;
        this.isTaskFormOpen = false;
        this.isTaskOpen = false;
    }
    showLoadingAnimation() {
        this.isResultInfoOpen = true;
        this.isTaskLoading = true;
    }

    showSuccessSymbolAndMessage() {
        this.isTaskLoading = false;
        this.isTaskSaved = true;
    }

    showDeletedTaskMessage() {
        this.isTaskLoading = false;
        this.isTaskDeleted = true;
    }

    showErrorMessageBox(message: any) {
        console.log(message);
    }

    hideLoadingAnimation() {
        this.isResultInfoHidden = true;
        setTimeout(() => {
            this.isResultInfoOpen = false;
            this.isTaskLoading = false;
            this.isTaskSaved = false;
            this.isTaskDeleted = false;
            this.isResultInfoHidden = false;
            this.closeTaskForm();
            this.router.navigate(['/board']);
        }, 1500);
    }
}