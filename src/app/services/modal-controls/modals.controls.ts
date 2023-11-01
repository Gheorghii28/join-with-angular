import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class ModalsControls {
    isModalContainerOpen: boolean = false;
    isTaskFormOpen: boolean = false;

    isModalContactContainerOpen: boolean = false;
    isContactFormOpen: boolean = false;

    isResultInfoOpen: boolean = false;
    isTaskLoading: boolean = false;
    isTaskSaved: boolean = false;
    isTaskDeleted: boolean = false;
    isResultInfoHidden: boolean = false;

    taskStatus: string = 'to-do';

    openedTask: any;
    openedTaskId: any;
    isTaskOpen: boolean = false;

    displayedContact: any;
    displayedContainerBtns: boolean = false;

    openedContactFormText: any;
    addContactFormText = {
        h2: 'Add contact',
        span: 'Tasks are better with a team!',
        btn: 'Create Contact'
    }
    editContactFormText = {
        h2: 'Edit contact',
        span: '',
        btn: 'Save'
    }
    isContactEdit:boolean = false;

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

    closeContactForm() {
        this.isModalContactContainerOpen = false;
        this.isContactFormOpen = false;
        this.isContactEdit = false;
    }

    openContactForm(contact: any, formText: any, boolenValue:boolean) {
        this.isModalContactContainerOpen = true;
        this.isContactFormOpen = true;
        this.displayedContainerBtns = false;
        this.openedContactFormText = formText;
        this.isContactEdit = boolenValue;
    }
}