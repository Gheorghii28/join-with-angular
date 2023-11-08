import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { updateDoc } from '@firebase/firestore';
import { UsersListServices } from '../services/firebase-services/users-list.services';
import { Contact, Task, User } from '../interfaces/user.interface';
import { ModalsControls } from '../services/modal-controls/modals.controls';
import { onSnapshot } from '@angular/fire/firestore';

@Component({
  selector: 'app-modal-task-form',
  templateUrl: './modal-task-form.component.html',
  styleUrls: ['./modal-task-form.component.scss']
})
export class ModalTaskFormComponent {

  user!: User;
  userId: any;
  isUserLoaded: boolean = false;
  isFormValid: boolean = true;
  addTaskFormular: FormGroup = new FormGroup({});
  titleInfo: any;
  descriptionInfo: any;
  assignedInfo: any;
  dateInfo: any;
  prioInfo: any;
  categoryInfo: any;
  subtaskInfo: any;
  allFieldsInfo: any = [];
  filteredContactList: any = [];
  formGroup: any = {
    titleField: ['', [Validators.required]],
    descriptionField: ['', [Validators.required]],
    assignedField: ['', [Validators.required]],
    dateField: ['', [Validators.required]],
    prioField: ['', [Validators.required]],
    categoryField: ['', [Validators.required]],
    subtasksField: ['']
  }
  formGroupOpenedTask: any = this.getFormGroupOpenedTask();
  currentDate: string = new Date().toISOString().split('T')[0];
  unsubUser;

  @ViewChild('assignedField') assignedFieldRef!: ElementRef;
  @ViewChild('categoryField') categoryFieldRef!: ElementRef;
  @ViewChild('titleField') titleFieldRef!: ElementRef;
  @ViewChild('descriptionField') descriptionFieldRef!: ElementRef;
  @ViewChild('dateField') dateFieldRef!: ElementRef;

  constructor(
    private userListService: UsersListServices,
    private formBuilder: FormBuilder,
    public modalControls: ModalsControls
  ) {
    const storedValue = localStorage.getItem('id-key');
    this.userId = storedValue ? JSON.parse(storedValue) : null;
    this.initFildsInfo();
    this.unsubUser = this.subUserList();
  }

  ngOnDestroy() {
    this.unsubUser();
  }

  ngAfterViewInit() {
    this.initializeFields();
  }

  ngOnInit(): void {
    this.createForm();
  }

  subUserList() {
    return onSnapshot(this.userListService.getUserDocRef('users', this.userId), (list: any) => {
      this.user = list.data();
      this.initializeUser();
    })
  }

  initFildsInfo() {
    this.initTitleInfo();
    this.initDescriptionInfo();
    this.initAssignedInfo();
    this.initDateInfo();
    this.initPrioInfo();
    this.initCategoryInfo();
    this.initSubtaskInfo();
  }

  getFormGroupOpenedTask() {
    if (this.modalControls.openedTask) {
      return {
        titleField: [this.modalControls.openedTask.title, [Validators.required]],
        descriptionField: [this.modalControls.openedTask.description, [Validators.required]],
        assignedField: ['', [Validators.required]],
        dateField: [this.modalControls.openedTask.date, [Validators.required]],
        prioField: [this.modalControls.openedTask.prio, [Validators.required]],
        categoryField: [this.modalControls.openedTask.category, [Validators.required]],
        subtasksField: ['']
      }
    } else {
      return '';
    }
  }

  initTitleInfo() {
    this.titleInfo = {
      field: undefined,
      warningText: '',
      isInvalid: false
    }
    this.allFieldsInfo.push(this.titleInfo);
  }

  initDescriptionInfo() {
    this.descriptionInfo = {
      field: undefined,
      warningText: '',
      isInvalid: false
    }
    this.allFieldsInfo.push(this.descriptionInfo);
  }

  initAssignedInfo() {
    this.assignedInfo = {
      warningText: '',
      isInvalid: false,
      taskAssigned: [],
      placeholderAssignedText: 'Select contacts to assign',
      isAssignedOptionsOpen: false,
      field: undefined
    }
    this.allFieldsInfo.push(this.assignedInfo);
  }

  initDateInfo() {
    this.dateInfo = {
      warningText: '',
      isInvalid: false,
      field: undefined
    }
    this.allFieldsInfo.push(this.dateInfo);
  }

  initPrioInfo() {
    this.prioInfo = {
      warningText: '',
      isInvalid: false
    }
    this.allFieldsInfo.push(this.prioInfo);
  }

