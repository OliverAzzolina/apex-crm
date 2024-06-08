import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../models/user.class';
import { DatabaseService } from '../services/database.service';
import { getDocs } from "firebase/firestore";
import { Firestore, collection, query, where } from '@angular/fire/firestore';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationService } from '../services/translation.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { BottomSheetService } from '../services/bottom-sheet.service';
import { FeedbackBottomSheetComponent } from '../feedback-bottom-sheet/feedback-bottom-sheet.component';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatDividerModule, CommonModule, 
    RegisterComponent, MatIconModule, TranslateModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})

export class RegisterComponent {
  constructor(
    private database: DatabaseService, 
    public db: Firestore, 
    private router: Router, 
    private _bottomSheet: MatBottomSheet
  ){}
  
  loading = false;
  hide = true;
  userIsLoggedIn = false;
  user: User = new User();
  userData: any;
  userExistsNote = false;

  firstNameFormControl = new FormControl('', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z]).{1,30}')]);
  lastNameFormControl = new FormControl('', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z]).{1,30}')]);
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  passwordFormControl = new FormControl('', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]);

  sheetService = inject(BottomSheetService);
  translate = inject(TranslationService);

  ngOnInit(){
    this.translate.switchLanguage(this.translate.translationOn)
  }

  async registerUser(userData:any){
    await this.database.saveNewUser(userData).then((result: any) => {
      this.loading = false;
    });
  }

  async checkIfUserExists(){
    this.userExistsNote = false;
    const userEmail = this.user.email
    this.loading = true;

    const q = query(collection(this.db, "users"), where("email", "==", userEmail));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      const userExists = doc.id;
      if (userExists) {
        this.userExistsNote = true;
      }
    });

    if(this.userExistsNote == false){
      this.user.firstName = this.firstNameFormControl.value!;
      this.user.lastName = this.lastNameFormControl.value!;
      this.user.email = this.emailFormControl.value!;
      this.user.password = this.passwordFormControl.value!;
      this.user.translation = this.translate.translationOn;
      const userData = this.user.toJSON();
      this.registerUser(userData);
      this.openBottomSheet();
      this.router.navigateByUrl('/login');
    };
  };   

  openBottomSheet(){
    this.sheetService.message = "sheet.user-registered";
    this._bottomSheet.open(FeedbackBottomSheetComponent);
    setTimeout(() =>{
      this._bottomSheet.dismiss();
    }, 2000)
  };
}



