import { Component, inject } from '@angular/core';
import { ThemeService } from '../services/theme.service';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import { TranslationService } from '../services/translation.service';
import { TranslateModule } from '@ngx-translate/core';
import { DatabaseService } from '../services/database.service';
import { User } from '../../models/user.class';
import {MatDividerModule} from '@angular/material/divider';
import { Firestore, collection, doc, getDocs, onSnapshot, query, where } from '@angular/fire/firestore';
import { DialogDeleteUserComponent } from '../dialog-delete-user/dialog-delete-user.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [MatIconButton, MatIconModule, MatCardModule, MatSelectModule, TranslateModule, MatButtonModule, FormsModule, MatDialogModule,
    MatDividerModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  isDarkMode: boolean;
  translate = inject(TranslationService);
  loading: boolean = false;

  selectedLanguage = this.translate.translationOn;
  userData: any;
  user: User;
  userId:string;
  darkmode:boolean;
  translation:boolean;
  userSettings:any = [];

  constructor(private themeService: ThemeService, private database: DatabaseService, public db: Firestore, public dialog: MatDialog) {
    this.isDarkMode = this.themeService.isDarkMode();
  }

  async ngOnInit(){
    await this.getUserId();
    await this.getUserData('users');
  }

  async getUserId(){
    this.userId = localStorage.getItem('User') as string;
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.setDarkMode(this.isDarkMode);
  }

  saveSettings(){
    this.user.darkmode = this.isDarkMode;
    this.user.translation = this.translate.translationOn
    const userData = this.user.toJSON();
    this.database.saveEditedUser(userData, this.userId)
    console.log(userData)
  }

  async getUserData(users:string){
    onSnapshot(doc(this.db, users, this.userId), (doc) => {
      this.user = new User(doc.data());
    });
  }

  openDialogDeleteUser(){

      let dialog = this.dialog.open(DialogDeleteUserComponent);
      dialog.componentInstance.userId = this.userId;
    
  }


}
