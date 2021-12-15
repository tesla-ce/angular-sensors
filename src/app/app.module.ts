import { NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {SensorsModule} from "../../projects/tesla-ce/sensors/src/lib/sensors.module";
import {SensorsComponent} from "../../projects/tesla-ce/sensors/src/lib/sensors.component";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SensorsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
