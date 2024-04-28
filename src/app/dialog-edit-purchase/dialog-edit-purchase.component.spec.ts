import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditPurchaseComponent } from './dialog-edit-purchase.component';

describe('DialogEditPurchaseComponent', () => {
  let component: DialogEditPurchaseComponent;
  let fixture: ComponentFixture<DialogEditPurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogEditPurchaseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogEditPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
