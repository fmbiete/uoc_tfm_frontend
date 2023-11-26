import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ISearchUser, PageUsers, User } from 'src/app/shared/models/user.dto';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule, Table, TableLazyLoadEvent } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import {
  Subject,
  Subscription,
  debounceTime,
  distinctUntilChanged,
  first,
  switchMap,
} from 'rxjs';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'admin-users-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    ConfirmDialogModule,
    InputTextModule,
    TableModule,
    TooltipModule,
  ],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [ConfirmationService],
})
export class ListComponent implements OnInit, OnDestroy {
  @ViewChild('table') table!: Table;

  private subscription!: Subscription;
  searchTerm: string;
  private searchText$: Subject<ISearchUser>;
  private pageSize: number;
  private pageCount: number;

  users: User[];
  loading: boolean;
  fakeTotalUsers: number;

  constructor(
    private snackbar: SnackbarService,
    private confirmationService: ConfirmationService,
    private userService: UserService
  ) {
    this.pageSize = 10;
    this.pageCount = 1;
    this.searchText$ = new Subject<ISearchUser>();
    this.searchTerm = '';
    this.users = new Array<User>();
    this.loading = true;
    // mark the total as 1+row size to have pagination
    this.fakeTotalUsers = this.pageSize + 1;
  }

  ngOnInit(): void {
    this.loading = true;
    // lazy load
    // lazy load
    this.subscription = this.searchText$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((value: ISearchUser) => {
          return this.userService.search$(
            value.filter,
            value.pageSize,
            value.pageCount
          );
        })
      )
      .subscribe({
        next: (value: PageUsers) => {
          // we only show the current page
          this.users = value.users;
          if (value.users.length == this.pageSize) {
            // If this page is full of elements (we exactly have pageSize),
            // we add 1 to our fake total to enable "next page"
            this.fakeTotalUsers = this.pageSize * this.pageCount + 1;
          } else {
            // If this page is not full
            // we add only what we have; this will disable "next page"
            this.fakeTotalUsers =
              this.pageSize * (this.pageCount - 1) + value.users.length;
          }
          this.loading = false;
        },
        error: (err) => {
          this.snackbar.show(err, $localize`Failed to search dishes`);
        },
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onKeyUp(event: KeyboardEvent): void {
    // clear resets pagination
    this.table.clear();
    this.loading = true;

    // key pressed - new search always?
    this.pageCount = 1;

    const data: ISearchUser = {
      filter: this.searchTerm,
      pageCount: this.pageCount,
      pageSize: this.pageSize,
    };

    this.searchText$.next(data);
  }

  loadUsers(event: TableLazyLoadEvent): void {
    this.loading = true;
    // pageSize is the value selected or our default
    this.pageSize = event.rows ?? this.pageSize;
    // pageCount is 0 based in the table, but 1 based in the API
    // first contains the number of elements
    this.pageCount =
      event.first == undefined ? 1 : event.first / this.pageSize + 1;

    const data: ISearchUser = {
      filter: this.searchTerm,
      pageCount: this.pageCount,
      pageSize: this.pageSize,
    };

    this.searchText$.next(data);
  }

  resetFilter(table: Table): void {
    this.searchTerm = '';
    this.pageCount = 1;

    const data: ISearchUser = {
      filter: this.searchTerm,
      pageCount: this.pageCount,
      pageSize: this.pageSize,
    };

    this.searchText$.next(data);

    // clear resets pagination
    table.clear();
  }

  onRowDelete(user: User): void {
    this.confirmationService.confirm({
      message: $localize`Do you want to delete this User?\n${user.Name}`,
      header: $localize`Delete Confirmation`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._deleteUser(user);
      },
    });
  }

  onRowResetPassword(user: User): void {
    this.confirmationService.confirm({
      message: $localize`Do you want to reset the password for this User?\n${user.Name}`,
      header: $localize`Reset User Password`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._resetPasswordUser(user);
      },
    });
  }

  onRowToggleAdmin(user: User): void {
    this.confirmationService.confirm({
      message: $localize`Do you want to toggle the Administrator flag for this User?\n${user.Name}`,
      header: $localize`Toggle Aministrator Access`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._toggleAdminUser(user);
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
        error: (err) => {
          this.snackbar.show(err, $localize`Failed to delete User`);
        },
      });
  }

  private _toggleAdminUser(user: User): void {
    user.IsAdmin = !user.IsAdmin;
    this.userService
      .modify$(user)
      .pipe(first())
      .subscribe({
        next: (value: User) => {
          this.snackbar.show(
            null,
            value.IsAdmin
              ? $localize`Administrator flag has been activated`
              : $localize`Administrator flag has been removed`
          );
        },
        error: (err) => {
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
        error: (err) => {
          this.snackbar.show(err, $localize`Failed to reset User password`);
        },
      });
  }
}
