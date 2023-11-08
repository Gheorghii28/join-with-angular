import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Location } from '@angular/common';
import { DataServices } from "../data-services/data.services";

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

    taskCharacteristics: any = {
        id: new Date().getTime(),
        taskStatus: 'to-do',
        closedSubTasks: 0,
        progress: 0,
        color: this.dataService.getRandomRGBColor()
    };
    taskStatus: string = 'to-do';

    openedTask: any;
    openedTaskId: any;
    isTaskOpen: boolean = false;

    displayedContact: any;
    isContactInfoDispayed: boolean = false;
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
    isContactEdit: boolean = false;
    isContactLoading: boolean = false;
    isContactSaved: boolean = false;
    isContactDeleted: boolean = false;

    isCategorySaved: boolean = false;

    subtaskList: any = [];

    constructor(
        private router: Router,
        private location: Location,
        private dataService: DataServices
    ) { }

    resetTaskCharacteristics(taskStatus:string) {
        this.taskCharacteristics = {
            id: new Date().getTime(),
            taskStatus: taskStatus,
            closedSubTasks: 0,
            progress: 0,
            color: this.dataService.getRandomRGBColor()
        }
    }

    goBack() {
        this.location.back();
    }

    openTaskForm(newTaskStatus: string) {
        this.isModalContainerOpen = true;
        this.isTaskFormOpen = true;
        this.taskStatus = newTaskStatus;
        this.openedTask = undefined;
    }

    setTaskStatus(newTaskStatus: string) {
        this.taskStatus = newTaskStatus;
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

    showContactLoadingAnimation() {
        this.isResultInfoOpen = true;
        this.isContactLoading = true;
    }

    showSuccessContactMessage() {
        this.isContactLoading = false;
        this.isContactSaved = true;
    }

    showDeletedContactMessage() {
        this.isContactLoading = false;
        this.isContactDeleted = true;
    }

    showSuccessSymbolAndMessage() {
        this.isTaskLoading = false;
        this.isTaskSaved = true;
    }

    showSuccessCategoryMessage() {
        this.isTaskLoading = false;
        this.isCategorySaved = true;
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

    hideLoadingAnimationCategory() {
        this.isResultInfoHidden = true;
        setTimeout(() => {
            this.isResultInfoOpen = false;
            this.isTaskLoading = false;
            this.isCategorySaved = false;
            this.isTaskDeleted = false;
            this.isResultInfoHidden = false;
        }, 1500);
    }

    hideContactLoadingAnimation(contact: any) {
        this.isResultInfoHidden = true;
        setTimeout(() => {
            this.isResultInfoOpen = false;
            this.isContactInfoDispayed = false;
            this.displayedContact = undefined;
            this.isContactLoading = false;
            this.isContactSaved = false;
            this.isContactDeleted = false;
            this.isResultInfoHidden = false;
            this.closeContactForm();
            if (contact) {
                const toElement = this.getTargetElement(contact.id);
                this.scrollToElement(toElement);
                this.displayedContact = contact;
                this.isContactInfoDispayed = true;
            }
        }, 1500);
    }

    scrollToElement(element: any) {
        element.scrollIntoView({ behavior: 'smooth' });
    }

    getTargetElement(id: number) {
        return document.getElementById(`contact-id${id}`);
    }

    closeContactForm() {
        this.isModalContactContainerOpen = false;
        this.isContactFormOpen = false;
        this.isContactEdit = false;
    }

    openContactForm(contact: any, formText: any, boolenValue: boolean) {
        this.isModalContactContainerOpen = true;
        this.isContactFormOpen = true;
        this.displayedContainerBtns = false;
        this.openedContactFormText = formText;
        this.isContactEdit = boolenValue;
    }
}