import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: 'day',
    loadComponent: () =>
      import(
        '@modules/calendar/pages/calendar-day-view/calendar-day-view.component'
      ).then((m) => m.CalendarDayViewComponent),
  },
  {
    path: 'month',
    loadComponent: () =>
      import(
        '@modules/calendar/pages/calendar-month-view/calendar-month-view.component'
      ).then((m) => m.CalendarMonthViewComponent),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'day',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalendarRoutingModule {}
