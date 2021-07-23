import { NgModule } from '@angular/core';

import { SensorsComponent } from './sensors.component';
import { SensorsService } from './sensors.service';

@NgModule({
  declarations: [
    SensorsComponent,
  ],
  imports: [
  ],
  exports: [SensorsComponent],
  providers: [
    SensorsService,
  ],
})
export class SensorsModule { }
