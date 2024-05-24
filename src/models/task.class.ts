import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


export class Task{
    taskId: string;
    customerId: string;
    status: string;
    translatedStatus: string;
    note: string;
    customerName: string;

    constructor(obj?: any){
        this.taskId = obj ? obj.taskId : '';
        this.customerId = obj ? obj.customerId : '';
        this.status = obj ? obj.status : '';
        this.translatedStatus = obj ? obj.translatedStatus : '';
        this.note = obj ? obj.note : '';
        this.customerName = obj ? obj.customerName : '';
    }
    
    public toJSON() {
        return {
            taskId: this.taskId,
            customerId: this.customerId,
            status: this.status,
            translatedStatus: this.translatedStatus,
            note: this.note,
            customerName: this.customerName,
        };
    }
}