import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet,
} from '@angular/router';
import { CalendarBodyWrapperComponent } from './shared/components/calendar-body-wrapper/calendar-body-wrapper.component';
import { SidenavComponent } from './shared/components/sidenav/sidenav.component';
import { HeaderComponent } from '@core/header/header.component';
import { NgComponentOutlet, NgIf } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NgIf,
    NgComponentOutlet,
    CalendarBodyWrapperComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly destroyRouterEventsRef = inject(DestroyRef);
  loading = true;
  headerComponent: typeof HeaderComponent | undefined;
  sideNavComponent: typeof SidenavComponent | undefined;

  ngOnInit(): void {
    this.routerEventsSubscriber();
    this.lazyLoadComponents();
  }

  private routerEventsSubscriber(): void {
    this.router.events
      .pipe(takeUntilDestroyed(this.destroyRouterEventsRef))
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.loading = true;
        } else if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        ) {
          this.loading = false;
        }
      });
  }

  private async lazyLoadComponents() {
    const [{ HeaderComponent }, { SidenavComponent }] = await Promise.all([
      import('@core/header/header.component'),
      import('@shared/components/sidenav/sidenav.component'),
    ]);

    this.headerComponent = HeaderComponent;
    this.sideNavComponent = SidenavComponent;
  }
}
