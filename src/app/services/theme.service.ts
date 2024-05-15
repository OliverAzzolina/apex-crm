import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor() { }

  private darkMode = false;
  logo:string = 'assets/logo/logo_light.png';

  isDarkMode() {
    return this.darkMode;
  }

  setDarkMode(isDarkMode: boolean) {
    this.darkMode = isDarkMode;
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
      this.logo = 'assets/logo/logo_dark.png';
    } else {
      document.body.classList.remove('dark-theme');
      this.logo = 'assets/logo/logo_light.png'
    }
    console.log(this.logo)
  }
}
