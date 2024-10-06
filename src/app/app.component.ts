import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { SharedModule } from './shared.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-luxon'
import { ChartService, DEFAULT_PAIRS } from './services/fintachart.service';
import { MarketDataComponent } from './market_data.component';
import { HistoryChartComponent } from './history_chart.component';
import { IInstrument } from './interfaces';

@Component({
  selector: 'app-root',
  standalone: true,  
  imports: [SharedModule, CommonModule, FormsModule, MarketDataComponent, HistoryChartComponent],
  providers: [ChartService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  @ViewChild('livechart') livechart!: ElementRef<HTMLElement>;
  
  chartService = inject(ChartService);
  pairs: IInstrument[] = DEFAULT_PAIRS;
  currentPair = this.pairs[0];
  currentChart: Chart | undefined;
  curPrice = 0;
  curTime = null;
  exchange = 'Fintacharts-realtime';
  buf = {};
  streamer;
  isStreaming = false;

  ngOnInit() {
    this.tokenRequest();
    this.getPairs();
    // this.chartService.getAccessToken().subscribe(resp => console.log(resp));
  }

  togglePairs(symbol: string): void {
    const newPair = this.pairs.find(pair => pair.symbol === symbol);
    if (newPair) this.currentPair = newPair;
  }

  toggleStream(): void {
    if (this.streamer && this.isStreaming) {
      this.streamer.send('Close!');
      if (this.currentChart) this.currentChart.destroy();
      this.closeStream();
    } else {
      this.openStream();
    }
    this.isStreaming = !this.isStreaming;
  }

  getPairs() {
    this.chartService.getInstruments().subscribe((pairsArray: IInstrument[]) => {
      if (pairsArray && pairsArray.length > 0)
        this.pairs = pairsArray.filter((el, index) => index % 10 === 0); // for demo purposes to decrease a list length
      console.log('List of instruments (number is reduced 10 times for demo) ', this.pairs);
  })

  }

  openStream() {
    this.streamer = new WebSocket(this.chartService.websocketUrl);
    this.buf[this.exchange] = [[], []];
    
    this.streamer.onopen = () => {
      let subRequest = {
        "type": "l1-subscription",
        "id": "1",
        "instrumentId": this.currentPair.id,
        "provider": "simulation",
        "subscribe": true,
        "kinds": [
          "ask",
          "bid",
        ]
      }
      this.streamer.send(JSON.stringify(subRequest));
      this.isStreaming = 1 === this.streamer.readyState;
      this.currentChart = this.chartService.createCanvas(this.livechart, this.buf, this.exchange);
    }

    this.streamer.onmessage = (message) => {
      let data = JSON.parse(message.data);
      if (data['type'] === 'l1-update') {
        let topBid = data['bid']?.price;
        let topAsk = data['ask']?.price;
        this.curPrice = topBid ?? topAsk;
        let timestamp = Date.parse(data['bid']?.timestamp ?? data['ask']?.timestamp);
        this.curTime = new Date(timestamp).toUTCString();
        
        if (topBid) {
          this.buf[this.exchange][0].push({
            x: timestamp,
            y: topBid
          });
        }
        if (topAsk) {
          this.buf[this.exchange][1].push({
            x: timestamp,
            y: topAsk
          });
        }
      }
    }
  }

  tokenRequest() { 
    this.chartService.requestToken(); //a spike for auth token
    this.getPairs();
  } 

  closeStream() {
    this.livechart.nativeElement.innerHTML='';
    this.chartService.closeStream();
    this.streamer.close();
  }

  ngOnDestroy() {
    this.closeStream();
  }
}
