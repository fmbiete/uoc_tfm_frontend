import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { Router, RouterModule } from '@angular/router';
import { HeaderService } from '../../services/header.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { Header } from '../../models/header.dto';
import { NgIf } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    MatToolbarModule,
    MatTooltipModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    NgIf,
    RouterModule,
  ],
})
export class HeaderComponent implements OnInit {
  applicationTitle: string = environment.title;
  showAdminSection: boolean;
  showAuthSection: boolean;
  showNoAuthSection: boolean;

  constructor(
    private router: Router,
    private headerService: HeaderService,
    private localStorageService: LocalStorageService,
    private dialog: MatDialog
  ) {
    this.showAdminSection = false;
    this.showAuthSection = false;
    this.showNoAuthSection = true;
  }

  ngOnInit(): void {
    this.headerService.headerManagement.subscribe((status: Header) => {
      console.debug(`header -> headerService subscribe`);
      if (status) {
        console.debug(status);
        this.showAuthSection = status.showAuthSection;
        this.showNoAuthSection = status.showNoAuthSection;
        this.showAdminSection = status.showAdminSection;
      }
    });
  }

  changePassword(): void {
    this.router.navigateByUrl('/users/credentials');
  }

  orders(): void {
    this.router.navigateByUrl('/orders');
  }

  profile(): void {
    this.router.navigateByUrl('/users/profile');
  }

  login(): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.debug(`Dialog result: ${result}`);
    });
  }

  logout(): void {
    this.localStorageService.resetLogin();
    this.headerService.showUnauthenticated();
    this.router.navigateByUrl('/');
  }
}
