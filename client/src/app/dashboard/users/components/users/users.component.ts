import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/user.model';
import {ModalService} from "@gboutte/glassui";
import {UserFormComponent} from "../user-form/user-form.component";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'mb-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  users!: User[];
  private usersService: UsersService;
  private modalService: ModalService;
  private translate: TranslateService;
  constructor(usersService: UsersService,modalService:ModalService,translate:TranslateService) {
    this.usersService = usersService;
    this.modalService = modalService;
    this.translate = translate;
  }

  ngOnInit() {
   this.refresh()
  }

  refresh(){
    this.usersService.getAll().subscribe((users) => {
      this.users = users;
    });
  }
  add(){
    this.modalService.open(UserFormComponent,{
      title: this.translate.instant('dashboard.users.modal.add.title'),
    }).subscribe({
      next: () => {
        this.refresh();
      }
    })
  }
  edit(user:User){
    this.modalService.open(UserFormComponent,{
      title: this.translate.instant('dashboard.users.modal.edit.title', {username: user.username}),
      data: {
        user
      }
    }).subscribe({
      next: () => {
        this.refresh();
      }
    })
  }
}
