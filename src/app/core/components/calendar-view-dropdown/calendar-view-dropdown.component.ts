import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AsyncPipe, NgFor } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ViewType } from '@core/models';
import { DateManagerService } from '@core/services/date-manager/date-manager.service';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-calendar-view-dropdown',
  standalone: true,
  imports: [NgFor, AsyncPipe, MatFormFieldModule, MatSelectModule, MatTooltip],
  templateUrl: './calendar-view-dropdown.component.html',
  styleUrl: './calendar-view-dropdown.component.scss',
})
export class CalendarViewDropdownComponent implements OnInit {
  readonly calenderViewTypes: ViewType[] = ['day', 'month'];
  private readonly router = inject(Router);
  private readonly dateManagerService = inject(DateManagerService);
  readonly viewType$ = this.dateManagerService.viewType$;

  ngOnInit(): void {
    this.updateViewType();
  }

  /**
   * Handles the change in the calendar view type.
   * @param viewType - The view type selected from the dropdown.
   */
  calendarViewChange(viewType: ViewType): void {
    this.dateManagerService.setCalendarViewType(viewType);
    this.router.navigateByUrl(`calendar/${viewType}`);
  }

  /**
   * Based on the url path , set update the view mode value.
   */
  private updateViewType(): void {
    const urlPathname = location.pathname.split('/')[2];
    const viewMode = this.calenderViewTypes.find(
      (value) => value === urlPathname
    );

    if (viewMode) {
      this.dateManagerService.setCalendarViewType(viewMode);
    } else {
      console.error('Invalid view mode detected:', urlPathname);
    }
  }
}
