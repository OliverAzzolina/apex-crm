import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


export class Purchase{
    orderDate: number;
    orderdate: string;
    status: string;
    product: string;
    amount: number;
    ppu: number;
    totalPrice: number;
    purchaseId: string;
    userId: string;

    constructor(obj?: any){
        this.orderDate = obj ? obj.orderDate : '';
        this.orderdate = obj ? obj.orderdate : '';
        this.status = obj ? obj.status : '';
        this.product = obj ? obj.product : '';
        this.amount = obj ? obj.amount : '';
        this.ppu = obj ? obj.ppu : '';
        this.totalPrice = obj ? obj.totalPrice : '';
        this.purchaseId = obj ? obj.purchaseId : '';
        this.userId = obj ? obj.userId : '';
     
    }
    
    public toJSON() {
        return {
            orderDate: this.orderDate,
            orderdate: this.orderdate,
            status: this.status,
            product: this.product,
            amount: this.amount,
            ppu: this.ppu,
            totalPrice: this.totalPrice,
            purchaseId: this.purchaseId,
            userId: this.userId,
        };
    }
}