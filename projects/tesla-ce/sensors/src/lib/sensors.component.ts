import {AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core';
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
  @ViewChildren('webcamSensorCanvas') canvas!: QueryList<ElementRef>;
  @ViewChildren('webcamAudio') audio!: QueryList<ElementRef>;
  @ViewChildren('webcamVideo') video!: QueryList<ElementRef>;
  constructor(private sensorService: SensorsService, @Inject(DOCUMENT) document: Document) {
  }

  public ngOnInit(): void {
  }

  public ngAfterViewInit(): void {
    this.sensorService.setCanvas(this.canvas.first);
    this.sensorService.setVideo(this.video.first);
    this.sensorService.setAudio(this.audio.first);
    // this.sensorService.enableSensors(['keyboard']);

    let config = [] as Array<SensorConfig>;
    config.push({
      key: "timeBetweenPictures",
      value: "3000"
    });
    this.sensorService.setConfiguration(config);
    // this.sensorService.start();
    console.log('start sensors component');
  }

  stop() {
    this.sensorService.stop();
  }

  start() {
    this.sensorService.start();
  }

  public ngOnDestroy(): void {

  }
}
