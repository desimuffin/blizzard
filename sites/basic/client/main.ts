import 'angular2-meteor-polyfills';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './imports/app/app.module';
import { MeteorObservable } from "meteor-rxjs";

Meteor.startup(() => {
    platformBrowserDynamic().bootstrapModule(AppModule);
});