import {AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit } from '@angular/core';
import {SensorsService} from './sensors.service';

/** @dynamic */
@Component({
  selector: 'lib-sensor',
  templateUrl: './sensors.component.html',
  styleUrls: [
    './sensors.component.scss'
  ],
})
export class SensorsComponent implements OnInit, AfterViewInit, OnDestroy {
  public canvasWidth = 640;
  public canvasHeight = 480;

  constructor(@Inject(SensorsService) private sensorService: SensorsService) {
  }

  public ngOnInit(): void {
    this.sensorService.enableSensors(['camera'])

  }

  public ngAfterViewInit(): void {
    this.sensorService.start();
  }

  public ngOnDestroy(): void {

  }
}
