import { TestBed } from '@angular/core/testing';

import { AppointmentsDataService } from './appointments-data.service';

describe('AppointmentsDataService', () => {
  let service: AppointmentsDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppointmentsDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
