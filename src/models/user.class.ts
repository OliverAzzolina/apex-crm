export class User{
    firstName: string;
    lastName: string;
    birthDate: number;
    street: string;
    number: string;
    zipCode: number;
    city: string;

    constructor(obj?: any){
        this.firstName = obj ? obj.firstName : '';
        this.lastName = obj ? obj.lastName : '';
        this.birthDate = obj ? obj.birthDate : '';
        this.street = obj ? obj.street : '';
        this.number = obj ? obj.number : '';
        this.zipCode = obj ? obj.zipCode : '';
        this.city = obj ? obj.city : '';
    }
}

