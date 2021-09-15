import {AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChildren} from '@angular/core';
import {SensorsService} from './sensors.service';
import {DOCUMENT} from "@angular/common";
import {SensorConfig} from "./sensor.interfaces";


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
  @ViewChildren('webcamSensorCanvas') canvas;
  @ViewChildren('webcamAudio') audio;
  @ViewChildren('webcamVideo') video;
  constructor(private sensorService: SensorsService, @Inject(DOCUMENT) document: Document) {
  }

  public ngOnInit(): void {

  }

  public ngAfterViewInit(): void {
    this.sensorService.setCanvas(this.canvas);
    this.sensorService.setVideo(this.video);
    this.sensorService.setAudio(this.audio);

    this.sensorService.enableSensors(['camera']);

    let config = [];
    config.push({
      key: "timeBetweenPictures",
      value: 3000
    });
    this.sensorService.setConfiguration(config);
    this.sensorService.start();

  }

  public ngOnDestroy(): void {

  }
}
