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
import { DocumentData, getDocs } from "firebase/firestore";
import { Firestore, collection, query, where } from '@angular/fire/firestore';
import { DatabaseService } from '../services/database.service';
import { TranslationService } from '../services/translation.service';
import { ThemeService } from '../services/theme.service';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FeedbackBottomSheetComponent } from '../feedback-bottom-sheet/feedback-bottom-sheet.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { BottomSheetService } from '../services/bottom-sheet.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatDividerModule, CommonModule, 
    RegisterComponent, MatIconModule, TranslateModule
   ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {
  loading = false;
  userIsLoggedIn = false;
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]);
  hide = true;
  user: User;
  userData: any;
  userId: string;
  wrongPassword = false;
  userNotFound: boolean = false;
  
  sheetService = inject(BottomSheetService);
  translate = inject(TranslationService);
  darkmode = inject(ThemeService);

  constructor(
    private database: DatabaseService, 
    public db: Firestore, 
    private router: Router, 
    private _bottomSheet: MatBottomSheet
  ){};

  ngOnInit(){
    this.translate.switchLanguage(this.translate.translationOn)
  };

  async checkUser(){
    this.wrongPassword = false;
    this.loading = true;

    const q = query(collection(this.db, "users"), where("email", "==", this.email.value));
    const querySnapshot = await getDocs(q);

    if(querySnapshot.empty){
      this.userNotFound = true;
    }else{
      this.userNotFound = false;
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        this.checkPassword(userData, doc)
      });
    };
  };

  async checkPassword(userData: any, doc:any){
    if (this.password.value == userData['password']) {
      await this.loginUser(userData, doc)
    }else{
      this.wrongPassword = true;
    }
  }

  async loginUser(userData: any, doc:any){
    userData['userId'] = doc.id;
    await this.setUserId(userData);
    await this.checkUserSettings(userData);
    this.router.navigateByUrl('/main/dashboard');
    this.openBottomSheet();
  }

  async setUserId(userData: any) {
    const userId = userData['userId'];
    const loggedUserData = {
      userId: userData['userId'],
      translation: userData['translation'],
      darkmode: userData['darkmode']
    }
    await this.database.saveEditedUser(userData, userId).then((result: any) => {});
    this.saveData("loggedUserData", JSON.stringify(loggedUserData))
  };

  async checkUserSettings(userData: DocumentData){
    if(userData['translation'] == true){
      this.translate.translationOn;
      this.translate.switchLanguage(true)
    }
    if(userData['darkmode'] == true){
      this.darkmode.setDarkMode(true);
    }
  };

  public saveData(key: string, value: string) {
    localStorage.setItem(key, value);
  };

  openBottomSheet(){
    this.sheetService.message = "sheet.user-login";
    this._bottomSheet.open(FeedbackBottomSheetComponent);
    setTimeout(() =>{
      this._bottomSheet.dismiss();
    }, 2000)
  };

  async loginGuest(){
    this.wrongPassword = false;
    this.loading = true;

    const q = query(collection(this.db, "users"), where("userId", "==", "guest"));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      userData['userId'] = doc.id;
      this.checkGuestUser(userData);
      this.router.navigateByUrl('/main/dashboard');
      this.openBottomSheet();
    });
  }

  async checkGuestUser(userData: DocumentData){
    await this.setUserId(userData);
    await this.checkUserSettings(userData);
  }
};

