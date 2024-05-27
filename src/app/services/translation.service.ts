import { Injectable } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  translationOn: boolean = false;
  flag: string = "assets/icons/de.png";
  constructor(public translate: TranslateService){

    //translate.setDefaultLang('en');
  }

  switchLanguage(switchTo: boolean){
    if(switchTo){
      this.translationOn = true;
      this.translate.use('de');
    }
    if(!switchTo){
      this.translationOn = false;
      this.translate.use('en');
    }
  }

  switchLogRegTranslation(){
      console.log(this.translationOn)
      if(this.translationOn){
        this.switchLanguage(false);
        this.translationOn = false;
        this.flag = "assets/icons/de.png";
      }
      else{
        this.switchLanguage(true);
        this.translationOn = true;
        this.flag = "assets/icons/en.png";
      }
    }
  
}
