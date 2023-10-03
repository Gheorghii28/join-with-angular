import { Injectable, inject } from "@angular/core";
import { Firestore, collection, doc, getDoc, onSnapshot } from "@angular/fire/firestore";

@Injectable({
    providedIn: 'root'
})
export class UsersListServices {

    firestore: Firestore = inject(Firestore);
    unsubUsersList;
    userList: any = [];
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

    async fetchUserData(colId:any, docId:string): Promise<any> {
        const docRef = this.getUserDocRef(colId, docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            console.log("No such document!");
            return null; 
        }
    }
}