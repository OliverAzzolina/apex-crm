import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDeletePurchaseComponent } from './dialog-delete-purchase.component';

describe('DialogDeletePurchaseComponent', () => {
  let component: DialogDeletePurchaseComponent;
  let fixture: ComponentFixture<DialogDeletePurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogDeletePurchaseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogDeletePurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
