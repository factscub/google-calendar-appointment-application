import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import type { CalendarEvent, HourlyAppointment } from '@core/models';
import { formatToTimeString } from '@core/utils';
import { NgClass, NgFor } from '@angular/common';

@Component({
  selector: 'app-time-slot-item',
  standalone: true,
  imports: [NgFor, CdkDropList, CdkDrag, NgClass],
  templateUrl: './time-slot-item.component.html',
  styleUrl: './time-slot-item.component.scss',
})
export class TimeSlotItemComponent {
  readonly formatToTimeString = formatToTimeString;

  @Input()
  timeSlotAppointments!: HourlyAppointment;

  @Output()
  dropEvent = new EventEmitter<{
    appointment: CalendarEvent;
    newStartTime: string;
  }>();

  @Output()
  openNewAppointmentDialog = new EventEmitter<{
    appointmentStart: string;
  }>();

  @Output()
  openExistingAppointmentDialog = new EventEmitter<{
    appointment: CalendarEvent;
  }>();

  /**
   * Handles drag-and-drop of an appointment to a new start time stamp.
   * @param event CdkDragDrop event
   * @param newStartTime string New start time stamp
   */
  onDrop(event: CdkDragDrop<CalendarEvent[]>, newStartTime: string): void {
    this.dropEvent.emit({ appointment: event.item.data, newStartTime });
  }

  /**
   * Opens a dialog to create a new appointment.
   * @param event MouseEvent to stop propagation
   * @param appointmentStart Starting time for the new appointment
   */
  openNewDialog(event: MouseEvent, appointmentStart: string): void {
    this.stopEventPropagation(event);
    this.openNewAppointmentDialog.emit({ appointmentStart });
  }

  /**
   * Opens a dialog to view an existing appointment.
   * @param event MouseEvent to stop propagation
   * @param appointment The existing appointment
   */
  openExistingDialog(event: MouseEvent, appointment: CalendarEvent): void {
    this.stopEventPropagation(event);
    this.openExistingAppointmentDialog.emit({ appointment });
  }

  /**
   * Stops the event from propagating up the DOM.
   * @param event MouseEvent
   */
  private stopEventPropagation(event: MouseEvent): void {
    event.stopPropagation();
  }

  /**
   * Track by unique appointment ID
   */
  trackByAppointment(_: number, appointment: CalendarEvent): string {
    return appointment.id;
  }
}
