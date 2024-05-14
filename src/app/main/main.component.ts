import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table'  
import { SetHeaderService } from '../services/set-header.service';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, MatIconModule, MatSidenavModule, RouterLink, CommonModule, MatTableModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  constructor(public setHeader: SetHeaderService, public dialog: MatDialog){}

  async setNewHeader(newHeader:string){
    await this.setHeader.updateHeader(newHeader);
  }


}
