import { CdkDrag, CdkDragMove, CdkDragStart } from '@angular/cdk/drag-drop';
import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BehaviorSubject, debounceTime } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { AppointmentsDataService } from '@core/services/appointments-data/appointments-data.service';
import { formatToTimeString, setTimeToDate, timeValidator } from '@core/utils';
import type { InvalidTimeStamps, CalendarEvent } from '@core/models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-appointment-dialog',
  standalone: true,
  imports: [
    CdkDrag,
    MatCardModule,
    MatInputModule,
    MatIcon,
    MatButtonModule,
    ReactiveFormsModule,
    NgIf,
    NgFor,
    DatePipe,
    AsyncPipe,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './appointment-dialog.component.html',
  styleUrl: './appointment-dialog.component.scss',
})
export class AppointmentDialogComponent implements OnInit {
  private readonly destroyFormRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);
  public readonly dialogRef = inject(MatDialogRef<AppointmentDialogComponent>);
  private readonly appointmentsDataService = inject(AppointmentsDataService);
  public readonly openedModalData = inject(MAT_DIALOG_DATA) as {
    appointmentData: CalendarEvent;
  };
  readonly timeIntervals = this.appointmentsDataService.timeIntervals;
  invalidTimeStamps = new BehaviorSubject<InvalidTimeStamps | null>(null);
  appointmentForm: FormGroup;
  isExistingAppointment = false;
  isDialogDraggable = true;

  constructor() {
    this.isExistingAppointment = !!this.openedModalData.appointmentData.title;
    this.appointmentForm = this.createForm(
      this.openedModalData.appointmentData
    );
  }

  ngOnInit(): void {
    this.subscribeToFormChanges();
  }
  /**
   * Creates a reactive form based on the provided appointment data.
   * @param appointmentData The existing appointment data for initialization.
   * @returns FormGroup The reactive form group.
   */
  private createForm(appointmentData: CalendarEvent): FormGroup {
    const { id, title, start, end, description } = appointmentData;
    return this.formBuilder.group({
      id: id,
      date: start,
      title: [title, Validators.required],
      start: [formatToTimeString(start), Validators.required],
      end: [formatToTimeString(end), Validators.required],
      description: [description, Validators.required],
    });
  }

  /** Closes the dialog without saving changes. */
  close(): void {
    this.dialogRef.close();
  }

  /** Deletes the current appointment and closes the dialog. */
  deleteAppointment(): void {
    const appointmentId = this.appointmentForm.value.id;
    this.appointmentsDataService.deleteAppointment(appointmentId);
    this.close();
  }

  /** Saves changes made to the appointment and closes the dialog. */
  saveChanges(): void {
    if (this.isFormInvalid()) {
      this.appointmentForm.markAllAsTouched();
      return;
    }

    const appointmentFormData = this.extractAppointmentData();
    this.appointmentsDataService.saveAppointment(appointmentFormData);
    this.close();
  }

  /**
   * Checks if the form is invalid or has invalid time stamps.
   * @returns boolean True if the form is invalid, otherwise false.
   */
  private isFormInvalid(): boolean {
    return !!(this.appointmentForm.invalid || this.invalidTimeStamps.value);
  }

  /**
   * Extracts the appointment data from the form and sets the correct date and time.
   * @returns The appointment data ready for saving.
   */
  private extractAppointmentData(): CalendarEvent {
    const { date, ...formData } = this.appointmentForm.value;
    formData.start = setTimeToDate(date, formData.start);
    formData.end = setTimeToDate(date, formData.end);
    return formData;
  }

  /**
   * Handles the start of the drag event.
   * Determines whether the dialog can be dragged based on the target element.
   * @param event The drag start event.
   */
  onDragStart(event: CdkDragStart) {
    const isElementPresnt = !!(event.event.target as HTMLElement).closest(
      '.appointment-details'
    );
    this.isDialogDraggable = !isElementPresnt;
  }

  /**
   * Handles the drag move event.
   * Resets the drag operation if the dialog is not draggable.
   * @param event The drag move event.
   */
  onDragMoved(event: CdkDragMove) {
    if (!this.isDialogDraggable) {
      event.source.reset();
    }
  }

  /** Subscribes to form value changes to validate time stamps. */
  private subscribeToFormChanges() {
    this.appointmentForm.valueChanges
      .pipe(debounceTime(500))
      .pipe(takeUntilDestroyed(this.destroyFormRef))
      .subscribe((newValue) => {
        const timeStamps = {
          start: newValue.start,
          end: newValue.end,
        };
        const errors = timeValidator(this.timeIntervals, timeStamps);
        this.invalidTimeStamps.next(errors);
      });
  }
}
