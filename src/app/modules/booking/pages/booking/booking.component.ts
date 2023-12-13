import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl,
    AbstractControl,
} from '@angular/forms';
import {
    BookingData,
    BookingService,
    RoomType,
} from './../../services/booking.service';
import { catchError, map } from 'rxjs/operators';

// Кастомный валидатор для проверки только чисел
function onlyNumbers(control: AbstractControl): { [key: string]: any } | null {
    const pattern = /^[1-6]*$/;
    const valid = pattern.test(control.value);
    return valid ? null : { invalidNumber: true };
}

@Component({
    selector: 'app-booking',
    templateUrl: './booking.component.html',
})
export class BookingComponent implements OnInit {
    bookingForm: FormGroup; // Группа формы для бронирования
    roomTypes: RoomType[] = []; // Массив типов номеров

    constructor(
        private fb: FormBuilder, // Используется для построения формы
        private bookingService: BookingService // Сервис для бронирования
    ) {}

    ngOnInit(): void {
        this.bookingService.roomTypes$.subscribe(
            (types) => (this.roomTypes = types)
        ); // Подписываемся на поток roomTypes$ и обновляем roomTypes
        this.initForm(); // Инициализируем форму
    }

    private initForm() {
        this.bookingForm = new FormGroup({
            firstName: new FormControl('', [
                Validators.required, // Обязательное поле
                Validators.pattern('[a-zA-Z]*'), // Допускаются только буквы
            ]),
            lastName: new FormControl('', [
                Validators.required, // Обязательное поле
                Validators.pattern('[a-zA-Z]*'), // Допускаются только буквы
            ]),
            patronymicName: new FormControl(
                '',
                Validators.pattern('[a-zA-Z]*')
            ), // Допускаются только буквы
            birthday: new FormControl(null, Validators.required), // Обязательное поле
            roomTypeId: new FormControl(null, Validators.required), // Обязательное поле
            countOfGuests: new FormControl({ value: 1, disabled: false }, [
                Validators.required, // Обязательное поле
                onlyNumbers, // Кастомный валидатор для проверки только чисел
            ]),
            startDate: new FormControl(null, Validators.required), // Обязательное поле
            endDate: new FormControl(null, Validators.required), // Обязательное поле
            withAnimal: new FormControl({ value: false, disabled: false }), // По умолчанию false
        });
        this.handleRoomTypeChanges(); // Обрабатываем изменения в типе номера
    }

    private handleRoomTypeChanges() {
        this.bookingForm
            .get('roomTypeId')
            ?.valueChanges.subscribe((roomTypeId) => {
                let maxGuests = 10;
                switch (roomTypeId) {
                    case '0':
                        maxGuests = 1;
                        break;
                    case '1':
                        maxGuests = 2;
                        break;
                    case '2':
                        maxGuests = 4;
                        break;
                    case '3':
                        maxGuests = 6;
                        break;
                    case '4':
                        maxGuests = 2;
                        break;
                }
                console.log(maxGuests);
                // Получаем контрол countOfGuests
                const countOfGuests = this.bookingForm.get('countOfGuests');

                countOfGuests?.setValidators([
                    Validators.required, // Обязательное поле
                    onlyNumbers, // Кастомный валидатор для проверки только чисел
                    Validators.min(1), // Минимальное значение
                    Validators.max(maxGuests), // Максимальное значение
                ]);
                countOfGuests?.updateValueAndValidity(); // Обновляем состояние и валидацию

                if (roomTypeId === '0') {
                    // Устанавливаем значение по умолчанию и блокируем поле
                    countOfGuests?.setValue(1);
                    countOfGuests?.disable();
                } else {
                    // Разблокируем поле
                    countOfGuests?.enable();
                }
            });
    }

    onSubmit(): void {
        if (this.bookingForm.valid) {
            if (this.bookingForm.value.countOfGuests === undefined) {
                this.bookingForm.value.countOfGuests = 1;
            } // когда roomTypeId = '0', то this.bookingForm.value.countOfGuests === undefined
            
            const bookingData = {
                roomTypeId: +this.bookingForm.value.roomTypeId, // Преобразовать в число
                countOfGuests: +this.bookingForm.value.countOfGuests, // Преобразовать в число
                startDate: this.bookingForm.value.startDate,
                endDate: this.bookingForm.value.endDate,
                withAnimal: this.bookingForm.value.withAnimal,
                user: {
                    firstName: this.bookingForm.value.firstName,
                    lastName: this.bookingForm.value.lastName,
                    patronymicName: this.bookingForm.value.patronymicName,
                    birthday: this.bookingForm.value.birthday,
                },
            };
            this.bookRoom(bookingData); // Отправляем данные на бронирование
        } else {
            this.validateAllFormFields(this.bookingForm); // Помечаем поля как "прикоснувшиеся"
        }
    }

    private bookRoom(bookingData: BookingData): void {
        this.bookingService
            .bookRoom(bookingData)
            .pipe(
                map((success) => {
                    if (success) {
                        console.log('Booking successful:', bookingData);
                    }
                }),
                catchError((error) => {
                    console.error(error);
                    return [];
                })
            )
            .subscribe();
    }

    private validateAllFormFields(formGroup: FormGroup): void {
        Object.keys(formGroup.controls).forEach((field) => {
            const control = formGroup.get(field);
            if (control instanceof FormGroup) {
                this.validateAllFormFields(control); // Рекурсивно помечаем все поля как "прикоснувшиеся"
            } else {
                control?.markAsTouched({ onlySelf: true }); // Помечаем поле как "прикоснувшееся"
            }
        });
    }
}
