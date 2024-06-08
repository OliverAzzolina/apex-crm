import { Injectable } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})

export class TranslationService {
  translationOn: boolean = false;
  flag: string = "assets/icons/de.png";
  
  constructor(public translate: TranslateService){}

  switchLanguage(switchTo: boolean){
    if(switchTo){
      this.translationOn = true;
      this.translate.use('crm-de');
    }
    if(!switchTo){
      this.translationOn = false;
      this.translate.use('crm-en');
    }
  }

  switchLogRegTranslation(){
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
