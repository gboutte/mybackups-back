import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRootComponent } from './app-root/app-root.component';
import { RouterOutlet } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [AppRootComponent],
  imports: [BrowserModule, RouterOutlet, AppRoutingModule],
  providers: [],
  bootstrap: [AppRootComponent],
})
export class AppModule {}
