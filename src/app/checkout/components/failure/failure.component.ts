import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagesModule } from 'primeng/messages';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'checkout-failure',
  standalone: true,
  // Adding a visual module (CardModule), makes the messages visible
  imports: [CommonModule, MessagesModule, CardModule],
  templateUrl: './failure.component.html',
  styleUrls: ['./failure.component.scss'],
})
export class FailureComponent {}
