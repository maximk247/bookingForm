import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BookingComponent } from './pages';
import { ModulesInfo } from '../index';

const routes: Routes = [
    {
        path: '',
        component: BookingComponent,
        data: {
            mode: ModulesInfo.booking.name,
            needNavigationInsideTheModule: false,
        },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
})
export class BookingRoutingModule {}
