import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  dateReviver,
  deepCopy,
  formatToTimeString,
  generateTimeIntervals,
  getDateKey,
  parseTime,
  setTimeToDate,
} from '@core/utils';
import type { TimeStamps, Appointments, CalendarEvent } from '@core/models';

/**
 * The `AppointmentsDataService` is a service responsible for managing the state of calendar appointments.
 *
 * Key Responsibilities:
 * - Retrieve and store appointments in `localStorage` for persistence.
 * - Provide a reactive stream (`appointments$`) for components to subscribe to and respond to changes.
 * - Manage CRUD operations for appointments, including adding, updating, and deleting.
 * - Handle time-sensitive calculations for appointment start and end times, and move them between days.
 */
@Injectable({
  providedIn: 'root',
})
export class AppointmentsDataService {
  private readonly localStorageKey = 'appointments';
  private readonly appointmentsSubject = new BehaviorSubject<Appointments>(
    this.getAppointmentsFromLocalstorage()
  );
  readonly appointments$ = this.appointmentsSubject.asObservable();
  readonly timeIntervals = generateTimeIntervals();

  /**
   * Retrieves a deep copy of the current appointments state from the BehaviorSubject.
   * Useful for maintaining immutability when manipulating the data.
   *
   * @returns Appointments - A deep copy of the current appointments.
   */
  getAppointments(): Appointments {
    return deepCopy(this.appointmentsSubject.value);
  }

  /**
   * Adds a new appointment or updates an existing one. If an appointment with the
   * same ID exists for the same date, it will be replaced. The updated appointments
   * data is then saved to localStorage.
   *
   * @param appointment - The appointment to add or update.
   */
  saveAppointment(appointment: CalendarEvent): void {
    const appointmentsCopy = this.getAppointments();
    const allAppointments = Object.values(appointmentsCopy).flat();
    const updatedAppointments = this.filterBy(allAppointments, {
      id: appointment.id,
    });
    updatedAppointments.push(appointment);
    const groupedAppointments =
      this.groupAppointmentsByDate(updatedAppointments);
    this.updateAppointments(groupedAppointments);
  }

  /**
   * Groups appointments back into a map of appointments by date.
   * @param appointments - Array of all appointments
   */
  private groupAppointmentsByDate(appointments: CalendarEvent[]): Appointments {
    return appointments.reduce((acc: Appointments, appointment) => {
      const dateKey = getDateKey(appointment.start);
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(appointment);
      return acc;
    }, {});
  }

  /**
   * Updates the BehaviorSubject with new appointments and saves them to localStorage.
   * This ensures that all subscribers to the `appointments$` observable are updated.
   *
   * @param appointments - The updated appointments object to persist.
   */
  updateAppointments(appointments: Appointments): void {
    this.appointmentsSubject.next(appointments);
    this.saveAppointmentsToLocalStorage(appointments);
  }

  /**
   * Deletes an appointment by its ID across all dates. It iterates through
   * each date and removes any appointment with the matching ID.
   *
   * @param appointmentId - The ID of the appointment to delete.
   */
  deleteAppointment(appointmentId: string): void {
    const updatedAppointments = this.getAppointments();
    Object.keys(updatedAppointments).forEach((dateKey) => {
      updatedAppointments[dateKey] = this.filterBy(
        updatedAppointments[dateKey],
        { id: appointmentId }
      );
    });
    this.updateAppointments(updatedAppointments);
  }

  /**
   * Moves an appointment from one date to another and reorders it within the target date.
   * @param params - appointment and newDate.
   */
  moveAppointmentToDate(appointment: CalendarEvent, newDate: Date): void {
    appointment.start = this.updateDateKeepTime(appointment.start, newDate);
    appointment.end = this.updateDateKeepTime(appointment.end, newDate);
    this.saveAppointment(appointment);
  }

  /**
   * Updates only year, month and day form olddate to newdate, but not time
   * @param params - olddate and newDate.
   */
  private updateDateKeepTime(oldDate: Date, newDate: Date): Date {
    oldDate.setFullYear(
      newDate.getFullYear(),
      newDate.getMonth(),
      newDate.getDate()
    );
    return oldDate;
  }

  /**
   * Moves an appointment to a new time stamp by recalculating the start and end times
   * based on the new time stmmp selected. It saves the updated appointment details.
   *
   * @param {CalendarEvent} appointment - The appointment object containing the start and end times.
   * @param {string} newStartTime - The new start time stamp (formatted as a string) to which the appointment is moved.
   */
  moveAppointmentToTimeStamp(
    appointment: CalendarEvent,
    newStartTime: string
  ): void {
    const startTime = formatToTimeString(appointment.start);
    const endTime = formatToTimeString(appointment.end);
    const timeStampsDifference = this.getTimeStampsDifference(
      startTime,
      endTime
    );
    const newStart = this.getNewStartTime(newStartTime, startTime);
    const newEnd = this.getNewEndTime(newStart, timeStampsDifference);
    
    if (newStart === newEnd) return this.saveAppointment(appointment);
    const updatedAppointment = this.updateAppointmentTimes(
      appointment,
      newStart,
      newEnd
    );
    this.saveAppointment(updatedAppointment);
  }

