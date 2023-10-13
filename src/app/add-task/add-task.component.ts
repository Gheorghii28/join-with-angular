import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Contact, Task, User } from '../interfaces/user.interface';
import { UsersListServices } from '../services/firebase-services/users-list.services';
import { DataServices } from '../services/data-services/data.services';
import { updateDoc } from '@firebase/firestore';



@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent implements OnInit {

  user!: User;
  userId: any;
  isUserLoaded: boolean = false;
  addTaskFormular: FormGroup = new FormGroup({});
  filteredContactList: any;
  titleInfo: any;
  descriptionInfo: any;
  assignedInfo: any;
  dateInfo: any;
  prioInfo: any;
  categoryInfo: any;
  subtaskInfo: any;
  allFieldsInfo: any = [];
  subtaskList: { name: string, isEditOpen: boolean }[] = [];
  formGroup: any = {
    titleField: ['', [Validators.required]],
    descriptionField: ['', [Validators.required]],
    assignedField: ['', [Validators.required]],
    dateField: ['', [Validators.required]],
    prioField: ['', [Validators.required]],
    categoryField: ['', [Validators.required]],
    subtasksField: ['']
  }
  currentDate: string = new Date().toISOString().split('T')[0];
  resultInfoContainer: any;
  formResult: any;

  @ViewChild('assignedField') assignedFieldRef!: ElementRef;
  @ViewChild('categoryField') categoryFieldRef!: ElementRef;
  @ViewChild('titleField') titleFieldRef!: ElementRef;
  @ViewChild('descriptionField') descriptionFieldRef!: ElementRef;
  @ViewChild('dateField') dateFieldRef!: ElementRef;
  @ViewChild('sendResultInfo') sendResultInfo!: ElementRef;
  @ViewChild('formResultInfo') formResultInfo!: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private userListService: UsersListServices,
    private dataService: DataServices,
    private renderer: Renderer2
  ) {
    this.initFildsInfo();
  }

  ngAfterViewInit() {
    this.initializeFields();
    this.resultInfoContainer = this.sendResultInfo.nativeElement;
    this.formResult = this.formResultInfo.nativeElement;
  }

  ngOnInit(): void {
    this.initializeUserId();
    this.createForm();
    this.initializeUser();
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
      inputAssignedValue: '',
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
      inputCategoryValue: '',
      placeholderCategoryText: 'Select task category',
      isCategoryOptionsOpen: false,
      filteredCategoryList: undefined,
      categoryValue: '',
      field: undefined
    }
    this.allFieldsInfo.push(this.categoryInfo);
  }

  initSubtaskInfo() {
    this.subtaskInfo = {
      isSubtaskOptionsOpen: false,
      inputSubtaskValue: '',
    }
  }

  createForm() {
    this.addTaskFormular = this.formBuilder.group(this.formGroup);
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
    for (const subtask of this.subtaskList) {
      formControls[subtask.name] = [subtask.name];
    }
    return formControls;
  }

  initializeUserId() {
    const storedValue = localStorage.getItem('id-key');
    this.userId = storedValue ? JSON.parse(storedValue) : null;
  }

  initializeFields() {
    this.assignedInfo.field = this.assignedFieldRef.nativeElement;
    this.categoryInfo.field = this.categoryFieldRef.nativeElement;
    this.titleInfo.field = this.titleFieldRef.nativeElement;
    this.descriptionInfo.field = this.descriptionFieldRef.nativeElement;
    this.dateInfo.field = this.dateFieldRef.nativeElement;
  }

  async initializeUser() {
    this.user = await this.userListService.fetchUserData('users', this.userId);
    this.setFilteredContacts();
    this.setFilteredCategory();
    this.filteredContacts();
    this.filteredCategorys();
    this.isUserLoaded = true;
  }

  setFilteredContacts() {
    this.filteredContactList = this.user.contacts.map(contact => {
      return { ...contact, isNotHidden: false };
    });
    this.filteredContactList.sort((a: any, b: any) => a.name.localeCompare(b.name));
  }

  setFilteredCategory() {
    this.categoryInfo.filteredCategoryList = this.user.category.map((category: any) => {
      return { ...category, isNotHidden: false };
    });
    this.filteredContactList.sort((a: any, b: any) => a.name.localeCompare(b.name));
  }

  filteredContacts() {
    this.filteredContactList = this.getFilteredContactList(this.assignedInfo.inputAssignedValue);
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

  chooseAssigned(contact: any) {
    contact.isChecked = !contact.isChecked;
  }

  createTask() {
    if (this.formIsValid()) {
      this.disableFormElements(true);
      this.addTask();
      this.disableFormElements(false);
      this.clearForm();
    }
  }

  disableFormElements(disabledValue: boolean) {
    this.allFieldsInfo.forEach((fieldInfo:any) => {
      if(fieldInfo.field) {
        fieldInfo.field.disabled = disabledValue;
      }
    });
  }

  async addTask() {
    try {
      const newTask = this.getCreatedNewTask();
      this.showLoadingAnimation();
      await updateDoc(this.userListService.getUserDocRef('users', this.userId), {
        "tasks": this.getUpdatedTasks(newTask)
      });
      this.showSuccessSymbolAndMessage();
    } catch (error) {
      this.showErrorMessageBox(error);
    } finally {
      this.hideLoadingAnimation();
    }
  }

  showLoadingAnimation() {
    this.renderer.addClass(this.formResult, 'form-result-info');
    this.renderer.addClass(this.resultInfoContainer, 'show-form-load-animation');
  }

  showSuccessSymbolAndMessage() {
    this.renderer.removeClass(this.resultInfoContainer, 'show-form-load-animation');
    this.renderer.addClass(this.resultInfoContainer, 'show-form-succes-message');
  }

  showErrorMessageBox(message: any) {
    console.log(message);
  }

  hideLoadingAnimation() {
    this.renderer.addClass(this.formResult, 'opacity-null');
    setTimeout(() => {
      this.renderer.removeClass(this.formResult, 'form-result-info');
      this.renderer.removeClass(this.resultInfoContainer, 'show-form-load-animation');
      this.renderer.removeClass(this.resultInfoContainer, 'show-form-succes-message');
      this.renderer.removeClass(this.resultInfoContainer, 'show-form-error-message');
      this.renderer.removeClass(this.formResult, 'opacity-null');
    }, 2000);
  }

  getCreatedSubtasks() {
    let newSubtasks: any = [];
    this.subtaskList.forEach((subtask: any) => {
      let newSubtask = {
        status: 'opened',
        value: subtask.name
      };
      newSubtasks.push(newSubtask);
    });
    return newSubtasks;
  }

  getUpdatedTasks(newTask: Task) {
    let tasksUpdated = this.user.tasks;
    tasksUpdated.push(newTask);
    return tasksUpdated;
  }

  getCreatedNewTask() {
    return {
      assigned: this.assignedInfo.taskAssigned,
      category: this.categoryInfo.categoryValue,
      closedSubTasks: 0,
      color: this.dataService.getRandomRGBColor(),
      date: this.addTaskFormular.controls['dateField'].value,
      description: this.addTaskFormular.controls['descriptionField'].value,
      id: new Date().getTime(),
      prio: this.addTaskFormular.controls['prioField'].value,
      progress: 0,
      status: 'in-progress',
      subTasks: this.getCreatedSubtasks(),
      title: this.addTaskFormular.controls['titleField'].value
    };
  }

  addSubtask() {
    if (this.subtaskInfo.inputSubtaskValue.length > 0) {
      this.subtaskList.push({ name: this.subtaskInfo.inputSubtaskValue, isEditOpen: false })
    }
    if (this.subtaskList.length > 0) {
      this.subtaskInfo.isSubtaskOptionsOpen = true;
    }
    this.addTaskFormular.patchValue({ subtasksField: '' });
  }

  deleteSubtask(subtask: any) {
    this.subtaskList.forEach((item, index) => {
      if (item.name === subtask.name) {
        this.subtaskList.splice(index, 1);
      }
    });
  }

  editSubtask(subtask: any) {
    this.createFormWithSubtask();
    subtask.isEditOpen = true;
  }

  changeSubtask(subtask: any) {
    let formGroup = this.formBuilder.group(this.getFormGroupWithSubtask());
    let newName = formGroup.controls[subtask.name].value;
    subtask.name = newName;
    subtask.isEditOpen = false;
  }

  checkField(isValid: boolean, fieldInfo: any, fieldName: string) {
    this.clearRequiredInfo(fieldInfo);
    let value = this.addTaskFormular.controls[fieldName].value;
    if (this.isFieldEmpty(fieldName, value)) {
      this.showRequiredInfo(fieldInfo, isValid);
    }
  }

  checkAssignedField(isValid: boolean) {
    this.clearRequiredInfo(this.assignedInfo);
    this.assignedInfo.taskAssigned = [];
    this.filteredContactList.forEach((contact: Contact) => {
      if (contact.isChecked) {
        this.assignedInfo.taskAssigned.push(contact);
      }
    });
    if (this.assignedInfo.taskAssigned.length == 0) {
      this.showRequiredInfo(this.assignedInfo, isValid);
    }
  }

  formIsValid() {
    let isValid = true;
    this.checkField(isValid, this.titleInfo, 'titleField');
    this.checkField(isValid, this.descriptionInfo, 'descriptionField');
    this.checkField(isValid, this.dateInfo, 'dateField');
    this.checkField(isValid, this.prioInfo, 'prioField');
    this.checkAssignedField(isValid);
    this.clearRequiredInfo(this.categoryInfo);
    if (this.categoryInfo.categoryValue.length == 0) {
      this.categoryInfo.warningText = 'This field is required';
      isValid = false;
      this.categoryInfo.isInvalid = !isValid;
    }

    return isValid;
  }

  showRequiredInfo(fieldInfo:any, isValid:boolean) {
    fieldInfo.warningText = 'This field is required';
    isValid = false;
    fieldInfo.isInvalid = !isValid;
  }

  clearAllRequiredInfo() {
    this.allFieldsInfo.forEach((fieldInfo: any) => {
      this.clearRequiredInfo(fieldInfo);
    });
  }

  clearRequiredInfo(fieldInfo: any) {
    fieldInfo.warningText = '';
    fieldInfo.isInvalid = false;
  }

  clearForm() {
    this.createForm();
    this.clearAllRequiredInfo();
    this.filteredContactList.forEach((contact: Contact) => {
      contact.isChecked = false;
    });
    this.closeAssignedOptions();
    this.closeCategoryField();
    this.subtaskList = [];
  }

  closeCategoryField() {
    this.categoryInfo.categoryValue = '';
    this.categoryInfo.inputCategoryValue = '';
    this.categoryInfo.placeholderCategoryText = 'Select task category';
    this.categoryInfo.isCategoryOptionsOpen = false;
  }

  choosePrio() {
    this.clearRequiredInfo(this.prioInfo);
  }

  isFieldEmpty(field: string, value: string) {
    return this.addTaskFormular.controls[field].errors && value.length == 0;
  }

  openAssignedOptions() {
    this.clearAssignedPlaceholder();
    this.clearRequiredInfo(this.assignedInfo);
    this.assignedInfo.field.focus();
    this.assignedInfo.isAssignedOptionsOpen = true;
    this.filteredContactList = this.getFilteredContactList('');
  }

  closeAssignedOptions() {
    this.restoreAssignedPlaceholder();
    this.assignedInfo.isAssignedOptionsOpen = false;
  }

  clearAssignedPlaceholder() {
    this.assignedInfo.placeholderAssignedText = '';
  }

  restoreAssignedPlaceholder() {
    this.addTaskFormular.patchValue({ assignedField: '' });
    if (!this.assignedInfo.inputAssignedValue || this.assignedInfo.inputAssignedValue.length == 0) {
      this.assignedInfo.placeholderAssignedText = 'Select contacts to assign';
    }
  }

  openCategoryOptions() {
    this.clearCategoryPlaceholder();
    this.categoryInfo.field.focus();
    this.categoryInfo.isCategoryOptionsOpen = true;
    this.categoryInfo.filteredCategoryList = this.getFilteredCategoryList('');
  }

  closeCategoryOptions() {
    this.restoreCategoryPlaceholder();
    this.categoryInfo.isCategoryOptionsOpen = false;
  }

  filteredCategorys() {
    this.categoryInfo.filteredCategoryList = this.getFilteredCategoryList(this.categoryInfo.inputCategoryValue);
    this.categoryInfo.categoryValue = '';
  }

  clearCategoryPlaceholder() {
    this.categoryInfo.placeholderCategoryText = '';
  }

  restoreCategoryPlaceholder() {
    this.addTaskFormular.patchValue({ categoryField: '' });
    if (!this.categoryInfo.inputCategoryValue || this.categoryInfo.inputCategoryValue.length == 0) {
      this.categoryInfo.placeholderCategoryText = 'Select task category';
    }
  }

  chooseCategory(categoryValue: string) {
    this.clearRequiredInfo(this.categoryInfo);
    this.categoryInfo.categoryValue = categoryValue;
    this.categoryInfo.inputCategoryValue = categoryValue;
    this.categoryInfo.placeholderCategoryText = categoryValue;
    this.categoryInfo.isCategoryOptionsOpen = false;
  }
}