import {AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
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

  @ViewChild('webcamSensorCanvas') canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('webcamSensorVideo') video: ElementRef<HTMLVideoElement>;
  public canvasWidth = 640;
  public canvasHeight = 480;

  constructor(@Inject(SensorsService) private sensorService: SensorsService) {

  }

  public ngOnInit(): void {

  }

  public ngAfterViewInit(): void {

  }

  public ngOnDestroy(): void {

  }
}
