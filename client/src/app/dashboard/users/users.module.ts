import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './components/users/users.component';
import { UsersRoutingModule } from './users-routing.module';
import { UsersService } from './services/users.service';
import {
  ButtonsModule,
  ContentModule,
  InputsModule,
  ModalModule,
  ToastModule,
  ToastService,
} from '@gboutte/glassui';
import { TranslateModule } from '@ngx-translate/core';
import { UserFormComponent } from './components/user-form/user-form.component';
import { ReactiveFormsModule } from '@angular/forms';

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
