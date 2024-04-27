import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


export class Task{
    taskId: string;
    userId: string;
    status: string;
    note: string;

    constructor(obj?: any){
        this.taskId = obj ? obj.taskId : '';
        this.userId = obj ? obj.userId : '';
        this.status = obj ? obj.status : '';
        this.note = obj ? obj.note : '';
    }
    
    public toJSON() {
        return {
            taskId: this.taskId,
            userId: this.userId,
            status: this.status,
            note: this.note,
        };
    }
}