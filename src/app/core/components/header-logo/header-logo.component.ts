import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-header-logo',
  standalone: true,
  imports: [MatIcon, MatTooltip],
  templateUrl: './header-logo.component.html',
  styleUrl: './header-logo.component.scss',
})
export class HeaderLogoComponent {}
