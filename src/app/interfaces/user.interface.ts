export interface User {
    name: string;
    email: string;
    password: string;
    contacts: Contact[];
    tasks: Task[];
    category: []
}

export interface Contact {
    color: string;
    email: string;
    id: number;
    initials: string;
    isChecked: boolean;
    name: string;
    phone: string;
}

export interface Task {
    assigned: Contact[];
    category: string;
    closedSubTasks: number;
    color: string;
    date: string;
    description: string;
    id: number;
    prio: string;
    progress: number;
    status: string;
    subTasks: SubTask[];
    title: string;
}

export interface SubTask {
    status: string;
    value: string;
}