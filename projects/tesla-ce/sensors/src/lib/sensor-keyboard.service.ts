import {Injectable} from '@angular/core';
import {Sensor, SensorStatusValue} from './sensor.interfaces';
import {Observable, fromEvent, Subscription} from 'rxjs';
import {SensorsComponent} from './sensors.component';
import {TeslaKeyboard} from './tesla-keyboard';

export interface KeyEvent {
  when: Date;
  key: string;
  code: number;
  event: 'keyup' | 'keydown';
}

@Injectable({
  providedIn: 'root'
})
export class SensorKeyboardService extends Sensor {
  private keyEvents: Subscription;
  private keyboard: TeslaKeyboard;
  private lastDownWasSpace: boolean;
  private lastUpWasSpace: boolean;
  private subscriptionUp: Subscription;
  private subscriptionDown: Subscription;
  private recording: boolean;
  private buffer: Array<{}>;
  private DWELL = 1;
  private FLIGHT = 2;
  private DIGRAPH = 3;
  private TRIGRAPH = 4;
  private FOURGRAPH = 5;
  private features = {"features": []};
  private MAX_BUFFER_LENGTH = 250;

  constructor() {
    super();

    this.keyboard = new TeslaKeyboard();
    this.lastDownWasSpace = false;
    this.lastUpWasSpace = false;
    this.recording = false;
    this.buffer = [];
    this.code = 'keyboard';
  }

  public start() {
    // console.log('Start keyboard recording');
    this.recording = true;

    // locale browser
    // user agent -> is_mobile
    // events {keycode, keyValue, timestamp, type}
    // 512 -> envio

    this.subscriptionUp = fromEvent(document, 'keyup').subscribe((ev: KeyboardEvent) => {
      return this.onKeyUp(ev);
    });

    this.subscriptionDown = fromEvent(document, 'keydown').subscribe((ev: KeyboardEvent) => {
      return this.onKeyDown(ev);
    })

    super.start();
    this.setStatus(SensorStatusValue.ok);
  }

  public stop() {
    this.recording = false;
    super.stop();
    this.setStatus(SensorStatusValue.error);
  }

  // @HostListener('window:keyup', ['$event'])
  onKeyUp(ev: KeyboardEvent) {
    // do something meaningful with it
    // console.log(`[UP] The user just pressed ${ev.key}!`);
    return this.processKey(ev);
  }

  // @HostListener('window:keydown', ['$event'])
  onKeyDown(ev: KeyboardEvent) {
    // do something meaningful with it
    // console.log(`[DOWN] The user just pressed ${ev.key}!`);
    return this.processKey(ev);
  }

  private processKey(ev: KeyboardEvent) {
    if (this.recording !== true) {
      return;
    }

    const aux = {
      key: ev.key,
      code: ev.code,
      timestamp: ev.timeStamp,
      type: ev.type
    };

    this.buffer.push(aux);
    // console.log('buffer length: ' + this.buffer.length);
    // are there sufficient events?
    if (this.buffer.length >= this.MAX_BUFFER_LENGTH) {
      const context = {};
      console.log('Keyboard service: send buffer');

      // create features and send data
      this.constructFeatures();
      const auxFeatures = [this.features];
      const data_b64 = 'data:text/plain;base64,'+btoa(JSON.stringify(auxFeatures));
      this.newSample(data_b64, 'text/plain', context);
      this.features = {"features": []};
    }
  }

  private constructFeatures() {
    const auxBuffer = this.buffer;
    this.buffer = [];

    let auxDwell = {};
    let auxFlight = {};
    let auxKeyBuffer = {"keyup": [], "keydown": []};

    // process DWELL
    for(let i=0; i < auxBuffer.length; i++) {
      const row = auxBuffer[i];
      if ((auxDwell[row['code']] === undefined || Object.keys(auxDwell[row['code']]).length === 0) && row['type'] === 'keydown') {
        auxDwell[row['code']] = {};
        auxDwell[row['code']]['keydown'] = row['timestamp'];
      }

      if (auxDwell[row['code']] !== undefined && row['type'] === 'keyup') {
        const auxFeature = {
          'code': row['code'],
          'type': this.DWELL,
          'time': row['timestamp'] - auxDwell[row['code']]['keydown']
        };
        this.features.features.push(auxFeature);
        auxDwell[row['code']] = {};
      }
    }

    // process FLIGHT
    for(let i=0; i < auxBuffer.length; i++) {
      const row = auxBuffer[i];

      if (row['type'] === 'keyup') {
        auxFlight = {
          'code': row['code'],
          'type': this.FLIGHT,
          'time': row['timestamp']
        };
      }

      if (row['type'] === 'keydown' && Object.keys(auxFlight).length != 0 && auxFlight['code'] !== row['code']) {
        auxFlight = {
          'code': auxFlight['code']+'___'+row['code'],
          'type': this.FLIGHT,
          'time': row['timestamp'] - auxFlight['time']
        };
        this.features.features.push(auxFlight);
        auxFlight = {};
      }
    }

    // separate events inside two buffers
    for(let i=0; i < auxBuffer.length; i++) {
      const row = auxBuffer[i];
      auxKeyBuffer[row['type']].push({"code": row['code'], "timestamp": row['timestamp']});
    }

    // process DIGRAPH
    this.processXGraph(auxKeyBuffer, 1);

    // process TRIGRAPH
    this.processXGraph(auxKeyBuffer, 2);

    // process FOURGRAPH
    this.processXGraph(auxKeyBuffer, 3);
  }

  private processXGraph(auxKeyBuffer, idx) {
    let aux_type = null;

    switch(idx) {
      case 1:
        aux_type = this.DIGRAPH;
        break;
      case 2:
        aux_type = this.TRIGRAPH;
        break;
      case 3:
        aux_type = this.FOURGRAPH;
        break;
    }

    for(let i=0; i < auxKeyBuffer['keydown'].length; i++) {
      const row_down = auxKeyBuffer['keydown'][i];

      if (auxKeyBuffer['keyup'][i+idx] === undefined) {
        break;
      }
      const row_up = auxKeyBuffer['keyup'][i+idx];

      const auxFeature = {
        'code': row_down['code']+'___'+row_up['code'],
        'type': aux_type,
        'time': row_up['timestamp'] - row_down['timestamp']
      };
      this.features.features.push(auxFeature);
    }
  }
}
