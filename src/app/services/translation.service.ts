import { Injectable } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  translationOn: boolean = false;

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
}
