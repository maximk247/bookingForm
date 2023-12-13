import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface RoomType {
  id: number;
  name: string;
}

export interface BookingData {
  roomTypeId: number;
  countOfGuests: number;
  startDate: string;
  endDate: string;
  withAnimal: boolean;
  user: {
    firstName: string;
    lastName: string;
    patronymicName: string;
    birthday: string;
  };
}

@Injectable({ providedIn: 'root' })
export class BookingService {
  private roomTypesSubject = new BehaviorSubject<RoomType[]>([
    { id: 0, name: 'Стандарт одноместный' },
    { id: 1, name: 'Стандарт двухместный' },
    { id: 2, name: 'Семейный (до 4-х гостей)' },
    { id: 3, name: 'Двухкомнатный (до 6-ти гостей)' },
    { id: 4, name: 'Люкс двухместный' }
  ]);

  private bookings: BookingData[] = [];

  get roomTypes$(): Observable<RoomType[]> {
    return this.roomTypesSubject.asObservable();
  }

  bookRoom(bookingData: BookingData): Observable<boolean> {
    console.log('Booking submitted:', bookingData);
    this.bookings.push(bookingData);
    return new BehaviorSubject<boolean>(true).asObservable();
  }
}
