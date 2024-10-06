import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { FlexLayoutModule } from "@angular/flex-layout";

@Component({
  selector: 'app-market-data',
  standalone: true,
  imports: [FlexLayoutModule, MatListModule, DatePipe, CurrencyPipe],
  styles: [`.mdc-list { width: 100%;}`],
  template: `
  <fieldset fxLayout="row" primary>
    <legend>Market data</legend>
      <mat-list>
        <mat-list-item fxFlex>
          <div matListItemTitle>Symbol</div>
          <div matListItemLine>{{currentPair.symbol}}</div>
        </mat-list-item>
        <mat-list-item fxFlex>
          <div matListItemTitle>Price</div>
          <div matListItemLine>{{curPrice | currency: currentPair.symbol.slice(-3)}}</div>
        </mat-list-item>
        <mat-list-item fxFlex>
          <div matListItemTitle>Time</div>
          <div matListItemLine>{{curTime | date:'medium'}}</div>
        </mat-list-item>
    </mat-list>
  </fieldset>
  `,
})
export class MarketDataComponent {
  @Input() currentPair: any;
  @Input() curPrice: number;
  @Input() curTime: any;
}
