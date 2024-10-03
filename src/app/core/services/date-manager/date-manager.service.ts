import { Injectable } from '@angular/core';
import type { Direction, ToolTip, ViewType } from '@core/models';
import { BehaviorSubject } from 'rxjs';
import { getDateKey } from '@core/utils';

/**
 * DateManagerService is responsible for managing and providing access to the current date,
 * and the view type of a date interface (e.g., day or month).
 * It facilitates operations related to date manipulation, allowing components to interact
 * with dates in a consistent manner.
 */
@Injectable({
  providedIn: 'root',
})
export class DateManagerService {
  readonly today = new Date();
  private readonly currentDateSubject = new BehaviorSubject<Date>(this.today);
  private readonly calendarViewTypeSubject = new BehaviorSubject<ViewType>(
    'day'
  );
  readonly currentDate$ = this.currentDateSubject.asObservable();
  readonly viewType$ = this.calendarViewTypeSubject.asObservable();

  /**
   * Checks if the provided date is today.
   * @param date The date to check.
   * @returns True if the date is today, otherwise false.
   */
  isToday(date: Date): boolean {
    return getDateKey(date) === getDateKey(this.today);
  }

  /**
   * Sets the current date to today.
   */
  setToday(): void {
    this.setCurrentDate(new Date());
  }

  /**
   * Gets the current date.
   * @returns The current date.
   */
  getCurrentDate(): Date {
    return this.currentDateSubject.value;
  }

  /**
   * Sets the current date.
   * @param date The date to set as current.
   */
  setCurrentDate(date: Date): void {
    this.currentDateSubject.next(date);
  }

  /**
   * Sets the current view type.
   * @param viewType The view type to set.
   */
  setCalendarViewType(viewType: ViewType) {
    this.calendarViewTypeSubject.next(viewType);
  }

  /**
   * Gets the current view type.
   * @returns The current view type.
   */
  getCalendarViewType(): ViewType {
    return this.calendarViewTypeSubject.value;
  }

  /**
   * Changes the current date based on the direction.
   * @param direction The direction to change the date (e.g., -1 for previous, +1 for next).
   */
  changeDateView(direction: Direction): void {
    const newDate = this.calculateNewDate(direction);
    this.setCurrentDate(newDate);
  }

  /**
   * Calculates a new date based on the direction.
   * @param direction The direction to change the date.
   * @returns The new date.
   */
  private calculateNewDate(direction: Direction): Date {
    const currentDate = this.getCurrentDate();
    const calendarViewType = this.getCalendarViewType();
    const newDate = new Date(currentDate);

    if (calendarViewType === 'day') {
      newDate.setDate(newDate.getDate() + direction);
    } else if (calendarViewType === 'month') {
      newDate.setMonth(newDate.getMonth() + direction);
    }

    return newDate;
  }

  /**
   * Returns tooltip text based on the tooltip type and current view type.
   * @param type The tooltip type.
   * @returns The tooltip text.
   */
  getTooltipText(type: ToolTip): string {
    const calendarViewType = this.getCalendarViewType();
    return `${type} ${calendarViewType}`;
  }
}
