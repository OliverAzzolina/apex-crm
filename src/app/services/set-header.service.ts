import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SetHeaderService {

  header:string = 'Dashboard';
  constructor() { }

  async updateHeader(newHeader:string){
    this.header = newHeader;
  }
}
