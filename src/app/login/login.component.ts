import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { RegisterComponent } from '../register/register.component';
import { User } from '../../models/user.class';
import { doc, getDoc, getDocs } from "firebase/firestore";
import { Firestore, collection, query, where } from '@angular/fire/firestore';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatDividerModule, CommonModule, RegisterComponent
   ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {
  constructor(private database: DatabaseService, public db: Firestore, private router: Router){}
  
  loading = false;
  userIsLoggedIn = false;
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  passwordFormControl = new FormControl('', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]);
  userNotFound: boolean;
  user: User;
  userData: any;
  email:string;
  password:string;

  async checkUser(){
    //routerLink="/main/dashboard"
    //userIsLoggedIn = true; 

      this.userNotFound = true;
      this.loading = true;
  
      const q = query(collection(this.db, "users"), where("email", "==", this.email));
      const querySnapshot = await getDocs(q);
  
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        if (this.password == userData['password']) {
          console.log("User exists:",);
          this.userNotFound = false;
          this.router.navigateByUrl('/main/dashboard')
        }
      });
      
  }
}
