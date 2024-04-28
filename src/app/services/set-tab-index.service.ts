import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SetTabIndexService {

  constructor() { }
tabIndex: any;

  async setTabToIndex(index:any){
    this.tabIndex = index;
  }

}
