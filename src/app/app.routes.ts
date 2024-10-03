import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'calendar',
    loadChildren: () =>
      import('@modules/calendar/calendar-routing.module').then(
        (m) => m.CalendarRoutingModule
      ),
  },
  {
    path: '',
    redirectTo: 'calendar',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'calendar',
  },
];
