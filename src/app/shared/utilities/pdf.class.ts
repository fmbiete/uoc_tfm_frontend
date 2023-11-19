import { jsPDF } from 'jspdf';
import { OrderLine } from '../models/order-line.dto';
import { CurrencyPipe } from '@angular/common';
import { Order } from '../models/order.dto';

export class PDF {
  private doc: jsPDF;
  private docY: number;
  private docMaxY = 280;
  private docFontMain: string;
  private docFontSans = 'courier';
  private docFontTitleSize = 20;
  private docFontMainSize = 12;
  private docMarginLeft = 20;
  private docMarginCenter = 105;
  private docMarginRight = 194;
  private docMaxLineLength = 70;
  private currencyPipe: CurrencyPipe;

  constructor(currencyPipe: CurrencyPipe) {
    this.doc = new jsPDF();
    this.docFontMain = this.doc.getFont().fontName;
    this.docY = 20;
    this.currencyPipe = currencyPipe;
  }

  addSpace(spaceY: number): number {
    return this._currentAndMoveY(spaceY);
  }

  getY(): number {
    return this.docY;
  }

  setY(y: number): void {
    this.docY = y;
  }

  save(fileName: string): jsPDF {
    return this.doc.save(fileName);
  }

  text(
    text: string,
    fontSize: number,
    fontWeight: string,
    align: string,
    nextY: number
  ): void {
    this._text(text, this.docFontMain, fontSize, fontWeight, align, nextY);
  }

  textSans(
    text: string,
    fontSize: number,
    fontWeight: string,
    align: string,
    nextY: number
  ): void {
    this._text(text, this.docFontSans, fontSize, fontWeight, align, nextY);
  }

  orderLines(lines: OrderLine[]): void {
    lines.forEach((line) => {
      this.doc
        .setFontSize(this.docFontMainSize)
        .setFont(this.docFontSans, 'normal')
        .text(
          this._padOrderLine(line),
          this.docMarginLeft,
          this._currentAndMoveY(6)
        );
    });
  }

  orderAddress(order: Order): number {
    this.text($localize`Shipping Address`, 14, 'bold', '', 10);
    this.text(order.Address1, 14, 'normal', '', 6);
    this.text(order.Address2, 14, 'normal', '', 6);
    this.text(order.Address3, 14, 'normal', '', 6);
    this.text(order.City, 14, 'normal', '', 6);
    this.text(order.PostalCode, 14, 'normal', '', 6);
    this.text(order.Phone, 14, 'normal', '', 6);
    return this.getY();
  }

  orderCostSummary(order: Order): void {
    this.text($localize`Summary`, 15, 'bold', 'right', 10);
    this.text(
      this._padOrder($localize`Subtotal`, order.CostTotal),
      this.docFontMainSize,
      'normal',
      'right',
      6
    );
    this.text(
      this._padOrder($localize`Subvention`, order.Subvention),
      this.docFontMainSize,
      'normal',
      'right',
      6
    );
    this.text(
      this._padOrder($localize`Total`, order.CostToPay),
      this.docFontMainSize,
      'bold',
      'right',
      6
    );
  }

  private _currentAndMoveY(inc: number): number {
    const currentY = this.docY;
    if (this.docY + inc > this.docMaxY) {
      this.doc.addPage();
      this.docY = 20;
    } else {
      this.docY += inc;
    }

    return currentY;
  }

  private _padOrderLine(line: OrderLine): string {
    const quantityLength = 3;
    const costLength = 8;
    const nameLength = this.docMaxLineLength - quantityLength - costLength - 2;

    const quantity = `${line.Quantity}`.padStart(quantityLength, ' ');
    const name = line.Name.substring(0, nameLength).padEnd(nameLength, '.');
    const cost = this.currencyPipe
      .transform(line.CostUnit)
      ?.padStart(costLength, ' ');
    return `${name}${quantity}${cost}`;
  }

  private _padOrder(text: string, value: number): string {
    const cost = this.currencyPipe.transform(value)?.padStart(10, ' ');
    text = text.padEnd(15, ' ');
    return `${text}${cost}`;
  }

  private _text(
    text: string,
    fontName: string,
    fontSize: number,
    fontWeight: string,
    align: string,
    nextY: number
  ): void {
    let options = {};
    let x = 20;
    switch (align) {
      case 'center':
        options = { align: 'center' };
        x = this.docMarginCenter;
        break;
      case 'right':
        options = { align: 'right' };
        x = this.docMarginRight;
    }

    this.doc
      .setFontSize(fontSize)
      .setFont(fontName, fontWeight)
      .text(text, x, this._currentAndMoveY(nextY), options);
  }
}
