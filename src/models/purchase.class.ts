import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


export class Purchase{
    date: Date;
    status: string;
    product: string;
    amount: number;
    ppu: number;
    totalPrice: number;
    purchaseId: string;

    constructor(obj?: any){
        this.date = obj ? obj.date : '';
        this.status = obj ? obj.status : '';
        this.product = obj ? obj.product : '';
        this.amount = obj ? obj.amount : '';
        this.ppu = obj ? obj.ppu : '';
        this.totalPrice = obj ? obj.totalPrice : '';
        this.purchaseId = obj ? obj.purchaseId : '';
     
    }
    
    public toJSON() {
        return {
            date: this.date,
            status: this.status,
            product: this.product,
            amount: this.amount,
            ppu: this.ppu,
            totalPrice: this.totalPrice,
            purchaseId: this.purchaseId,
        };
    }
}