  initCategoryInfo() {
    this.categoryInfo = {
      warningText: '',
      isInvalid: false,
      placeholderCategoryText: 'Select task category',
      isCategoryOptionsOpen: false,
      filteredCategoryList: undefined,
      categoryValue: '',
      field: undefined
    }
    if (this.modalControls.openedTask) {
      let categoryValue = this.modalControls.openedTask.category;
      this.addTaskFormular.patchValue({ assignedField: categoryValue });
      this.categoryInfo.categoryValue = this.modalControls.openedTask.category;
    }
    this.allFieldsInfo.push(this.categoryInfo);


  }

  initSubtaskInfo() {
    this.subtaskInfo = {
      isSubtaskOptionsOpen: false,
    }
    if (this.modalControls.openedTask) {
      this.subtaskInfo.isSubtaskOptionsOpen = true;
    }
  }

  initializeFields() {
    this.assignedInfo.field = this.assignedFieldRef.nativeElement;
    this.categoryInfo.field = this.categoryFieldRef.nativeElement;
    this.titleInfo.field = this.titleFieldRef.nativeElement;
    this.descriptionInfo.field = this.descriptionFieldRef.nativeElement;
    this.dateInfo.field = this.dateFieldRef.nativeElement;
  }

  async initializeUser() {
    this.setFilteredContacts();
    this.setFilteredCategory();
    this.filteredContacts();
    this.filteredCategorys();
    this.isUserLoaded = true;
  }

  setFilteredContacts() {
    this.user.contacts.forEach((contact: any) => {
      this.filteredContactList.push(contact);
    });
    if (this.modalControls.openedTask) {
      this.filteredContactList.forEach((contact: any) => {
        this.modalControls.openedTask.assigned.forEach((assigned: any) => {
          if (contact.id === assigned.id) {
            contact.isChecked = true;
            contact.isNotHidden = true;
          }
        });
      });
    }
    this.filteredContactList.sort((a: any, b: any) => a.name.localeCompare(b.name));
  }

  setFilteredCategory() {
    this.categoryInfo.filteredCategoryList = this.user.category.map((category: any) => {
      return { ...category, isNotHidden: false };
    });
    this.categoryInfo.filteredCategoryList.sort((a: any, b: any) => a.name.localeCompare(b.name));
  }

  createTask(characteristics:any) {
    if (this.formIsValid()) {
      this.disableFormElements(true);
      this.addTask(characteristics);
      this.disableFormElements(false);
      this.clearForm();
    }
  }

  formIsValid() {
    this.isFormValid = true;
    this.checkField(this.titleInfo, 'titleField');
    this.checkField(this.descriptionInfo, 'descriptionField');
    this.checkField(this.dateInfo, 'dateField');
    this.checkField(this.prioInfo, 'prioField');
    this.checkAssignedField();
    this.clearRequiredInfo(this.categoryInfo);
    let categoryInputValue = this.addTaskFormular.controls['categoryField'].value;
    if (this.categoryInfo.categoryValue.length == 0 && categoryInputValue.length == 0) {
      this.categoryInfo.warningText = 'This field is required';
      this.isFormValid = false;
      this.categoryInfo.isInvalid = !this.isFormValid;
    }
    return this.isFormValid;
  }

  disableFormElements(disabledValue: boolean) {
    this.allFieldsInfo.forEach((fieldInfo: any) => {
      if (fieldInfo.field) {
        fieldInfo.field.disabled = disabledValue;
      }
    });
  }

  async addTask(characteristics: any) {
    try {
      const newTask = this.getCreatedNewTask(characteristics);
      this.modalControls.showLoadingAnimation();
      await updateDoc(this.userListService.getUserDocRef('users', this.userId), {
        "tasks": this.getUpdatedTasks(newTask)
      });
      this.modalControls.showSuccessSymbolAndMessage();
    } catch (error) {
      this.showErrorMessageBox(error);
    } finally {
      this.modalControls.hideLoadingAnimation();
    }
  }

  clearForm() {
    this.createForm();
    this.clearAllRequiredInfo();
    this.filteredContactList.forEach((contact: Contact) => {
      contact.isChecked = false;
    });
    this.closeAssignedOptions();
    this.closeCategoryField();
    this.modalControls.subtaskList = [];
  }

  checkField(fieldInfo: any, fieldName: string) {
    this.clearRequiredInfo(fieldInfo);
    let value = this.addTaskFormular.controls[fieldName].value;
    if (this.isFieldEmpty(fieldName, value)) {
      this.showRequiredInfo(fieldInfo);
    }
  }

  checkAssignedField() {
    this.clearRequiredInfo(this.assignedInfo);
    this.assignedInfo.taskAssigned = [];
    this.filteredContactList.forEach((contact: Contact) => {
      if (contact.isChecked) {
        this.assignedInfo.taskAssigned.push(contact);
      }
    });
    if (this.assignedInfo.taskAssigned.length == 0) {
      this.showRequiredInfo(this.assignedInfo);
    }
  }

