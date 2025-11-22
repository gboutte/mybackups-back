import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ButtonsModule,
  InputsModule,
  ModalConfig,
  ModalRef,
  ToastService,
} from '@gboutte/glassui';
import { TranslateModule } from '@ngx-translate/core';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'mb-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, InputsModule, ButtonsModule, TranslateModule],
})
export class UserFormComponent {
  protected userForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', Validators.required),
  });
  private usersService: UsersService = inject(UsersService);
  private modalRef: ModalRef = inject(ModalRef);
  private toastService: ToastService = inject(ToastService);
  protected modalConfig: ModalConfig = inject(ModalConfig);

  constructor() {
    if (this.modalConfig.data?.user) {
      this.username.setValue(this.modalConfig.data.user.username);
      this.username.disable();
    }
  }
  protected save(): void {
    if (this.userForm.valid && !this.userForm.disabled) {
      this.userForm.disable();
      if (this.modalConfig.data?.user) {
        this.usersService
          .update(this.modalConfig.data.user.id, this.password.value)
          .subscribe({
            next: () => {
              this.modalRef.close();
            },
            error: () => {
              this.toastService.alert({
                title: 'Error',
                description:
                  'An error occurred while creating the user. Please try again.',
                icon: 'error',
                color: 'white',
              });
              this.userForm.enable();
            },
          });
      } else {
        this.usersService
          .create(this.username.value, this.password.value)
          .subscribe({
            next: () => {
              this.modalRef.close();
            },
            error: () => {
              this.toastService.alert({
                title: 'Error',
                description:
                  'An error occurred while creating the user. Please try again.',
                icon: 'error',
                color: 'white',
              });
              this.userForm.enable();
            },
          });
      }
    }
  }
  protected get username(): FormControl {
    return this.userForm.get('username') as FormControl;
  }

  protected get password(): FormControl {
    return this.userForm.get('password') as FormControl;
  }
}
