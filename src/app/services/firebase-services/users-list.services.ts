import { Injectable, inject } from "@angular/core";
import { Firestore, collection, doc, getDoc, onSnapshot } from "@angular/fire/firestore";

@Injectable({
    providedIn: 'root'
})
export class UsersListServices {

    firestore: Firestore = inject(Firestore);
    unsubUsersList;
    userList: any = [];
    user: any;
    userId: any;

    constructor() {
        this.unsubUsersList = onSnapshot(this.getUsersRef(), list => {
            this.getUserList(list);
        });
    }

    getUsersRef() {
        return collection(this.firestore, 'users');
    }

    getUserDocRef(colId: string, docId: string) {
        return doc(collection(this.firestore, colId), docId);
    }

    getUserList(list: any) {
        list.forEach((user: any) => {
            const userObj = user.data();
            userObj['userId'] = user.id;
            this.userList.push(userObj);
        });
    }
}