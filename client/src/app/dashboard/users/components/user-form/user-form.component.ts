import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../auth/auth.service';
import { ModalConfig, ModalRef, ToastService } from '@gboutte/glassui';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'mb-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent {
  userForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', Validators.required),
  });
  usersService: UsersService;
  modalRef: ModalRef;
  toastService: ToastService;
  modalConfig: ModalConfig;

  constructor(
    usersService: UsersService,
    modalRef: ModalRef,
    modalConfig: ModalConfig,
    toastService: ToastService,
  ) {
    this.usersService = usersService;
    this.modalRef = modalRef;
    this.toastService = toastService;
    this.modalConfig = modalConfig;
    if (this.modalConfig.data?.user) {
      this.username.setValue(this.modalConfig.data.user.username);
      this.username.disable();
    }
  }
  save() {
    if (this.userForm.valid && !this.userForm.disabled) {
      this.userForm.disable();
      if (this.modalConfig.data?.user) {
        this.usersService
          .update(this.modalConfig.data.user.id, this.password.value)
          .subscribe({
            next: () => {
              this.modalRef.close();
            },
            error: (error) => {
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
            error: (error) => {
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
  get username(): FormControl {
    return this.userForm.get('username') as FormControl;
  }

  get password(): FormControl {
    return this.userForm.get('password') as FormControl;
  }
}
