import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table'  
import { SetHeaderService } from './services/set-header.service';
import { LoginComponent } from './login/login.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, MatIconModule, MatSidenavModule, RouterLink, CommonModule, MatTableModule, LoginComponent, TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  loggedIn: boolean = true;
  title = 'simple-crm';


  constructor(public setHeader: SetHeaderService, public translate: TranslateService){
  }

  ngOnInit(){
    
  }

  async setNewHeader(newHeader:string){
    await this.setHeader.updateHeader(newHeader);
  }
}
