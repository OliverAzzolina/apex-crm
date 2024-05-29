import { Component, inject } from '@angular/core';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { BottomSheetService } from '../services/bottom-sheet.service';
import { TranslationService } from '../services/translation.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-feedback-bottom-sheet',
  standalone: true,
  imports: [MatBottomSheetModule, TranslateModule, MatListModule, MatButtonModule],
  templateUrl: './feedback-bottom-sheet.component.html',
  styleUrl: './feedback-bottom-sheet.component.scss'
})
export class FeedbackBottomSheetComponent {
sheetService = inject(BottomSheetService);
translate = inject(TranslationService)

message:string = this.sheetService.message;

}
