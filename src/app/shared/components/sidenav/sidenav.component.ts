import { Component, inject } from '@angular/core';
import { DateManagerService } from '@core/services/date-manager/date-manager.service';
import { InlineDatePickerComponent } from '@shared/components/inline-date-picker/inline-date-picker.component';
import { AppointmentsDataService } from '@core/services/appointments-data/appointments-data.service';
import { AppointmentDialogService } from '@core/services/appointment-dialog/appointment-dialog.service';
import { AsyncPipe, NgIf } from '@angular/common';
import { CreateAppointmentButtonComponent } from '../create-appointment-button/create-appointment-button.component';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    InlineDatePickerComponent,
    CreateAppointmentButtonComponent,
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent {
  // Dependency injection for services
  private readonly appointmentsDataService = inject(AppointmentsDataService);
  private readonly appointmentDialogService = inject(AppointmentDialogService);
  private readonly dateManagerService = inject(DateManagerService);

  readonly currentDate$ = this.dateManagerService.currentDate$;
  /**
   * Opens a dialog to create a new appointment.
   * @param event MouseEvent to stop propagation
   * @param appointmentStart Starting time for the new appointment
   */
  openNewAppointmentDialog(): void {
    const date = this.dateManagerService.getCurrentDate();
    const appointment =
      this.appointmentsDataService.defaultAppointmentData(date);
    this.appointmentDialogService.open(appointment);
  }
}
