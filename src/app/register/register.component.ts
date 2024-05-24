import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../models/user.class';
import { DatabaseService } from '../services/database.service';
import { doc, getDoc, getDocs } from "firebase/firestore";
import { Firestore, collection, query, where } from '@angular/fire/firestore';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatDividerModule, CommonModule, RegisterComponent, MatIconModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  constructor(private database: DatabaseService, public db: Firestore, private router: Router){}
  loading = false;
  hide = true;
  userIsLoggedIn = false;
  firstNameFormControl = new FormControl('', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z]).{1,30}')]);
  lastNameFormControl = new FormControl('', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z]).{1,30}')]);
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  passwordFormControl = new FormControl('', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]);

  user: User = new User();
  userData: any;
  userExistsNote = false;
  
  async registerUser(userData:any){
    await this.database.saveNewUser(userData).then((result: any) => {
      console.log('added new User', result);
      this.loading = false;
      console.log("registered", userData)
    });
  }

  async checkIfUserExists(){
    this.userExistsNote = false;
    const userEmail = this.user.email
    this.loading = true;

    const q = query(collection(this.db, "users"), where("email", "==", userEmail));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      const userExists = doc.id;
      if (userExists) {
        console.log("User already exists:", userExists);
        this.userExistsNote = true;
      }

    });
    if(this.userExistsNote == false){
      const userData = this.user.toJSON();
      this.registerUser(userData);
      this.router.navigateByUrl('/login')
    }

  }   
}



