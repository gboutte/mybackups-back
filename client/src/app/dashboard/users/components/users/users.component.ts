import { DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ButtonsModule, ContentModule, ModalService } from '@gboutte/glassui';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { User } from '../../models/user.model';
import { UsersService } from '../../services/users.service';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
    selector: 'mb-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
    imports: [ContentModule, ButtonsModule, DatePipe, TranslateModule]
})
export class UsersComponent implements OnInit {
  protected users!: User[];
  private usersService: UsersService = inject(UsersService);
  private modalService: ModalService = inject(ModalService);
  private translate: TranslateService = inject(TranslateService);

  public ngOnInit(): void {
    this.refresh();
  }

  private refresh(): void {
    this.usersService.getAll().subscribe((users: User[]) => {
      this.users = users;
    });
  }
  protected add(): void {
    this.modalService
      .open(UserFormComponent, {
        title: this.translate.instant('dashboard.users.modal.add.title'),
      })
      .subscribe({
        next: () => {
          this.refresh();
        },
      });
  }
  protected edit(user: User): void {
    this.modalService
      .open(UserFormComponent, {
        title: this.translate.instant('dashboard.users.modal.edit.title', {
          username: user.username,
        }),
        data: {
          user,
        },
      })
      .subscribe({
        next: () => {
          this.refresh();
        },
      });
  }
}