  clearRequiredInfo(fieldInfo: any) {
    fieldInfo.warningText = '';
    fieldInfo.isInvalid = false;
  }

  getCreatedNewTask(characteristics:any) {
    let categoryValue;
    if (this.categoryInfo.categoryValue.length == 0) {
      categoryValue = this.addTaskFormular.controls['categoryField'].value;
    } else {
      categoryValue = this.categoryInfo.categoryValue;
    }
    return {
      assigned: this.assignedInfo.taskAssigned,
      category: categoryValue,
      closedSubTasks: characteristics.closedSubTasks,
      color: characteristics.color,
      date: this.addTaskFormular.controls['dateField'].value,
      description: this.addTaskFormular.controls['descriptionField'].value,
      id: characteristics.id,
      prio: this.addTaskFormular.controls['prioField'].value,
      progress: characteristics.progress,
      status: characteristics.taskStatus,
      subTasks: this.modalControls.subtaskList,
      title: this.addTaskFormular.controls['titleField'].value
    };
  }

  showErrorMessageBox(message: any) {
    console.log(message);
  }

  getUpdatedTasks(newTask: Task) {
    let tasksUpdated: any = [];
    this.user.tasks.forEach((task: any) => {
      if (this.modalControls.openedTask) {
        if (task.id !== this.modalControls.openedTask.id) {
          tasksUpdated.push(task);
        }
      } else {
        tasksUpdated.push(task);
      }
    });
    tasksUpdated.push(newTask);
    return tasksUpdated;
  }

  createForm() {
    if (this.modalControls.openedTask) {
      this.addTaskFormular = this.formBuilder.group(this.formGroupOpenedTask);
    } else {
      this.modalControls.resetTaskCharacteristics(this.modalControls.taskStatus);
      this.addTaskFormular = this.formBuilder.group(this.formGroup);
    }
  }

  clearAllRequiredInfo() {
    this.allFieldsInfo.forEach((fieldInfo: any) => {
      this.clearRequiredInfo(fieldInfo);
    });
  }

  closeAssignedOptions() {
    this.restoreAssignedPlaceholder();
    this.assignedInfo.isAssignedOptionsOpen = false;
  }

  closeCategoryField() {
    this.categoryInfo.categoryValue = '';
    this.addTaskFormular.patchValue({ categoryField: ''});
    this.categoryInfo.placeholderCategoryText = 'Select task category';
    this.categoryInfo.isCategoryOptionsOpen = false;
  }

  isFieldEmpty(field: string, value: string) {
    return this.addTaskFormular.controls[field].errors && value.length == 0;
  }

  showRequiredInfo(fieldInfo: any) {
    fieldInfo.warningText = 'This field is required';
    this.isFormValid = false;
    fieldInfo.isInvalid = !this.isFormValid;
  }

  getCreatedSubtasks() {
    let newSubtasks: any = [];
    this.modalControls.subtaskList.forEach((subtask: any) => {
      let newSubtask = {
        status: subtask.status,
        value: subtask.value
      };
      newSubtasks.push(newSubtask);
    });
    return newSubtasks;
  }

  restoreAssignedPlaceholder() {
    this.addTaskFormular.patchValue({ assignedField: '' });
    let inputAssignedValue = this.addTaskFormular.controls['assignedField'].value;
    if (!inputAssignedValue || inputAssignedValue.length == 0) {
      this.assignedInfo.placeholderAssignedText = 'Select contacts to assign';
    }
  }

  openAssignedOptions() {
    this.clearAssignedPlaceholder();
    this.clearRequiredInfo(this.assignedInfo);
    this.assignedInfo.field.focus();
    this.assignedInfo.isAssignedOptionsOpen = true;
    this.filteredContactList = this.getFilteredContactList('');
  }

  clearAssignedPlaceholder() {
    this.assignedInfo.placeholderAssignedText = '';
  }

  getFilteredContactList(inputValue: string) {
    return this.filteredContactList.map((contact: any) => {
      const matches = contact.name.toLowerCase().startsWith(inputValue.toLowerCase());
      return { ...contact, isNotHidden: matches };
    });
  }

  getFilteredCategoryList(inputValue: string) {
    return this.categoryInfo.filteredCategoryList.map((category: any) => {
      const matches = category.name.toLowerCase().startsWith(inputValue.toLowerCase());
      return { ...category, isNotHidden: matches };
    });
  }

  filteredContacts() {
    let inputAssignedValue = this.addTaskFormular.controls['assignedField'].value;
    this.filteredContactList = this.getFilteredContactList(inputAssignedValue);
  }

