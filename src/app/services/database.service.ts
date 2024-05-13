import { Injectable } from '@angular/core';
import {collection, addDoc,doc,  deleteDoc,  updateDoc,  getDocs,  where,  query,  onSnapshot, setDoc,} from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})

export class DatabaseService {

  constructor(public db: Firestore) { }

  userData: any = [];
  loading:boolean = false;

  //USER-----------------------------------------------------------------------------------------------------------------------
  async saveUser(userData: any) {
    try {
        await addDoc(collection(this.db, 'users'), userData);
    }catch (error: any) {
      console.error('Fehler beim erstellen des Users:', error);
    }
  }

  async saveEditedUser(userData:any, id:string){
    try {
        await setDoc(doc(this.db, "users", id), userData);
    }catch (error: any) {
        console.error('Fehler beim updaten des Users:', error);
    }
  }

  async deleteSelectedUser(id:string){
    try{
      await deleteDoc(doc(this.db, "users", id));
    }catch (error: any) {
      console.error('Fehler beim updaten des Users:', error);
    }
  }

  //TASKS-----------------------------------------------------------------------------------------------------------------------

  async saveNewTask(taskData:any){
    try {
      await addDoc(collection(this.db, 'tasks'), taskData);
    }catch (error: any) {
      console.error('Fehler beim erstellen des tasks:', error);
    }
  }

  async saveEditedTask(taskData:any, id:string){
    try {
      await setDoc(doc(this.db, "tasks", id), taskData);
    }catch (error: any) {
      console.error('Fehler beim updaten des Tasks:', error);
    }
  }

  async deleteSelectedTask(taskId: string){
    try{
      await deleteDoc(doc(this.db, "tasks", taskId));
    }catch (error: any) {
      console.error('Fehler beim updaten des Users:', error);
    }
  }

//PURCHASES-----------------------------------------------------------------------------------------------------------------------
async saveNewPurchase(purchaseData:any){
  try {
    await addDoc(collection(this.db, 'purchases'), purchaseData);
  }catch (error: any) {
    console.error('Fehler beim erstellen des Kaufs:', error);
  }
}

async saveEditedPurchase(purchaseData:any, purchaseId:string){
  try {
    await setDoc(doc(this.db, "purchases", purchaseId), purchaseData);
  }catch (error: any) {
    console.error('Fehler beim updaten des Tasks:', error);
  }
}

async deleteSelectedPurchase(purchaseId: string){
  try{
    await deleteDoc(doc(this.db, "purchases", purchaseId));
  }catch(error: any) {
    console.error('Fehler beim löschen des Kaufs:', error);

  }
}

//PRODUCTS---------------------------------------------------------------------------------------------------------------------------
async saveNewProduct(productData:any){
  try {
    await addDoc(collection(this.db, 'products'), productData);
  }catch (error: any) {
    console.error('Fehler beim erstellen des Produkts:', error);
  }
}

async saveEditedProduct(productData:any, productId:string){
  try{
    console.log(productId)
    await setDoc(doc(this.db, "products", productId), productData);
  }catch(error:any){
    console.error('Fehler beim updaten des Produkts:', error);
  }
}

async deleteSelectedProduct(productId: string){
  try{
    await deleteDoc(doc(this.db, "products", productId));
  }catch(error: any) {
    console.error('Fehler beim löschen des Kaufs:', error);

}
}
}
