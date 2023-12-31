import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class DataServices {

    firstNameArr: any = ["Adam", "Alex", "Aaron", "Ben", "Carl", "Dan", "David", "Edward", "Fred", "Frank", "George", "Hal", "Hank", "Ike", "John", "Jack", "Joe", "Larry", "Monte", "Matthew", "Mark", "Nathan", "Otto", "Paul", "Peter", "Roger", "Roger", "Steve", "Thomas", "Tim", "Ty", "Victor", "Walter"];
    lastNameArr: any = ["Anderson", "Ashwoon", "Aikin", "Bateman", "Bongard", "Bowers", "Boyd", "Cannon", "Cast", "Deitz", "Dewalt", "Ebner", "Frick", "Hancock", "Haworth", "Hesch", "Hoffman", "Kassing", "Knutson", "Lawless", "Lawicki", "Mccord", "McCormack", "Miller", "Myers", "Nugent", "Ortiz", "Orwig", "Ory", "Paiser", "Pak", "Pettigrew", "Quinn", "Quizoz", "Ramachandran", "Resnick", "Sagar", "Schickowski", "Schiebel", "Sellon", "Severson", "Shaffer", "Solberg", "Soloman", "Sonderling", "Soukup", "Soulis", "Stahl", "Sweeney", "Tandy", "Trebil", "Trusela", "Trussel", "Turco", "Uddin", "Uflan", "Ulrich", "Upson", "Vader", "Vail", "Valente", "Van Zandt", "Vanderpoel", "Ventotla", "Vogal", "Wagle", "Wagner", "Wakefield", "Weinstein", "Weiss", "Woo", "Yang", "Yates", "Yocum", "Zeaser", "Zeller", "Ziegler", "Bauer", "Baxster", "Casal", "Cataldi", "Caswell", "Celedon", "Chambers", "Chapman", "Christensen", "Darnell", "Davidson", "Davis", "DeLorenzo", "Dinkins", "Doran", "Dugelman", "Dugan", "Duffman", "Eastman", "Ferro", "Ferry", "Fletcher", "Fietzer", "Hylan", "Hydinger", "Illingsworth", "Ingram", "Irwin", "Jagtap", "Jenson", "Johnson", "Johnsen", "Jones", "Jurgenson", "Kalleg", "Kaskel", "Keller", "Leisinger", "LePage", "Lewis", "Linde", "Lulloff", "Maki", "Martin", "McGinnis", "Mills", "Moody", "Moore", "Napier", "Nelson", "Norquist", "Nuttle", "Olson", "Ostrander", "Reamer", "Reardon", "Reyes", "Rice", "Ripka", "Roberts", "Rogers", "Root", "Sandstrom", "Sawyer", "Schlicht", "Schmitt", "Schwager", "Schutz", "Schuster", "Tapia", "Thompson", "Tiernan", "Tisler"];
    categoryArr: any = [{ name: 'Technical Task' }, { name: 'User Story' }, { name: 'Frontend' }, { name: 'Backend' }, { name: 'Design' }];
    contacts: any = [];

    createUser(name: string, email: string, password: string) {
        this.createContacts();
        const tasks = this.createTasks();
        return {
            name: name,
            email: email,
            password: password,
            contacts: this.contacts,
            tasks: tasks,
            category: this.categoryArr
        }
    }

    createContacts() {
        for (let i = 0; i < 20; i++) {
            const contact = this.generateRandomContact(i, false);
            this.contacts.push(contact);
        }
    }

    generateRandomContact(i: number, booleanValue: boolean) {
        const firstName = this.generateFirstName();
        const lasttName = this.generateLastName();
        const contactName = `${firstName} ${lasttName}`;
        const contactEmail = `${firstName.toLowerCase()}${lasttName.toLowerCase()}@gmail.com`;
        const contactPhone = this.generateRandomPhone();
        const contactColor = this.getRandomRGBColor();
        const contactInitials = this.getInitials(contactName);
        const contact = this.contactObj(i, contactName, contactEmail, contactPhone, contactColor, contactInitials, booleanValue);
        return contact;
    }

    generateFirstName() {
        return this.firstNameArr[Math.floor(Math.random() * this.firstNameArr.length)];
    }

    generateLastName() {
        return this.lastNameArr[Math.floor(Math.random() * this.lastNameArr.length)];
    }

    generateRandomPhone() {
        const phone = `00491${Math.floor(Math.random() * 100000000)}`;
        return phone;
    }

    getRandomRGBColor() {
        const red = Math.floor(Math.random() * 256);
        const green = Math.floor(Math.random() * 256);
        const blue = Math.floor(Math.random() * 256);
        return `rgb(${red}, ${green}, ${blue})`;
    }

    getInitials(name: any) {
        const words = name.split(" ");
        const initials = words.map((word: any) => word.charAt(0));
        return initials.join("");
    }

    contactObj(i: number, contactName: string, contactEmail: string, contactPhone: string, contactColor: string, contactInitials: string, booleanValue: boolean) {
        return {
            id: i,
            isChecked: booleanValue,
            name: contactName,
            email: contactEmail,
            phone: contactPhone,
            color: contactColor,
            initials: contactInitials,
            isNotHidden: booleanValue
        }
    }

    createTasks() {
        const tasks:any = [];
        const currentDate = new Date();
        const twoDaysLater = new Date();
        const threeDaysLater = new Date(currentDate);
        const fourDaysLater = new Date(currentDate);
        twoDaysLater.setDate(currentDate.getDate() + 2);
        threeDaysLater.setDate(currentDate.getDate() + 3);
        fourDaysLater.setDate(currentDate.getDate() + 4);
        tasks.push(this.task1(currentDate));
        tasks.push(this.task2(twoDaysLater));
        tasks.push(this.task3(fourDaysLater));
        tasks.push(this.task4(threeDaysLater));
        tasks.push(this.task5(twoDaysLater));
        tasks.push(this.task6(fourDaysLater));
        return tasks;
    }

    task1(currentDate:any) {
        const id = new Date().getTime();
        return {
            assigned: [this.contacts[1], this.contacts[2]],
            color: "rgb(122, 184, 255)",
            category: "Frontend",
            date: this.formatDate(currentDate),
            description: "Erstellen Sie eine responsive Benutzeroberfläche für die Startseite des Projekts mit HTML, CSS und JavaScript.",
            prio: "urgent",
            subTasks: [
                {
                    value: "Header design",
                    status: "opened"
                },
                {
                    value: "Navigation implementieren",
                    status: "closed"
                },
                {
                    value: "Footer design",
                    status: "closed"
                }
            ],
            title: "Startseite-Design",
            status: "in-progress",
            id: 1001,
            closedSubTasks: 2,
            progress: 66.66
        }
    }

    task2(twoDaysLater:any) {
        const id = new Date().getTime();
        return {
            assigned: [this.contacts[10], this.contacts[12]],
            color: "rgb(255, 122, 0)",
            category: "Design",
            date: this.formatDate(twoDaysLater),
            description: "Entwerfen Sie das Logo und die Icons für die Anwendung basierend auf den bereitgestellten Anforderungen und Designrichtlinien.",
            prio: "medium",
            subTasks: [
                {
                    value: "Logo sketches",
                    status: "closed"
                },
                {
                    value: "Icon design",
                    status: "opened"
                }
            ],
            title: "Logo-Design",
            status: "to-do",
            id: 1002,
            closedSubTasks: 1,
            progress: 50
        }
    }

    task3(fourDaysLater:any) {
        const id = new Date().getTime();
        return {
            assigned: [this.contacts[4], this.contacts[11]],
            color: "rgb(255, 154, 87)",
            category: "Backend",
            date: this.formatDate(fourDaysLater),
            description: "Entwickeln Sie die Server-APIs und Datenbankabfragen für die Benutzerregistrierung und -authentifizierung.",
            prio: "low",
            subTasks: [
                {
                    value: "API endpoints",
                    status: "opened"
                },
                {
                    value: "Database setup",
                    status: "opened"
                }
            ],
            title: "Benutzerverwaltung",
            status: "done",
            id: 1003,
            closedSubTasks: 0,
            progress: 0
        }
    }

    task4(threeDaysLater:any) {
        const id = new Date().getTime();
        return {
            assigned: [this.contacts[8]],
            color: "rgb(122, 184, 255)",
            category: "Frontend",
            date: this.formatDate(threeDaysLater),
            description: "Entwickeln Sie interaktive Benutzerkomponenten und führen Sie Frontend-Tests durch, um sicherzustellen, dass die Anwendung reibungslos funktioniert.",
            prio: "low",
            subTasks: [],
            title: "Frontend-Entwicklung",
            status: "in-progress",
            id: 1004,
            closedSubTasks: 0,
            progress: 0
        }
    }

    task5(twoDaysLater:any) {
        const id = new Date().getTime();
        return {
            assigned: [this.contacts[15]],
            color: "rgb(255, 122, 0)",
            category: "Design",
            date: this.formatDate(twoDaysLater),
            description: "Erstellen Sie Wireframes und Prototypen für die wichtigsten Seiten und Funktionen der Anwendung.",
            prio: "medium",
            subTasks: [],
            title: "Wireframes & Prototypen",
            status: "to-do",
            id: 1005,
            closedSubTasks: 0,
            progress: 0
        }
    }

    task6(fourDaysLater:any) {
        const id = new Date().getTime();
        return {
            assigned: [this.contacts[14]],
            color: "rgb(255, 154, 87)",
            category: "Backend",
            date: this.formatDate(fourDaysLater),
            description: "Implementieren Sie Datenbankoptimierungen und führen Sie Lasttests durch, um sicherzustellen, dass die Anwendung unter hoher Belastung stabil bleibt.",
            prio: "low",
            subTasks: [],
            title: "Backend-Optimierung",
            status: "done",
            id: 1006,
            closedSubTasks: 0,
            progress: 0
        }
    }

    formatDate(date: any) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }
}