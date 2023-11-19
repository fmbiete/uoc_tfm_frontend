import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { UserService } from 'src/app/shared/services/user.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { first } from 'rxjs';
import { CountUsers } from 'src/app/shared/models/user.dto';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'admin-dashboard-users',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, TooltipModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  numUsers: number;

  constructor(
    private snackbar: SnackbarService,
    private userService: UserService
  ) {
    this.numUsers = 0;
  }

  ngOnInit(): void {
    this.userService
      .count$(false /*includeAdmin*/)
      .pipe(first())
      .subscribe({
        next: (value: CountUsers) => {
          this.numUsers = value.count;
        },
        error: (err) => {
          this.snackbar.show(
            err,
            $localize`Failed to count non-administrative users`
          );
        },
      });
  }
}
