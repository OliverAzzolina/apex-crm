import { Component, Inject, inject } from '@angular/core';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table'  
import { SetHeaderService } from '../services/set-header.service';
import { MatDialog } from '@angular/material/dialog';
import { SettingsComponent } from '../settings/settings.component';
import { ThemeService } from '../services/theme.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DatabaseService } from '../services/database.service';
import { Firestore, collection, getDocs, query, where } from '@angular/fire/firestore';
import { TranslationService } from '../services/translation.service';


@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, MatIconModule, MatSidenavModule, RouterLink, CommonModule, MatTableModule, SettingsComponent, TranslateModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})

export class MainComponent {
  constructor(public setHeader: SetHeaderService, public db: Firestore,  public dialog: MatDialog, private database: DatabaseService){}
  setLogo = inject(ThemeService);
  darkmode = inject(ThemeService);
  translate = inject(TranslationService);
  header: string = '';

  async ngOnInit(){
    await this.checkUser();
    await this.setHeader.setFirstHeader()
  }

  async checkUser(){
    const userId = localStorage.getItem('User') as string;
      const q = query(collection(this.db, "users"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
  
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
          this.checkUserSettings(userData)
      });
  }

  async checkUserSettings(userData: any){
    if(userData['translation'] == true){
      this.translate.translationOn;
      this.translate.switchLanguage(true)
    }
    if(userData['darkmode'] == true){
      this.darkmode.setDarkMode(true);
    }
  }

  async setNewHeader(newHeader:string){
    await this.setHeader.updateHeader(newHeader);
  }

  logoutUser(){
    localStorage.removeItem('User');
    this.darkmode.setDarkMode(false);
    this.translate.translationOn = false;
  }

}
