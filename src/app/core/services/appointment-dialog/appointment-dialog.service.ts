import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import type { CalendarEvent } from '@core/models';
import { AppointmentDialogComponent } from '@core/components/appointment-dialog/appointment-dialog.component';

/**
 * The `AppointmentDialogService` is responsible for managing the opening and closing
 * of the appointment dialog in the application. It provides utility methods for showing
 * the appointment dialog component and maintaining time options used in the dialog.
 */
@Injectable({
  providedIn: 'root',
})
export class AppointmentDialogService {
  private readonly dialog = inject(MatDialog);

  /**
   * Opens the appointment dialog.
   * The appointment data is passed to the dialog component as input data.
   *
   * @param appointmentData - Data related to the appointment to be managed.
   */
  open(appointmentData: CalendarEvent) {
    this.dialog.open(AppointmentDialogComponent, {
      data: { appointmentData },
    });
  }

  /**
   * Closes all open dialogs.
   */
  close() {
    this.dialog.closeAll();
  }
}
