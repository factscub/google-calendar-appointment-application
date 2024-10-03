import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
} from '@angular/cdk/drag-drop';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { getDateKey, getDatesInSelectedMonth } from '@core/utils';
import type { CalendarEvent } from '@core/models';
import { DateManagerService } from '@core/services/date-manager/date-manager.service';
import { AppointmentsDataService } from '@core/services/appointments-data/appointments-data.service';
import { AppointmentDialogService } from '@core/services/appointment-dialog/appointment-dialog.service';

@Component({
  selector: 'app-calendar-month-view',
  standalone: true,
  imports: [
    NgFor,
    AsyncPipe,
    DatePipe,
    NgClass,
    NgIf,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
  ],
  templateUrl: './calendar-month-view.component.html',
  styleUrl: './calendar-month-view.component.scss',
})
export class CalendarMonthViewComponent implements OnInit {
  readonly getDateKey = getDateKey;
  private readonly destroyCurrentDateRef = inject(DestroyRef);
  private readonly dateManagerService = inject(DateManagerService);
  private readonly appointmentsDataService = inject(AppointmentsDataService);
  private readonly appointmentDialogService = inject(AppointmentDialogService);
  private readonly titleService = inject(Title);

  readonly daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  readonly datesInSelectedMonth$ = new BehaviorSubject<Date[][]>([]);
  readonly appointments$ = this.appointmentsDataService.appointments$;

  ngOnInit(): void {
    this.setTitle();
    this.subscribeToDateChanges();
  }

  // set page title
  setTitle() {
    this.titleService.setTitle('Month View - Calendar');
  }

  /**
   * Subscribes to date changes and updates the selected month's dates.
   * This keeps the component focused on its UI responsibility.
   */
  private subscribeToDateChanges(): void {
    this.dateManagerService.currentDate$
      .pipe(takeUntilDestroyed(this.destroyCurrentDateRef))
      .subscribe(this.updateSelectedMonthDates.bind(this));
  }

  /**
   * Updates the dates displayed in the selected month.
   * This method is used as the subscription handler for the date changes.
   */
  private updateSelectedMonthDates(currentDate: Date): void {
    const dates = getDatesInSelectedMonth(currentDate);
    this.datesInSelectedMonth$.next(dates);
  }

  /**
   * Opens the appointment dialog.
   * @param event MouseEvent to stop propagation
   * @param date Date for the selected appointment
   * @param appointment Optional appointment data to prefill the dialog
   */
  openAppointmentDialog(
    event: MouseEvent,
    date: Date,
    appointment?: CalendarEvent
  ) {
    event.stopPropagation();
    const appointmentData =
      appointment || this.appointmentsDataService.defaultAppointmentData(date);
    this.appointmentDialogService.open(appointmentData);
  }

  /**
   * Track function for weeks. Used for performance optimization when rendering lists.
   */
  trackByWeek(index: number, week: Date[]): string {
    return getDateKey(week[index]);
  }

  /**
   * Unified trackBy function to track both dates and appointments.
   */
  trackBy(_: number, item: Date | CalendarEvent): string {
    return item instanceof Date ? item.toISOString() : item.id;
  }

  /**
   * Checks if the given date is today's date.
   * @param date Date to compare with today's date
   */
  isToday(date: Date): boolean {
    return this.dateManagerService.isToday(date);
  }

  /**
   * Handles the drag-and-drop event.
   *
   * Moves appointment to new date
   */
  dropAppointment(event: CdkDragDrop<CalendarEvent[]>, newDate: Date): void {
    this.appointmentsDataService.moveAppointmentToDate(
      event.item.data,
      newDate
    );
  }
}
