import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import faLocale from '@fullcalendar/core/locales/fa';
import * as moment from 'jalali-moment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-calendar',
  templateUrl: './jalali.component.html',
  styleUrls: ['./jalali.component.css']
})
export class JalaliComponent implements OnInit {

  private subscriptions: Subscription = new Subscription();

  isLoadComplete = false;

  calendarOptions: CalendarOptions = {
    locales: [faLocale],
    timeZone: 'local',
    direction: 'rtl',
    initialView: 'dayGrid',
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    nowIndicator: true,
    navLinks: true,
  };

  curentServerDate = new Date();
  curentActiveMonth = new Date();

  constructor() { }

  ngOnInit(): void {

      const curentJalaiActiveMonth = moment(new Date(this.curentServerDate)).locale('fa').format('YYYY/MM/01');
      this.curentActiveMonth = new Date(moment.from(curentJalaiActiveMonth, 'fa', 'YYYY/MM/DD').format('YYYY-MM-DD'));

      this.calculateCalendarDays(this.curentServerDate);
  }

  calculateCalendarDays(activeDate: Date): void {
    this.isLoadComplete = false;

    const jalaiMonthStartDate = moment(new Date(activeDate)).locale('fa').format('YYYY/MM/01');

    const hlpDate = new Date(moment.from(jalaiMonthStartDate, 'fa', 'YYYY/MM/DD').format('YYYY-MM-DD'));

    const calendarStartDate = hlpDate;
    if (hlpDate.getDay() !== 6) {
      calendarStartDate.setDate(calendarStartDate.getDate() - (hlpDate.getDay() + 1))
    }

    const calendarEndDate = new Date(calendarStartDate);
    calendarEndDate.setDate(calendarEndDate.getDate() + 41)

    this.calendarOptions.visibleRange = {
      start: calendarStartDate,
      end: calendarEndDate
    };

    const hlpMonthStartDayDate = new Date(moment.from(jalaiMonthStartDate, 'fa', 'YYYY/MM/DD').format('YYYY-MM-DD'));
    const jalaiMonthEndDate = moment(new Date(activeDate)).locale('fa').add(1, 'jMonth').format('YYYY/MM/01');
    const hlpMonthEndDayDate = new Date(moment.from(jalaiMonthEndDate, 'fa', 'YYYY/MM/DD').format('YYYY-MM-DD'));

    this.calendarOptions.dayCellDidMount = ((arg: any) => {

      const calendar = document.getElementsByClassName('fc-daygrid-day');

      for (let i = 0; i < calendar.length; i++) {

        // reset day status
        calendar[i].className = calendar[i].className.replace(' fc-day-other', '');

        if ((new Date(calendar[i].getAttribute('data-date') as string)).getTime() >= new Date(formatDate(hlpMonthEndDayDate, 'yyyy-MM-dd', 'en_US')).getTime() ||
          (new Date(calendar[i].getAttribute('data-date') as string)).getTime() < new Date(formatDate(hlpMonthStartDayDate, 'yyyy-MM-dd', 'en_US')).getTime()) {
          calendar[i].className += ' fc-day-other';
        }
      }

    });

    this.isLoadComplete = true;
  }

  showNextMonth(): void {
    const jalaiNextMonth = moment(new Date(this.curentActiveMonth)).locale('fa').add(1, 'jMonth').format('YYYY/MM/01');
    this.curentActiveMonth = new Date(moment.from(jalaiNextMonth, 'fa', 'YYYY/MM/DD').format('YYYY-MM-DD'));

    this.calculateCalendarDays(this.curentActiveMonth);
  }

  showPreviousMonth(): void {
    const jalaiPreviousMonth = moment(new Date(this.curentActiveMonth)).locale('fa').subtract(1, 'jMonth').format('YYYY/MM/01');
    this.curentActiveMonth = new Date(moment.from(jalaiPreviousMonth, 'fa', 'YYYY/MM/DD').format('YYYY-MM-DD'));

    this.calculateCalendarDays(this.curentActiveMonth);
  }

}
