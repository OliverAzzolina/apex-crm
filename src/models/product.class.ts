import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


export class Product{
    name: string;
    productId: string;
    ppu: number;
    type: string;

    constructor(obj?: any){
        this.name = obj ? obj.name : '';
        this.productId = obj ? obj.productId : '';
        this.ppu = obj ? obj.ppu : '';
        this.type = obj ? obj.type : '';
    }
    
    public toJSON() {
        return {
            name: this.name,
            productId: this.productId,
            ppu: this.ppu,
            type: this.type,
        };
    }
}