import { TestBed } from '@angular/core/testing';

import { AppointmentDialogService } from './appointment-dialog.service';

describe('AppointmentDialogService', () => {
  let service: AppointmentDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppointmentDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
