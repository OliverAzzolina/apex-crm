import { Component } from '@angular/core';

@Component({
  selector: 'app-dialog-add-purchase',
  standalone: true,
  imports: [],
  templateUrl: './dialog-add-purchase.component.html',
  styleUrl: './dialog-add-purchase.component.scss'
})
export class DialogAddPurchaseComponent {
  userId: string;
}
