import { Component, EventEmitter, Output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-create-appointment-button',
  standalone: true,
  imports: [MatButton, MatTooltip],
  templateUrl: './create-appointment-button.component.html',
  styleUrl: './create-appointment-button.component.scss',
})
export class CreateAppointmentButtonComponent {
  @Output() buttonClick = new EventEmitter<void>();

  onClick(): void {
    this.buttonClick.emit();
  }
}
