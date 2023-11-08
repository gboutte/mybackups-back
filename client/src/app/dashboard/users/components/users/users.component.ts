import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'mb-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  users!: User[];
  private usersService: UsersService;

  constructor(usersService: UsersService) {
    this.usersService = usersService;
  }

  ngOnInit() {
    this.usersService.getAll().subscribe((users) => {
      this.users = users;
    });
  }
}
