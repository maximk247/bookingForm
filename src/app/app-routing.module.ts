import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '@app/layout';
import { ModulesInfo } from '@app/modules';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: '',
                loadChildren: () =>
                    import('./modules/home/home.module').then(
                        (module) => {
                            console.log(module)
                           return module.HomeModule
                        }
                    ),
                data: { module: ModulesInfo.home.name },
            },
            {
                path: 'reservation',
                loadChildren: () =>
                    import('./modules/booking/booking.module').then(
                        (module) => {
                            console.log(module)
                            return module.BookingModule
                        }
                        
                    ),
                data: { module: ModulesInfo.booking.name },
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
