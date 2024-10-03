import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSlotItemComponent } from './time-slot-item.component';

describe('TimeSlotItemComponent', () => {
  let component: TimeSlotItemComponent;
  let fixture: ComponentFixture<TimeSlotItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeSlotItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeSlotItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
