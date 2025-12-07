import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { config } from './app/app.config.server';
import {AppRootComponent} from "./app/app-root/app-root.component";

const bootstrap = (context: BootstrapContext) =>
    bootstrapApplication(AppRootComponent, config, context);

export default bootstrap;