  filteredCategorys() {
    let categoryValue = this.addTaskFormular.controls['categoryField'].value;
    this.categoryInfo.filteredCategoryList = this.getFilteredCategoryList(categoryValue);
    this.categoryInfo.categoryValue = '';
  }

  chooseAssigned(contact: any) {
    contact.isChecked = !contact.isChecked;
  }

  choosePrio() {
    this.clearRequiredInfo(this.prioInfo);
  }

  openCategoryOptions() {
    this.clearCategoryPlaceholder();
    this.categoryInfo.field.focus();
    this.categoryInfo.isCategoryOptionsOpen = true;
    this.categoryInfo.filteredCategoryList = this.getFilteredCategoryList('');
  }

  clearCategoryPlaceholder() {
    this.categoryInfo.placeholderCategoryText = '';
  }

  closeCategoryOptions() {
    this.restoreCategoryPlaceholder();
    this.categoryInfo.isCategoryOptionsOpen = false;
  }

  restoreCategoryPlaceholder() {
    this.addTaskFormular.patchValue({ categoryField: '' });
    let categoryValue = this.addTaskFormular.controls['categoryField'].value;
    if (!categoryValue || categoryValue.length == 0) {
      this.categoryInfo.placeholderCategoryText = 'Select task category';
    }
  }

  chooseCategory(categoryValue: string) {
    this.clearRequiredInfo(this.categoryInfo);
    this.categoryInfo.categoryValue = categoryValue;
    this.addTaskFormular.patchValue({ categoryField: categoryValue});
    this.categoryInfo.placeholderCategoryText = categoryValue;
    this.categoryInfo.isCategoryOptionsOpen = false;
  }

  addSubtask() {
    let subtaskValue = this.addTaskFormular.controls['subtasksField'].value;
    if (subtaskValue.length > 0) {
      this.modalControls.subtaskList.push({ value: subtaskValue, isEditOpen: false, status: 'opened' })
    }
    if (this.modalControls.subtaskList.length > 0) {
      this.subtaskInfo.isSubtaskOptionsOpen = true;
    }
    this.addTaskFormular.patchValue({ subtasksField: '' });
  }

  deleteSubtask(subtask: any) {
    this.modalControls.subtaskList.forEach((item:any, index:any) => {
      if (item.value === subtask.value) {
        this.modalControls.subtaskList.splice(index, 1);
      }
    });
    if (this.modalControls.subtaskList.length == 0) {
      this.subtaskInfo.isSubtaskOptionsOpen = false;
    }
  }

  editSubtask(subtask: any) {
    this.createFormWithSubtask();
    subtask.isEditOpen = true;
  }

  changeSubtask(subtask: any) {
    let newName = this.addTaskFormular.controls[subtask.value].value;
    subtask.value = newName;
    subtask.isEditOpen = false;
  }

  createFormWithSubtask() {
    this.addTaskFormular = this.formBuilder.group(this.getFormGroupWithSubtask());
  }

  getFormGroupWithSubtask() {
    let formControls: any = {
      titleField: [this.titleInfo.field.value, [Validators.required]],
      descriptionField: [this.descriptionInfo.field.value, [Validators.required]],
      assignedField: ['', [Validators.required]],
      dateField: [this.dateInfo.field.value, [Validators.required]],
      prioField: [this.addTaskFormular.controls['prioField'].value, [Validators.required]],
      categoryField: ['', [Validators.required]],
      subtasksField: ['']
    };
    for (const subtask of this.modalControls.subtaskList) {
      formControls[subtask.value] = [subtask.value];
    }
    return formControls;
  }

  async addNewCategory() {
    const categoryValue = this.addTaskFormular.controls['categoryField'].value;
    if (categoryValue.length > 0) {
      try {
        this.addTaskFormular.patchValue({ categoryField: '' });
        const newCategory = this.getCreatedNewCategory(categoryValue);
        this.modalControls.showLoadingAnimation();
        await updateDoc(this.userListService.getUserDocRef('users', this.userId), {
          "category": this.getUpdatedCategory(newCategory)
        });
        this.modalControls.showSuccessCategoryMessage();
      } catch (error) {
        this.showErrorMessageBox(error);
      } finally {
        this.modalControls.hideLoadingAnimationCategory();
        this.filteredCategorys();
      }
    }

  }

  getCreatedNewCategory(value: any) {
    return {
      name: value
    }
  }

  getUpdatedCategory(newCategory: any) {
    let categoryUpdated: any = [];
    this.user.category.forEach((category: any) => {
      categoryUpdated.push(category);
    });
    categoryUpdated.push(newCategory);
    return categoryUpdated;
  }
}
