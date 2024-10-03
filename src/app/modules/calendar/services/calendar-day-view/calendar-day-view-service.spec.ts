import { TestBed } from '@angular/core/testing';

import { CalendarDayViewService } from './calendar-day-view-service';

describe('CalendarDayViewServiceService', () => {
  let service: CalendarDayViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalendarDayViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
