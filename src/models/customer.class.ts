import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


export class Customer{
    firstName: string;
    lastName: string;
    birthDate: number;
    birthdate: string;
    email: string;
    street: string;
    number: string;
    zipCode: number;
    city: string;
    company: string;
    position: string;
    phone: string;

    constructor(obj?: any){
        this.firstName = obj ? obj.firstName : '';
        this.lastName = obj ? obj.lastName : '';
        this.birthDate = obj ? obj.birthDate : '';
        this.birthdate = obj ? obj.birthdate : '';
        this.email = obj ? obj.email : '';
        this.street = obj ? obj.street : '';
        this.number = obj ? obj.number : '';
        this.zipCode = obj ? obj.zipCode : '';
        this.city = obj ? obj.city : '';
        this.company = obj ? obj.company : '';
        this.position = obj ? obj.position : '';
        this.phone = obj ? obj.phone : '';
    }
    
    public toJSON() {
        return {
          firstName: this.firstName,
          lastName: this.lastName,
          birthDate: this.birthDate,
          email: this.email,
          street: this.street,
          zipCode: this.zipCode,
          city: this.city,
          company: this.company,
          position: this.position,
          phone: this.phone,
          birthdate: this.birthdate
        };
      }
    }

