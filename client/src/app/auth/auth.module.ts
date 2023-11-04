import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { SessionService } from './session.service';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [AuthService, SessionService],
})
export class AuthModule {}
