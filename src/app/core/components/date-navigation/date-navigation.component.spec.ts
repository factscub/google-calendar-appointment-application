import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateNavigationComponent } from './date-navigation.component';

describe('DateNavigationComponent', () => {
  let component: DateNavigationComponent;
  let fixture: ComponentFixture<DateNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateNavigationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DateNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
