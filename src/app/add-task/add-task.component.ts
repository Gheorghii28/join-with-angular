import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent {

  userId: any;
  addTaskFormular: FormGroup = new FormGroup({});

  titleWarningText: string = '';
  isTitleInvalid: boolean = false;

  descriptionWarningText: string = '';
  isDescriptionInvalid: boolean = false;

  assignedWarningText: string = '';
  isAssignedInvalid: boolean = false;

  dateWarningText: string = '';
  isDateInvalid: boolean = false;

  categoryWarningText: string = '';
  isCategoryInvalid: boolean = false;

  subtasksWarningText: string = '';
  isSubtasksInvalid: boolean = false;

  prioWarningText: string = '';

  minDate: Date;
  maxDate: Date;

  dayNames: string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  monthNames: string[] = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  currentDate: Date = new Date();

  currentYear: number;
  currentMonth: number;
  currentMonthName: string;
  calendarDays: any[] = [];

  inputAssignedValue: string = '';
  placeholderAssignedText: string = 'Select contacts to assign';
  isInputAssignedActive: boolean = false;

  inputCategoryValue: string = '';
  placeholderCategoryText: string = 'Select task category';
  isInputCategoryActive: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe
  ) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 20, 0, 1);
    this.maxDate = new Date(currentYear + 1, 11, 31);

    this.currentYear = this.currentDate.getFullYear();
    this.currentMonth = this.currentDate.getMonth() + 1;
    this.currentMonthName = this.monthNames[this.currentMonth - 1];
    this.updateCalendar();
  }

  ngOnInit(): void {
    this.initializeUserId();
    this.addTaskFormular = this.formBuilder.group({
      titleField: ['', [Validators.required]],
      descriptionField: ['', [Validators.required]],
      assignedField: ['', [Validators.required]],
      dateField: ['', [Validators.required]],
      categoryField: ['', [Validators.required]],
      subtasksField: ['', [Validators.required]]
    });
  }

  initializeUserId() {
    const storedValue = localStorage.getItem('id-key');
    this.userId = storedValue ? JSON.parse(storedValue) : null;
  }

  closeForm() {

  }

  prevMonth(): void {
    if (this.currentMonth === 1) {
      this.currentMonth = 12;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.updateCalendar();
  }

  nextMonth(): void {
    if (this.currentMonth === 12) {
      this.currentMonth = 1;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.updateCalendar();
  }

  updateCalendar(): void {
    this.calendarDays = [];

    const today = new Date();
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth - 1, 1);
    const lastDayOfMonth = new Date(this.currentYear, this.currentMonth, 0);
    const numDaysInMonth = lastDayOfMonth.getDate();
    this.currentMonthName = this.monthNames[this.currentMonth - 1];

    for (let i = 0; i < firstDayOfMonth.getDay(); i++) {
      this.calendarDays.push('');
    }

    for (let i = 1; i <= numDaysInMonth; i++) {
      const date = new Date(this.currentYear, this.currentMonth - 1, i);
      const dayOfWeek = date.getDay();
      const isToday = this.isToday(date);
      const isNotActive = this.isDateNotActive(date, today);

      this.calendarDays.push({ day: i, dayOfWeek, isToday, isNotActive });
    }
    console.log(this.calendarDays);

  }

  isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  isDateNotActive(date: any, today: any) {
    let isNotActive = true;
    today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    if (date >= today) {
      isNotActive = false;
    }
    return isNotActive;
  }

  clearAssignedPlaceholder() {
    this.placeholderAssignedText = '';
    this.isInputAssignedActive = true;
  }

  restoreAssignedPlaceholder() {
    if (!this.inputAssignedValue) {
      this.placeholderAssignedText = 'Select contacts to assign';
    }
    this.isInputAssignedActive = false;
  }

  clearCategoryPlaceholder() {
    this.isInputCategoryActive = true;
  }

  restoreCategoryPlaceholder() {
    this.isInputCategoryActive = false;
  }

}