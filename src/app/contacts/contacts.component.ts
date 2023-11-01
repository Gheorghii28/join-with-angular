import { Component } from '@angular/core';
import { onSnapshot } from '@angular/fire/firestore';
import { UsersListServices } from '../services/firebase-services/users-list.services';
import { ModalsControls } from '../services/modal-controls/modals.controls';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent {

  unsubUser;
  userId: any;
  user: any;
  isUserLoaded: boolean = false;
  filteredContactList: any;
  groupedContacts: any;
  isContactInfoDispayed: boolean = false;

  testContact: any;

  constructor(
    private userListService: UsersListServices,
    public modalControls: ModalsControls
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
      this.initializeUser();
    })
  }

  async initializeUser() {
    this.setFilteredContacts();
    this.isUserLoaded = true;

  }

  setFilteredContacts() {
    this.filteredContactList = this.user.contacts.map((contact: any) => {
      return { ...contact };
    });
    this.filteredContactList.sort((a: any, b: any) => a.name.localeCompare(b.name));
    this.setgroupedContacts();
  }

  setgroupedContacts() {
    this.groupedContacts = this.filteredContactList.reduce((result: any, contact: any) => {
      const firstLetter = contact.name[0].toUpperCase();
      const existingObject = result.find((obj: any) => obj.letter === firstLetter);
      if (existingObject) {
        existingObject.contacts.push(contact);
      } else {
        result.push({
          letter: firstLetter,
          contacts: [contact]
        });
      }
      return result;
    }, []);
    this.testContact = this.groupedContacts[5].contacts[0];
  }

  chooseAssigned(contact: any) {
    contact.isChecked = !contact.isChecked;
  }

  showContactInfo(contact: any) {
    this.modalControls.displayedContact = contact;
    this.isContactInfoDispayed = true;
  }

  showContainerBtns() {
    this.modalControls.displayedContainerBtns = true;
  }

  hiddenContainerBtns() {
    this.modalControls.displayedContainerBtns = false;
  }

  toContactList() {
    this.modalControls.displayedContact = undefined;
    this.isContactInfoDispayed = false;
  }

  deleteContact(contact: any) {

  }
}
