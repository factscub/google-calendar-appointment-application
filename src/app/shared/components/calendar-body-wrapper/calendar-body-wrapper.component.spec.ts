import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarBodyWrapperComponent } from './calendar-body-wrapper.component';

describe('CalendarBodyWrapperComponent', () => {
  let component: CalendarBodyWrapperComponent;
  let fixture: ComponentFixture<CalendarBodyWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarBodyWrapperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarBodyWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
