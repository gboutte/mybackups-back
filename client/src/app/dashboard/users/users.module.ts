import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  ButtonsModule,
  ContentModule,
  InputsModule,
  ModalModule,
  ToastModule,
} from '@gboutte/glassui';
import { TranslateModule } from '@ngx-translate/core';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UsersComponent } from './components/users/users.component';
import { UsersService } from './services/users.service';
import { UsersRoutingModule } from './users-routing.module';

@NgModule({
  declarations: [UsersComponent, UserFormComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    ContentModule,
    ButtonsModule,
    TranslateModule,
    ModalModule,
    InputsModule,
    ReactiveFormsModule,
    ToastModule,
  ],
  providers: [UsersService],
})
export class UsersModule {}
