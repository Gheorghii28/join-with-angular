import { Component, Input } from '@angular/core';
import { UsersListServices } from '../services/firebase-services/users-list.services';
import { onSnapshot } from '@firebase/firestore';
import { DataServices } from '../services/data-services/data.services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  user:any;
  userId: any;
  userInitials:any;
  unsubUser;
  submenuShow:boolean = false;

  constructor(
    private userListService: UsersListServices,
    private dataService: DataServices
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
      this.userInitials = this.dataService.getInitials(this.user.name);
    })
  }

  reloadPage() {
    window.location.reload();
  }

  toggleSubmenu() {
    this.submenuShow = !this.submenuShow;
  }
}
