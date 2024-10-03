import { inject, Injectable } from '@angular/core';
import { Appointments, CalendarEvent, HourlyAppointment } from '@core/models';
import { AppointmentsDataService } from '@core/services/appointments-data/appointments-data.service';
import { DateManagerService } from '@core/services/date-manager/date-manager.service';
import {
  formatToTimeString,
  getDateKey,
  getHourlyTime,
  isTimeEqualOrAfter,
} from '@core/utils';
import { combineLatest, map, Observable } from 'rxjs';

@Injectable()
export class CalendarDayViewService {
  private readonly appointmentsDataService = inject(AppointmentsDataService);
  private readonly dateManagerService = inject(DateManagerService);

  // Combined stream of current date and appointments
  readonly dayAppointments$: Observable<HourlyAppointment[]> = combineLatest([
    this.dateManagerService.currentDate$,
    this.appointmentsDataService.appointments$,
  ]).pipe(
    map(([currentDate, appointments]) => {
      return currentDate && appointments
        ? this.getAppointmentsByDate(currentDate, appointments)
        : [];
    })
  );

  /**
   * Fetches and updates appointments by date.
   * @param currentDate Date of the appointments
   * @param appointments All appointments
   * @returns HourlyAppointment[]
   */
  private getAppointmentsByDate(
    currentDate: Date,
    appointments: Appointments
  ): HourlyAppointment[] {
    const dateKey = getDateKey(currentDate);
    const existingAppointments = appointments[dateKey] || [];
    return this.createHourlyAppointments(existingAppointments);
  }

  /**
   * Creates hourly appointments by grouping events into hourly slots.
   * @param appointments List of calendar events
   * @returns HourlyAppointment[]
   */
  private createHourlyAppointments(
    appointments: CalendarEvent[]
  ): HourlyAppointment[] {
    return getHourlyTime().map(({ plainTime, startTime }) => ({
      startTime,
      plainTime,
      data: appointments.filter((appointment) =>
        isTimeEqualOrAfter(startTime, formatToTimeString(appointment.start))
      ),
    }));
  }

  /**
   * Handles drag-and-drop of an appointment to a new start time stamp.
   * @param appointment appointment
   * @param newStartTime string New start time stamp
   */
  moveAppointmentToTimeStamp(
    appointment: CalendarEvent,
    newStartTime: string
  ): void {
    this.appointmentsDataService.moveAppointmentToTimeStamp(
      appointment,
      newStartTime
    );
  }

  /**
   * Creates a new appointment with default data.
   * @param appointmentStart Starting time of the new appointment
   * @returns CalendarEvent
   */
  createNewAppointment(appointmentStart: string): CalendarEvent {
    const date = this.dateManagerService.getCurrentDate();
    const timeStamps =
      this.appointmentsDataService.getNewAppointmentTimeStamps(
        appointmentStart
      );
    return this.appointmentsDataService.defaultAppointmentData(
      date,
      timeStamps
    );
  }
}