  /**
   * Calculates the difference between two time stamps (start and end) in terms of
   * their positions in the `timeIntervals` array.
   *
   * @param {string} startTime - The start time of the appointment (formatted as a string).
   * @param {string} endTime - The end time of the appointment (formatted as a string).
   * @returns {number} The difference between the start and end time stamps.
   */
  private getTimeStampsDifference(startTime: string, endTime: string): number {
    const startIndex = this.getTimeIndex(startTime);
    const endIndex = this.getTimeIndex(endTime);
    return endIndex - startIndex;
  }

  /**
   * Calculates the new start time of the appointment based on the selected new start time stamp.
   * Combines the new hour with the current start time's minutes.
   *
   * @param {string} newStartTime - The new start time stamp (formatted as a string).
   * @param {string} currentStartTime - The current start time of the appointment (formatted as a string).
   * @returns {string} The new start time of the appointment in the desired format.
   */
  private getNewStartTime(
    newStartTime: string,
    currentStartTime: string
  ): string {
    const newParsedTime = parseTime(newStartTime);
    const startTime = parseTime(currentStartTime);

    return `${newParsedTime.hours}:${startTime.minutes
      .toString()
      .padStart(2, '0')}${newParsedTime.amPm}`;
  }

  /**
   * Calculates the new end time of the appointment based on the new start time and
   * the original duration of the appointment.
   *
   * @param {string} newStartTime - The new start time of the appointment (formatted as a string).
   * @param {number} timeStampsDifference - The difference in time stamps between the original start and end times.
   * @returns {string} The new end time of the appointment.
   */
  private getNewEndTime(
    newStartTime: string,
    timeStampsDifference: number
  ): string {
    const endTimeIndex = this.getTimeIndex(newStartTime);
    return (
      this.timeIntervals[endTimeIndex + timeStampsDifference] ||
      this.timeIntervals[this.timeIntervals.length - 1]
    );
  }

  /**
   * Updates the appointment object with the newly calculated start and end times.
   *
   * @param {CalendarEvent} appointment - The original appointment object.
   * @param {string} newStart - The new start time of the appointment.
   * @param {string} newEnd - The new end time of the appointment.
   * @returns {CalendarEvent} A new appointment object with updated start and end times.
   */
  private updateAppointmentTimes(
    appointment: CalendarEvent,
    newStart: string,
    newEnd: string
  ): CalendarEvent {
    return {
      ...appointment,
      start: setTimeToDate(appointment.start, newStart),
      end: setTimeToDate(appointment.end, newEnd),
    };
  }

  /**
   * Creates a new default appointment object with a unique ID, title, start/end times, and description.
   * The start and end times default to 12:00 AM and 1:00 AM, respectively, for the given date.
   *
   * @param date - The date for which the default appointment should be created.
   * @param timeStamps - an object that contains start and end time stamps
   * @returns CalendarEvent - A default appointment object.
   */
  defaultAppointmentData(
    date: Date,
    { start, end }: TimeStamps = { start: '12:00am', end: '1:00am' }
  ): CalendarEvent {
    return {
      id: self.crypto.randomUUID(),
      title: '',
      start: setTimeToDate(date, start),
      end: setTimeToDate(date, end),
      description: '',
    };
  }

  /**
   * Filters out an object by its key from an array of objects.
   *
   * @param array - The array of objects to filter.
   * @param key - The key of the object to remove.
   * @returns array[] - The filtered array of objects.
   */
  private filterBy<T>(items: T[], criteria: Partial<T>): T[] {
    const key = Object.keys(criteria)[0] as keyof T;
    const value = criteria[key];

    return items.filter((item) => item[key] !== value);
  }

  /**
   * function to get the index of a time in an array of time intervals.
   *
   * @param timeToFind - The time string whose index is to be found.
   * @returns The index of the time in the array, or -1 if not found.
   */
  private getTimeIndex(timeToFind: string): number {
    return this.timeIntervals.findIndex((time) => time === timeToFind);
  }

  /**
   * Retrieves the appointments data from localStorage.
   * If appointments exist in localStorage, it parses them using `dateReviver`
   * to correctly handle Date objects. If not, returns an empty object.
   *
   * @returns Appointments - The parsed appointments data from localStorage or an empty object if none exist.
   */
  private getAppointmentsFromLocalstorage(): Appointments {
    const storedAppointments = localStorage.getItem(this.localStorageKey);
    return storedAppointments
      ? JSON.parse(storedAppointments, dateReviver)
      : {};
  }

  /**
   * Saves the given appointments object to localStorage as a string.
   *
   * @param appointments - The current appointments object to save.
   */
  private saveAppointmentsToLocalStorage(appointments: Appointments): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(appointments));
  }

  /**
   * Calculates the start and end time stamps for a new appointment.
   * @param start Starting time
   * @returns TimeStamps object with start and end time
   */
  getNewAppointmentTimeStamps(start: string): TimeStamps {
    const timeIntervals = this.timeIntervals;
    const timeIndex = this.getTimeIndex(start);

    return {
      start,
      end: timeIntervals[timeIndex + 4] || timeIntervals[timeIndex + 3],
    };
  }
}
