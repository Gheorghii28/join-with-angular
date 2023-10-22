import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class ModalsControls {
    isModalContainerOpen = false;
    isTaskFormOpen = false;

    isResultInfoOpen = false;
    isTaskLoading = false;
    isTaskSaved = false;
    isResultInfoHidden = false;

    taskStatus:string = 'to-do';
    page:string = 'addTask';

    constructor(
        private router: Router
    ) { }

    openTaskForm(newTaskStatus: string) {
        this.isModalContainerOpen = true;
        this.isTaskFormOpen = true;
        this.taskStatus = newTaskStatus;
    }

    closeTaskForm() {
        this.isModalContainerOpen = false;
        this.isTaskFormOpen = false;
    }
    showLoadingAnimation() {
        this.isResultInfoOpen = true;
        this.isTaskLoading = true;
    }

    showSuccessSymbolAndMessage() {
        this.isTaskLoading = false;
        this.isTaskSaved = true;
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
            this.isResultInfoHidden = false;
            this.closeTaskForm();
            if(this.page == 'addTask') {
                this.router.navigate(['/board']);
            }
            if(this.page == 'board') {
                window.location.reload();
            }
        }, 1500);
    }
}