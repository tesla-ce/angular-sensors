import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
// import { WebPluginModule, WebPluginComponent} from '@tesla-ce/web-plugin';
// import { WebPluginModule, WebPluginComponent} from '../../projects/tesla-ce/web-plugin/src/public-api';
import { SensorsModule, SensorsComponent} from '../../projects/tesla-ce/sensors/src/public-api';
import { createCustomElement } from '@angular/elements';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    SensorsModule
  ],
  providers: [],
  entryComponents: [SensorsComponent],
  bootstrap: []
})
export class AppModule {
  constructor(private injector: Injector) { }

  ngDoBootstrap() {
    const ngElement = createCustomElement(SensorsComponent, {
      injector: this.injector
    });
    customElements.define('tesla-web-plugin', ngElement);
  }

}
