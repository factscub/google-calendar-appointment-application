import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InlineDatePickerComponent } from './inline-date-picker.component';

describe('InlineDatePickerComponent', () => {
  let component: InlineDatePickerComponent;
  let fixture: ComponentFixture<InlineDatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InlineDatePickerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InlineDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
