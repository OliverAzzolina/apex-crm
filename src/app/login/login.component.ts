import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { RegisterComponent } from '../register/register.component';
import { User } from '../../models/user.class';
import { DocumentData, doc, getDoc, getDocs } from "firebase/firestore";
import { Firestore, collection, query, where } from '@angular/fire/firestore';
import { DatabaseService } from '../services/database.service';
import { TranslationService } from '../services/translation.service';
import { ThemeService } from '../services/theme.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatDividerModule, CommonModule, 
    RegisterComponent, MatIconModule
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
  hide = true;
  user: User;
  userData: any;
  email:string;
  password:string;
  userId: string;
  wrongPassword = false;
  userNotFound: boolean = false;

  translate = inject(TranslationService);
  darkmode = inject(ThemeService);

  async checkUser(){
    this.wrongPassword = false;
    this.loading = true;

    const q = query(collection(this.db, "users"), where("email", "==", this.email));
    const querySnapshot = await getDocs(q);

    if(querySnapshot.empty){
      this.userNotFound = true;
    }else{
      this.userNotFound = false;
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        if (this.password == userData['password']) {
          userData['userId'] = doc.id;
          this.setUserId(userData);
          
          this.checkUserSettings(userData)
          this.loading = false;
          this.router.navigateByUrl('/main/dashboard');
        }else{
          this.wrongPassword = true;
        }
      });
    }
  }

  async setUserId(userData: DocumentData) {
    const userId = userData['userId'];
      await this.database.saveEditedUser(userData, userId).then((result: any) => {
    });
    this.saveData('User', userId)
  };

  async checkUserSettings(userData: DocumentData){
    if(userData['translation'] == true){
      this.translate.translationOn;
      this.translate.switchLanguage(true)
    }
    if(userData['darkmode'] == true){
      this.darkmode.setDarkMode(true);
    }
  }

  public saveData(key: string, value: string) {
    localStorage.setItem(key, value);
  }
}
