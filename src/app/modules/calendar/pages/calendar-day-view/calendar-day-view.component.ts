import { Component, inject } from '@angular/core';
import { CdkDropListGroup } from '@angular/cdk/drag-drop';
import { AsyncPipe, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { formatToTimeString } from '@core/utils';
import type { CalendarEvent, HourlyAppointment } from '@core/models';
import { AppointmentDialogService } from '@core/services/appointment-dialog/appointment-dialog.service';
import { DateManagerService } from '@core/services/date-manager/date-manager.service';
import { TimeSlotItemComponent } from '@modules/calendar/components/time-slot-item/time-slot-item.component';
import { CalendarDayViewService } from '@modules/calendar/services/calendar-day-view/calendar-day-view-service';

@Component({
  selector: 'app-calendar-day-view',
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    NgFor,
    AsyncPipe,
    DatePipe,
    CdkDropListGroup,
    TimeSlotItemComponent,
  ],
  providers: [CalendarDayViewService],
  templateUrl: './calendar-day-view.component.html',
  styleUrl: './calendar-day-view.component.scss',
})
export class CalendarDayViewComponent {
  readonly formatToTimeString = formatToTimeString;

  // Dependency injection for services
  private readonly calendarDayViewService = inject(CalendarDayViewService);
  private readonly appointmentDialogService = inject(AppointmentDialogService);
  private readonly dateManagerService = inject(DateManagerService);
  private readonly titleService = inject(Title);

  // Observables
  readonly currentDate$ = this.dateManagerService.currentDate$;
  readonly today = this.dateManagerService.today;
  readonly dayAppointments$ = this.calendarDayViewService.dayAppointments$;

  constructor() {
    this.setTitle();
  }

  // set page title
  setTitle() {
    this.titleService.setTitle('Day View - Calendar');
  }

  /**
   * Checks if the provided date is today.
   * @param date Date to check
   * @returns boolean
   */
  isToday(date: Date): boolean {
    return this.dateManagerService.isToday(date);
  }

  /**
   * Handles drag-and-drop of an appointment to a new start time stamp.
   * @param appointment appointment
   * @param newStartTime string New start time stamp
   */
  dropAppointment({
    appointment,
    newStartTime,
  }: {
    appointment: CalendarEvent;
    newStartTime: string;
  }): void {
    this.calendarDayViewService.moveAppointmentToTimeStamp(
      appointment,
      newStartTime
    );
  }

  /**
   * Opens a dialog to create a new appointment.
   * @param appointmentStart Starting time for the new appointment
   */
  openNewAppointmentDialog({
    appointmentStart,
  }: {
    appointmentStart: string;
  }): void {
    const appointment =
      this.calendarDayViewService.createNewAppointment(appointmentStart);
    this.appointmentDialogService.open(appointment);
  }

  /**
   * Opens a dialog to view an existing appointment.
   * @param appointment The existing appointment
   */
  openExistingAppointmentDialog({
    appointment,
  }: {
    appointment: CalendarEvent;
  }): void {
    this.appointmentDialogService.open(appointment);
  }

  /**
   * Track by the unique start time of the time slot
   */
  trackByTimeSlot(_: number, timeSlotAppointments: HourlyAppointment): string {
    return timeSlotAppointments.startTime;
  }
}
