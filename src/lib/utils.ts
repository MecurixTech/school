import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface ScheduleEvent {
  title: string;
  start: Date;
  end: Date;
  [key: string]: any;
}

export function adjustScheduleToCurrentWeek(events: ScheduleEvent[]): ScheduleEvent[] {
  const now = new Date();
  const currentDay = now.getDay(); // 0 (Sunday) to 6 (Saturday)
  const currentDate = now.getDate();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  // Get the first day of the current week (Sunday)
  const firstDayOfWeek = new Date(currentYear, currentMonth, currentDate - currentDay);
  
  return events.map(event => {
    const eventDate = new Date(event.start);
    const eventDay = eventDate.getDay();
    const eventHours = eventDate.getHours();
    const eventMinutes = eventDate.getMinutes();
    
    // Create a new date for the current week
    const adjustedDate = new Date(firstDayOfWeek);
    adjustedDate.setDate(firstDayOfWeek.getDate() + eventDay);
    adjustedDate.setHours(eventHours, eventMinutes, 0, 0);
    
    // Calculate end time based on original duration
    const duration = new Date(event.end).getTime() - eventDate.getTime();
    const adjustedEndDate = new Date(adjustedDate.getTime() + duration);
    
    return {
      ...event,
      start: adjustedDate,
      end: adjustedEndDate
    };
  });
}
