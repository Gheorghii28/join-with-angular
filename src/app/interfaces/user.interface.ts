export interface User {
    name: string;
    email: string;
    password: string;
    contacts: Contact[];
    tasks: Task[];
}

interface Contact {
    color: string;
    email: string;
    id: number;
    initials: string;
    name: string;
    phone: string;
}

interface Task {
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
    subTasks: SubTasks[];
    title: string;
}

interface SubTasks {
    status: string;
    value: string;
}