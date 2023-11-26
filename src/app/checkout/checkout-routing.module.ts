import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddressComponent } from './components/address/address.component';
import { PaymentComponent } from './components/payment/payment.component';
import { SuccessComponent } from './components/success/success.component';
import { FailureComponent } from './components/failure/failure.component';
import { StepsComponent } from './components/steps/steps.component';
import { AuthGuard } from '../shared/guards/auth.guard';

const routes: Routes = [
  {
    path: 'steps',
    component: StepsComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'address',
        component: AddressComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'payment',
        component: PaymentComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'success',
        component: SuccessComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'failure',
        component: FailureComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckoutRoutingModule {}
