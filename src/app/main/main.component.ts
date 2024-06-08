import { Component, HostListener, ViewChild, inject } from '@angular/core';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawer, MatDrawerContainer, MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table'  
import { SetHeaderService } from '../services/set-header.service';
import { MatDialog } from '@angular/material/dialog';
import { SettingsComponent } from '../settings/settings.component';
import { ThemeService } from '../services/theme.service';
import { TranslateModule } from '@ngx-translate/core';
import { Firestore } from '@angular/fire/firestore';
import { TranslationService } from '../services/translation.service';
import { FeedbackBottomSheetComponent } from '../feedback-bottom-sheet/feedback-bottom-sheet.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { BottomSheetService } from '../services/bottom-sheet.service';
import { NavbarService } from '../services/navbar.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    RouterOutlet, 
    MatToolbarModule, 
    MatIconModule, 
    MatSidenavModule, 
    RouterLink, 
    CommonModule, 
    MatTableModule, 
    SettingsComponent, 
    TranslateModule
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})

export class MainComponent {

  constructor(
    public setHeader: SetHeaderService, 
    public db: Firestore,  
    public dialog: MatDialog, 
    private _bottomSheet: MatBottomSheet,
    private router: Router,
    private variable: TranslationService
  ){};
  
  sheetService = inject(BottomSheetService);
  setLogo = inject(ThemeService);
  darkmode = inject(ThemeService);
  translate = inject(TranslationService);
  navbar = inject(NavbarService)
 
  header: string = '';
  headerId: string;

  async ngOnInit(){
    await this.checkUser();
    this.headerId = this.router.url.split('/').splice(2, 1).toString();
    this.setHeader.updateHeader(this.headerId);
    this.checkScreenSize();
  };

  async checkUser() {
    const data = JSON.parse(localStorage.getItem("loggedUserData") || '{}');
    this.checkUserSettings(data.translation, data.darkmode);
  }

  checkUserSettings(translation: boolean, darkmode: boolean) {
    if (translation) {
      this.translate.switchLanguage(true);
    }else{
      this.translate.switchLanguage(false);
    }
    if (darkmode) {
      this.darkmode.setDarkMode(true);
    }else{
      this.darkmode.setDarkMode(false);
    }
  }

  async setNewHeader(newHeader:string){
    await this.setHeader.updateHeader(newHeader);
  }

  logoutUser(){
    localStorage.removeItem('loggedUserData');
    this.openBottomSheet();
    this.darkmode.setDarkMode(false);
    this.translate.translationOn = false;
  }

  openBottomSheet(){
    this.sheetService.message = "sheet.user-logout";
    this._bottomSheet.open(FeedbackBottomSheetComponent);
    setTimeout(() =>{
      this._bottomSheet.dismiss();
    }, 2000)
  };

  @ViewChild(MatDrawerContainer) drawerContainer: MatDrawerContainer;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize()
  }
  width: number;

  checkScreenSize(){
    this.width = window.innerWidth;
    if(this.width <= 520){
      this.drawerContainer.close()
    }
  }
}


