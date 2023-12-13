
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BookingRoutingModule } from './booking-routing.module';
import { BookingServicesModule } from './booking-services.module';

import { SharedModule } from '@shared/shared.module';
import { PAGES } from './pages';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        ...PAGES
    ],
    exports: [],
    imports: [
        CommonModule,
        RouterModule,

        BookingServicesModule,
        BookingRoutingModule,
        ReactiveFormsModule,
        SharedModule
    ],
    providers: []
})
export class BookingModule { }
