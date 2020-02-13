import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ChartModule } from 'angular2-highcharts';
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';
import { StorageServiceModule } from 'ngx-webstorage-service';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// client views
import { AdminHeaderComponent } from './views/admin/admin-header/admin-header.component';
import { AdminCompteComponent } from './views/admin/admin-compte/admin-compte.component';
import { AdminLoginComponent } from './views/admin/admin-login/admin-login.component';
import { AdminRecuvarComponent } from './views/admin/admin-recuvar/admin-recuvar.component';
import { AdminStocksComponent } from './views/admin/admin-stocks/admin-stocks.component';
import { AdminCreateComponent } from './views/admin/admin-create/admin-create.component';
import { AdminAmisComponent } from './views/admin/admin-amis/admin-amis.component';

declare var require: any;

export function highchartsFactory() {
  const hc = require('highcharts');
  const dd = require('highcharts/modules/drilldown');
  dd(hc);
  return hc;
}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    AdminHeaderComponent,
    AdminCompteComponent,
    AdminLoginComponent,
    AdminRecuvarComponent,
    AdminStocksComponent,
    AdminCreateComponent,
    AdminAmisComponent,
  ],
  imports: [
    BrowserModule,
    StorageServiceModule,
    AppRoutingModule,
    ChartModule,
    FormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  providers: [{
    provide: HighchartsStatic,
    useFactory: highchartsFactory
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
