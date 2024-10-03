import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-calendar-body-wrapper',
  standalone: true,
  imports: [MatSidenavModule],
  templateUrl: './calendar-body-wrapper.component.html',
  styleUrl: './calendar-body-wrapper.component.scss',
})
export class CalendarBodyWrapperComponent {}
