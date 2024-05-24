import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

export class User{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    translation: boolean;
    darkmode: boolean;
    userId: string;

    constructor(obj?: any){
        this.firstName = obj ? obj.firstName : '';
        this.lastName = obj ? obj.lastName : '';
        this.email = obj ? obj.email : '';
        this.password = obj ? obj.password : '';
        this.translation = obj ? obj.translation : false;
        this.darkmode = obj ? obj.darkmode : false;
        this.userId = obj ? obj.userId : '';
    }
    
    public toJSON() {
        return {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          password: this.password,
          translation: this.translation,
          darkmode: this.darkmode,
          userId: this.userId
        };
      }
    }