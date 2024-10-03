import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Direction, ToolTip } from '@core/models';
import { DateManagerService } from '@core/services/date-manager/date-manager.service';

@Component({
  selector: 'app-date-navigation',
  standalone: true,
  imports: [MatIcon, MatTooltip, DatePipe, AsyncPipe],
  templateUrl: './date-navigation.component.html',
  styleUrl: './date-navigation.component.scss',
})
export class DateNavigationComponent {
  private readonly dateManagerService = inject(DateManagerService);
  currentDate$ = this.dateManagerService.currentDate$;
  today = this.dateManagerService.today;

  /**
   * Resets the current date to today.
   */
  setCurrentDay(): void {
    this.dateManagerService.setToday();
  }

  /**
   * Retrieves the tooltip text based on the action type.
   * @param type - The type of tooltip (e.g., 'Previous' or 'Next').
   * @returns The tooltip text.
   */
  getTooltip(type: ToolTip): string {
    return this.dateManagerService.getTooltipText(type);
  }

  /**
   * Navigates to the dates in the calendar view.
   */
  changeDateView(direction: Direction): void {
    this.dateManagerService.changeDateView(direction);
  }
}
