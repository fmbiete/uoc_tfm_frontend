import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageUsers, User } from 'src/app/users/models/user.dto';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule, Table, TableLazyLoadEvent } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { first } from 'rxjs';
import { SnackbarService } from 'src/app/common/services/snackbar.service';
import { UserService } from 'src/app/admin/services/user.service';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    ConfirmDialogModule,
    DialogModule,
    InputTextModule,
    TableModule,
    TooltipModule,
  ],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [ConfirmationService],
})
export class ListComponent implements OnInit {
  @ViewChild('table') table!: Table;

  users: User[];
  loading: boolean;
  fakeTotalUsers: number;

  constructor(
    private snackbar: SnackbarService,
    private confirmationService: ConfirmationService,
    private userService: UserService
  ) {
    this.users = new Array<User>();
    this.loading = true;
    // mark the total as 1+row size to have pagination
    this.fakeTotalUsers = 6;
  }

  ngOnInit(): void {
    this.loading = true;
    // lazy load
  }

  applyFilterGlobal(table: Table, $event: any, stringVal: any) {
    console.debug($event);
    console.debug(stringVal);
    table.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  loadUsers(event: TableLazyLoadEvent): void {
    // pageSize is the value selected or 5
    const pageSize = event.rows ?? 5;
    // pageCount is 0 based in the table, but 1 based in the API
    // first contains the number of elements
    const pageCount = event.first == undefined ? 1 : event.first / pageSize + 1;
    this._subscribeUsers(pageSize, pageCount);
  }

  resetFilter(table: Table) {
    table.clear();
  }

  onRowDelete(user: User) {
    this.confirmationService.confirm({
      message: $localize`Do you want to delete this User?\n${user.Name}`,
      header: $localize`Delete Confirmation`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._deleteUser(user);
      },
    });
  }

  onRowResetPassword(user: User) {
    this.confirmationService.confirm({
      message: $localize`Do you want to reset the password for this User?\n${user.Name}`,
      header: $localize`Reset User Password`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._resetPasswordUser(user);
      },
    });
  }

  onRowToggleAdmin(user: User, idx: number) {
    this.confirmationService.confirm({
      message: $localize`Do you want to toggle the Administrator flag for this User?\n${user.Name}`,
      header: $localize`Toggle Aministrator Access`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._toggleAdminUser(user, idx);
      },
    });
  }

  private _deleteUser(user: User): void {
    this.userService
      .delete$(user.ID)
      .pipe(first())
      .subscribe({
        next: () => {
          this.snackbar.show(null, $localize`User was deleted`);
          this.users = this.users.filter((c: User) => c.ID !== user.ID);
          this.table.reset();
        },
        error: (err: any) => {
          this.snackbar.show(err, $localize`Failed to delete User`);
        },
      });
  }

  private _subscribeUsers(pageSize: number, pageCount: number): void {
    this.userService
      .list$(pageSize, pageCount)
      .pipe(first())
      .subscribe({
        next: (value: PageUsers) => {
          this.users = value.users;
          if (value.users.length == pageSize) {
            // If this page is full of elements (we exactly have pageSize),
            // we add 1 to our fake total to enable "next page"
            this.fakeTotalUsers = pageSize * pageCount + 1;
          } else {
            // If this page is not full
            // we add only what we have; this will disable "next page"
            this.fakeTotalUsers =
              pageSize * (pageCount - 1) + value.users.length;
          }
          this.loading = false;
        },
        error: (err: any) => {
          this.snackbar.show(err, $localize`Failed to list Users`);
        },
      });
  }

  private _toggleAdminUser(user: User, idx: number): void {
    user.IsAdmin = !user.IsAdmin;
    this.userService
      .modify$(user)
      .pipe(first())
      .subscribe({
        next: (value: User) => {
          this.snackbar.show(
            null,
            user.IsAdmin
              ? $localize`Administrator flag has been activated`
              : $localize`Administrator flag has been removed`
          );
        },
        error: (err: any) => {
          // Revert change
          user.IsAdmin = !user.IsAdmin;
          this.snackbar.show(
            err,
            $localize`Failed to toggle Administrator flag`
          );
        },
      });
  }

  private _resetPasswordUser(user: User): void {
    user.Password = Math.random().toString(36).slice(-16);
    this.userService
      .modify$(user)
      .pipe(first())
      .subscribe({
        next: () => {
          this.snackbar.show(
            null,
            $localize`A new password has been sent to the User email address`
          );
        },
        error: (err: any) => {
          this.snackbar.show(err, $localize`Failed to reset User password`);
        },
      });
  }
}
