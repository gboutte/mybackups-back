import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './components/users/users.component';
import { UsersRoutingModule } from './users-routing.module';
import { UsersService } from './services/users.service';
import { ButtonsModule, ContentModule } from '@gboutte/glassui';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [UsersComponent],
  imports: [CommonModule, UsersRoutingModule, ContentModule, ButtonsModule, TranslateModule],
  providers: [UsersService],
})
export class UsersModule {}
