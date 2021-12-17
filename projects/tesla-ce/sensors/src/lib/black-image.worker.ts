export class BlackImageWorker implements Worker{
  onmessage(evt: any) {
    console.log('onmessage');
  }

  onmessageerror(evt: any) {
    console.log("onmessageerror");
  }

  postMessage(evt: any) {
    console.log(evt);
    console.log("postMessage");
    console.log('start check black image');

    const THRESHOLD_BRIGHTNESS = 30;

    const data = evt.data;
    const wTc = evt.wTc;
    const hTc = evt.hTc;
    const dataToSend = evt.dataToSend;

    let black = false;
    let colorSum = 0;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      // var alpha = data[i+3];
      colorSum += Math.floor((r + g + b) / 3);
    }
    const brightness = Math.floor(colorSum / (wTc / 2 * hTc / 2));

    if (brightness < THRESHOLD_BRIGHTNESS) {
      black = true;
    }

    this.onmessage({black, dataToSend});
  }

  terminate() {
    console.log("terminate");
  }

  addEventListener(evt: any) {
    console.log("addEventListener");
  }

  removeEventListener(evt: any) {
    console.log("removeEventListener");
  }

  dispatchEvent(evt: Event): boolean {
    console.log("dispatchEvent");
    return true;
  }

  onerror(evt: any) {
    console.log("onerror");
  }
  /*
  processImage = function(evt: any) {

  };

   */
}
