export type ToolTip = 'Previous' | 'Next';
export type Direction = -1 | 1;
export type ViewType = 'day' | 'month';

export interface InvalidTimeStamps {
  timeOrder?: boolean;
  timeMismatch?: boolean;
}

export interface TimeStamps {
  start: string;
  end: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  start: Date; // Starting date and time
  end: Date; // Ending date and time
}

export type Appointments = Record<string, CalendarEvent[]>;

export interface HourlyTime {
  plainTime: string;
  startTime: string;
}

export interface HourlyAppointment extends HourlyTime {
  data: CalendarEvent[];
}
