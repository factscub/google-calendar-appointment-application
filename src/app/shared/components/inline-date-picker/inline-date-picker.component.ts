import {
  Component,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatCalendar, MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatCard } from '@angular/material/card';
import { DateManagerService } from '@core/services/date-manager/date-manager.service';

@Component({
  selector: 'app-inline-date-picker',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatDatepickerModule, MatCard, AsyncPipe],
  templateUrl: './inline-date-picker.component.html',
  styleUrl: './inline-date-picker.component.scss',
})
export class InlineDatePickerComponent implements OnChanges {
  private readonly dateManagerService = inject(DateManagerService);
  @Input() currentDate!: Date;
  @ViewChild('inlineDatePicker') private readonly calendar!: MatCalendar<Date>;

  /**
   * Handles the date change event and updates the current date in the service.
   * @param selectedDate - The newly selected date.
   */
  onDateChanges(selectedDate: Date): void {
    this.dateManagerService.setCurrentDate(selectedDate);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const newCurrentDateObj = changes['currentDate'];
    if (newCurrentDateObj && this.calendar) {
      this.calendar.activeDate = newCurrentDateObj.currentValue;
    }
  }
}
