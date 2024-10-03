import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarViewDropdownComponent } from './calendar-view-dropdown.component';

describe('CalendarViewDropdownComponent', () => {
  let component: CalendarViewDropdownComponent;
  let fixture: ComponentFixture<CalendarViewDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarViewDropdownComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarViewDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
