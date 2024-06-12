import { Component, inject } from '@angular/core';
import { ThemeService } from '../services/theme.service';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { TranslationService } from '../services/translation.service';
import { TranslateModule } from '@ngx-translate/core';
import { DatabaseService } from '../services/database.service';
import { User } from '../../models/user.class';
import { MatDividerModule } from '@angular/material/divider';
import { Firestore, doc, onSnapshot } from '@angular/fire/firestore';
import { DialogDeleteUserComponent } from '../dialog-delete-user/dialog-delete-user.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { FeedbackBottomSheetComponent } from '../feedback-bottom-sheet/feedback-bottom-sheet.component';
import { BottomSheetService } from '../services/bottom-sheet.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [MatIconButton, MatIconModule, MatCardModule, MatSelectModule, TranslateModule, MatButtonModule, FormsModule, MatDialogModule,
    MatDividerModule, CommonModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})

export class SettingsComponent {
  translate = inject(TranslationService);
  sheetService = inject(BottomSheetService);
  darkmode = inject(ThemeService);

  isDarkMode: boolean;
  loading: boolean = false;
  selectedLanguage = this.translate.translationOn;
  userData: any;
  user: User;
  userId:string;
  setDarkmode:boolean;
  translation:boolean;
  userSettings:any = [];
  language:string;
  isGuest: boolean = false;

  constructor(
    private themeService: ThemeService, 
    private database: DatabaseService, 
    public db: Firestore, 
    public dialog: MatDialog, 
    private _bottomSheet: MatBottomSheet
  ){
    this.isDarkMode = this.themeService.isDarkMode();
    };

  async ngOnInit(){
    await this.checkUser();
    await this.getUserId();
    await this.getUserData('users');
  };

  async checkUser() {
    const data = JSON.parse(localStorage.getItem("loggedUserData") || '{}');
    this.checkUserSettings(data.translation, data.darkmode);
  }

  checkUserSettings(translation: boolean, darkmode: boolean) {
    if (translation) {
      this.translate.switchLanguage(true);
    }
    if (darkmode) {
      this.darkmode.setDarkMode(true);
    }
  }

  async getUserId(){
    const data = JSON.parse(localStorage.getItem("loggedUserData") || '{}');
    this.userId = data.userId;
    if(this.userId == "guest"){
      this.isGuest = true;
    }
    if(data.translation == true){
      this.language = 'Deutsch';
    }else{
      this.language = 'English'
    }
  };

  async getUserData(users:string){
    onSnapshot(doc(this.db, users, this.userId), (doc) => {
      this.user = new User(doc.data());
    });
  };

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.setDarkMode(this.isDarkMode);
  };

  saveSettings(){
    this.user.darkmode = this.isDarkMode;
    this.user.translation = this.translate.translationOn
    const userData = this.user.toJSON();
    this.database.saveEditedUser(userData, this.userId)
    const loggedUserData = {
      userId: userData['userId'],
      translation: userData['translation'],
      darkmode: userData['darkmode']
    }
    this.saveData("loggedUserData", JSON.stringify(loggedUserData))
    this.openBottomSheet();
  };

  public saveData(key: string, value: string) {
    localStorage.setItem(key, value);
  };

  openDialogDeleteUser(){
      let dialog = this.dialog.open(DialogDeleteUserComponent);
      dialog.componentInstance.userId = this.userId;
  };

  openBottomSheet(){
    this.sheetService.message = "sheet.settings";
    this._bottomSheet.open(FeedbackBottomSheetComponent);
    setTimeout(() =>{
      this._bottomSheet.dismiss();
    }, 2000)
  };
}
