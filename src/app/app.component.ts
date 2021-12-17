import {AfterViewInit, Component} from '@angular/core';
import {SensorsService} from "../../projects/tesla-ce/sensors/src/public-api";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit{
  title = 'TeSLA Sensors Demo';
  public icons: string[] = [];
  public status: string[] = [];

  constructor(public sensorsService: SensorsService) {

  }

  ngAfterViewInit() {
    this.sensorsService.enableSensors(['keyboard', 'camera', 'microphone', 'assessment']);
    this.sensorsService.start();
  }
}
