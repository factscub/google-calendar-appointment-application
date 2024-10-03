import { Component } from '@angular/core';
import { HeaderLogoComponent } from '@core/components/header-logo/header-logo.component';
import { DateNavigationComponent } from '@core/components/date-navigation/date-navigation.component';
import { CalendarViewDropdownComponent } from '@core/components/calendar-view-dropdown/calendar-view-dropdown.component';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    HeaderLogoComponent,
    DateNavigationComponent,
    CalendarViewDropdownComponent,
    MatIcon,
    MatTooltip,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {}
