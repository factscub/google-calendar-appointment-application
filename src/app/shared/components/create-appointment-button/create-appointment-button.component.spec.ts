import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAppointmentButtonComponent } from './create-appointment-button.component';

describe('CreateAppointmentButtonComponent', () => {
  let component: CreateAppointmentButtonComponent;
  let fixture: ComponentFixture<CreateAppointmentButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAppointmentButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAppointmentButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
