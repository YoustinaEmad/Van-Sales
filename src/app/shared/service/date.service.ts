import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { }
  getTomorrowDate(): Date {
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);
    return currentDate;
  }
  getFirstDayCurrentMonth(): Date {
    let currentDate = new Date();

    let startDate = new Date();
    startDate.setFullYear(currentDate.getFullYear());
    startDate.setMonth(currentDate.getMonth());
    startDate.setDate(1);
    // console.log("startfDate : "+JSON.stringify(startDate));
    // console.log(startDate.getMonth());
    return startDate;
  }
  getYearStartDay(): Date {
    let currentDate = new Date();
    //alert(currentDate.getMonth());
    let startDate = new Date();
    startDate.setFullYear(currentDate.getFullYear());
    startDate.setMonth(0);
    startDate.setDate(1);
    //// console.log("startDate : "+JSON.stringify(startDate));
    //// console.log(startDate.getMonth());
    return startDate;
  }
  getYearEndDay(): Date {
    let currentDate = new Date();
    //alert(currentDate.getMonth());
    let startDate = new Date();
    startDate.setFullYear(currentDate.getFullYear());
    startDate.setMonth(11);
    startDate.setDate(31);
    //// console.log("startDate : "+JSON.stringify(startDate));
    //// console.log(startDate.getMonth());
    return startDate;
  }

  getSpecificDayOfCurrentMonth(day: number): Date {
    let currentDate = new Date();
    let startDate = new Date();
    if (currentDate.getDate() <= day) {
      startDate.setMonth(currentDate.getMonth() - 1);
    }
    else {
      startDate.setMonth(currentDate.getMonth());
    }
    startDate.setDate(day);
    return startDate;
  }

  getCurrentDateMinusNumberOfDays(numberOfDays: number, currDate = new Date()): Date {
    let date = new Date()
    currDate.setDate(currDate.getDate() - numberOfDays);
    return currDate;
  }
  setDateTimeToDate(date: Date, dateTime: string) {
    dateTime = moment(dateTime, ["hh:mm a"]).format("HH:mm")
    date.setHours(this.getHoursFromDateTime(dateTime));
    date.setMinutes(this.getMinutesFromDateTime(dateTime));
  }
  getHoursFromDateTime(value: string): number {
    return +value.split(":")[0];
  }
  getHoursPeriondFromDateTime(value: string): string {
    let num = +value.split(":")[0];
    let formatedTime = (num > 12) ? num - 12 + ' ' + 'PM' : num + ' ' + 'AM';
    if (num == 12) formatedTime = '12  ' + 'PM'
    return formatedTime;
  }
  getFullTimeFromDate(value: string): string {
    let hour = +value.split(":")[0];
    let min = +value.split(":")[1].split(" ")[0];
    let formatedTime = (hour > 12) ? hour - 12 + ':' + min + ' ' + 'PM' : hour + ' ' + 'AM';
    if (hour == 12) formatedTime = '12  ' + ':' + min + 'PM'
    return formatedTime;
  }
  getMinutesFromDateTime(value: string): number {
    return +value.split(":")[1].split(" ")[0];
  }

  getCurrentDatePlusNumberOfDays(numberOfDays: number, currDate = new Date()): Date {
    let date = new Date(currDate)
    date.setDate(date.getDate() + numberOfDays);
    return date;
  }

  getCurrentWeek(curr = new Date()) {
    let first = curr.getDate() - curr.getDay() - 1; // First day is the day of the month - the day of the week return sunday
    let firstDay = curr.setDate(first)
    let week: Date[] = [
      new Date(firstDay),
      new Date(this.getCurrentDatePlusNumberOfDays(1, new Date(firstDay))),
      new Date(this.getCurrentDatePlusNumberOfDays(2, new Date(firstDay))),
      new Date(this.getCurrentDatePlusNumberOfDays(3, new Date(firstDay))),
      new Date(this.getCurrentDatePlusNumberOfDays(4, new Date(firstDay))),
      new Date(this.getCurrentDatePlusNumberOfDays(5, new Date(firstDay))),
      new Date(this.getCurrentDatePlusNumberOfDays(6, new Date(firstDay))),
    ]
    return week;
  }

  addHourstoDate(hours: number, mins: number, date = new Date()) {
    let dateTime = new Date(date);
    dateTime.setMinutes(mins)
    dateTime.setHours(hours)

    // dateTime.setTime(new Date(dateTime).getTime() + hours * 60 * 60 * 1000);
    return dateTime
  }

  IsEndLessThanStartTime(startTime: string, endTime: string) {
    let startHour = +startTime.split(':')[0]
    let startPeriod = startTime.split(':')[1].split(' ')[1]
    let startMinute = +startTime.split(':')[1].split(' ')[0]

    let endHour = +endTime.split(':')[0]
    let endPeriod = endTime.split(':')[1].split(' ')[1]
    let endMinute = +endTime.split(':')[1].split(' ')[0]

    if (startPeriod == endPeriod) {
      if (endHour < startHour && startHour != 12) {
        return true
      } else if (endHour == startHour && endMinute < startMinute) {
        return true
      }
    }
    return false;
  }

  ConvertToMinutes(date: string | number | Date): number {
    let days = (new Date(date)).getDay() * 1440
    let hours = (new Date(date)).getHours() * 60;
    let minutes = (new Date(date)).getMinutes();
    let time = days + hours + minutes;
    return time;
  }

  addMinutesToDate(date: Date, minutes: number) {
    date.setMinutes(date.getMinutes() + minutes);
  }
//add type to start and end time---->>??
  isTimeRangeValid(startTime:string, endTime:string) {
    const [startHour, startMinute, startPeriod] = startTime.split(/:| /);
    const [endHour, endMinute, endPeriod] = endTime.split(/:| /);
    if (startPeriod === endPeriod) {
      const normalizedStartHour = parseInt(startHour, 10) % 12; // Convert startHour to a number between 0-11
      const normalizedEndHour = parseInt(endHour, 10) % 12; // Convert endHour to a number between 0-11
      if (normalizedEndHour < normalizedStartHour) {
        return false; // Invalid time range: end time is earlier than start time
      } else if (normalizedEndHour === normalizedStartHour && endMinute < startMinute) {
        return false; // Invalid time range: end time is equal to start time but end minute is earlier
      }
    }
    return true; // Valid time range: end time is equal to or later than start time
  }
}
