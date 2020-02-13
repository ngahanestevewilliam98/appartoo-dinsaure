import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// middlewares
import { AccessGuard } from './middlewares/access.guard';
import { CanLogoutGuard } from './middlewares/can-logout.guard';
import { IsConnectGuard } from './middlewares/is-connect.guard';
// views admin
import { AdminHeaderComponent } from './views/admin/admin-header/admin-header.component';
import { AdminCompteComponent } from './views/admin/admin-compte/admin-compte.component';
import { AdminLoginComponent } from './views/admin/admin-login/admin-login.component';
import { AdminRecuvarComponent } from './views/admin/admin-recuvar/admin-recuvar.component';
// import { AdminStocksComponent } from './views/admin/admin-stocks/admin-stocks.component';
import { AdminAmisComponent } from './views/admin/admin-amis/admin-amis.component';
import { AdminCreateComponent } from './views/admin/admin-create/admin-create.component';

const routes: Routes = [
  // admin
  {
    path: '',
    component: AdminLoginComponent,
    canActivate: [AccessGuard, CanLogoutGuard]
  },
  {
    path: 'create',
    component: AdminCreateComponent,
    canActivate: [AccessGuard, CanLogoutGuard]
  },
  {
    path: 'recuvar',
    component: AdminRecuvarComponent,
    canActivate: [AccessGuard, CanLogoutGuard]
  },
  {
    path: 'admin',
    component: AdminHeaderComponent,
    canActivate: [AccessGuard],
    children: [
      { path: '', redirectTo: 'compte', pathMatch: 'full' },
      {
        path: 'compte',
        component: AdminCompteComponent,
        canActivate: [IsConnectGuard]
      },
      {
        path: 'amis',
        component: AdminAmisComponent,
        canActivate: [IsConnectGuard]
      },
      {
        path: 'recuvar',
        component: AdminRecuvarComponent,
        canActivate: [IsConnectGuard]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AccessGuard, CanLogoutGuard, IsConnectGuard]
})
export class AppRoutingModule { }
