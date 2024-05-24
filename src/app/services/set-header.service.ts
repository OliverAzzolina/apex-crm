import { Injectable, inject } from '@angular/core';
import { TranslationService } from './translation.service';

@Injectable({
  providedIn: 'root'
})
export class SetHeaderService {

  header:string = 'Dashboard';
  translate = inject(TranslationService);

  constructor() { }

  async updateHeader(newHeader:string){
    this.header = newHeader;
  }

  async updateCustomerHeader(){
    if(this.translate.translationOn){
      this.header = 'Kunde'
    }else{
      this.header = 'Customer'
    }
  }
}
