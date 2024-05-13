import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDeleteCustomerComponent } from './dialog-delete-customer.component';

describe('DialogDeleteCustomerComponent', () => {
  let component: DialogDeleteCustomerComponent;
  let fixture: ComponentFixture<DialogDeleteCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogDeleteCustomerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogDeleteCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
