import {ElementRef, Inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {SensorWebcamService} from './sensor-webcam.service';
import {SensorCapturedData, SensorCode, SensorConfig, SensorEvent, SensorStatusValue} from './sensor.interfaces';
import {SensorKeyboardService} from './sensor-keyboard.service';
import {DOCUMENT} from "@angular/common";


export interface StatusSummary {
  camera: SensorStatusValue;
  microphone: SensorStatusValue;
  keyboard: SensorStatusValue;
  assessment: SensorStatusValue;
}

@Injectable({
  providedIn: 'root'
})
export class SensorsService {
  private enabledSensors = new Array<SensorCode>();
  private webcam: SensorWebcamService = {} as SensorWebcamService;
  private keyboard: SensorKeyboardService = {} as SensorKeyboardService;
  private sample = new BehaviorSubject<SensorCapturedData>({} as SensorCapturedData);
  readonly newData: Observable<SensorCapturedData> = this.sample.asObservable();
  private status = new BehaviorSubject<StatusSummary>({} as StatusSummary);
  readonly statusChange: Observable<StatusSummary> = this.status.asObservable();
  private currentStatus: StatusSummary = {
    camera: SensorStatusValue.disabled,
    microphone: SensorStatusValue.disabled,
    keyboard: SensorStatusValue.disabled,
    assessment: SensorStatusValue.disabled
  };

  // TODO: observable
  private networkQuality = null;
  private document: HTMLDocument = {} as HTMLDocument;

  private canvas: ElementRef<HTMLCanvasElement> = {} as ElementRef<HTMLCanvasElement>;
  private video: ElementRef<HTMLVideoElement> = {} as ElementRef<HTMLVideoElement>;
  private audio: ElementRef<HTMLAudioElement> = {} as ElementRef<HTMLAudioElement>;

  constructor() {
  }

  public setCanvas(canvas:ElementRef<HTMLCanvasElement>) {
    this.canvas = canvas;
  }

  public setAudio(audio: ElementRef<HTMLAudioElement>) {
    this.audio = audio;
  }

  public setVideo(video: ElementRef<HTMLVideoElement>) {
    this.video = video;
  }

  public enableSensors(enabled: Array<SensorCode>): void {
    Object.assign(this.enabledSensors, enabled);

    if (this.enabledSensors.includes('assessment')) {
      this.currentStatus.assessment = SensorStatusValue.ok;
    }

    if (this.enabledSensors.includes('camera') || this.enabledSensors.includes('microphone')) {
      this.webcam = new SensorWebcamService();
      this.webcam.setupDOMElements(this.audio, this.canvas, this.video);
      this.webcam.enableSensors(this.enabledSensors);
      if (this.enabledSensors.includes('camera')) {
        this.currentStatus.camera = SensorStatusValue.unknown;
      }
      if (this.enabledSensors.includes('microphone')) {
        this.currentStatus.microphone = SensorStatusValue.unknown;
      }
      this.webcam.newData.subscribe( sample => {
        this.sample.next(Object.assign({}, sample));
      });
      this.webcam.statusChange.subscribe( status => {
        if (status) {
          this.currentStatus[status.sensor] = status.status;
          this.status.next(Object.assign({}, this.currentStatus));
        }
      });
      this.status.next(Object.assign({}, this.currentStatus));

      this.webcam.eventChange.subscribe( event => {
        if (event) {
          // todo something with event
          // this.event.next(Object.assign({}, event));
        }
      });
    }
    if (this.enabledSensors.includes('keyboard')) {
      this.keyboard = new SensorKeyboardService();
      this.currentStatus.keyboard = SensorStatusValue.unknown;
      this.keyboard.newData.subscribe(sample => {
        this.sample.next(Object.assign({}, sample));
      });
      this.keyboard.statusChange.subscribe( status => {
        if (status) {
          this.currentStatus.keyboard = status.status;
          this.status.next(Object.assign({}, this.currentStatus));
        }
      });
      this.keyboard.eventChange.subscribe( event => {
        if (event) {
          // todo something with event
          // this.event.next(Object.assign({}, event));
        }
      });
    }
  }

  public isEnabled(code: SensorCode): boolean {
    return this.enabledSensors.includes(code);
  }

  public start() {
    if (this.webcam) {
      this.webcam.start();
    }
    if (this.keyboard) {
      this.keyboard.start();
    }
  }

  public stop() {
    if (this.webcam) {
      this.webcam.stop();
    }
    if (this.keyboard) {
      this.keyboard.stop();
    }
  }

  public setConfiguration(config: Array<SensorConfig>) {
    if (Object.keys(this.webcam).length != 0) {
      this.webcam.setConfig(config);
    }
    if (Object.keys(this.keyboard).length != 0) {
      this.keyboard.setConfig(config);
    }
  }
}
