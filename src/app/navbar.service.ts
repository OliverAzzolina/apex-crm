import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {

  constructor() { }
  @Output() change: EventEmitter<any> = new EventEmitter();

  navLink: string = 'dashboard';

  changeNavbar(navbar: boolean): any {
      this.change.emit(navbar);
  }

  setNavbarLink(link:string){
    this.navLink = link;
  }
}
