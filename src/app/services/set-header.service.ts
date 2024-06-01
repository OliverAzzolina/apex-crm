import { Injectable, inject } from '@angular/core';
import { TranslationService } from './translation.service';
import { Router } from 'express';

@Injectable({
  providedIn: 'root'
})
export class SetHeaderService {
  headerId: string;
  header:string = '';
  translate = inject(TranslationService);

  constructor() { }

  async updateHeader(newHeader:string){
    this.header = 'main.header-' + newHeader;
    console.log(newHeader)
  }

  async updateCustomerHeader(){
    if(this.translate.translationOn){
      this.header = 'Kunde'
    }else{
      this.header = 'Customer'
    }
  }

  async setHeader(header:string){
    this.header = header;
  }
}
