import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, } from 'rxjs/operators';
import Chart from 'chart.js/auto';
import ChartStreaming from 'chartjs-plugin-streaming';
import { IHistoricalObject, IInstrument } from '../interfaces';

const finBasicUrl = 'https://platform.fintacharts.com';
const proxy = 'https://thingproxy.freeboard.io/fetch/'; //to handle CORS when developing

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor(private http: HttpClient) { }

  private websocket_token = '';
  websocketUrl = '';
  realmURl = '/identity/realms/:realm/protocol/openid-connect/token';

  getAccessToken(): Observable<any> {
    const body = {
      grant_type: 'password',
      client_id: 'app-cli',  
      username: 'r_test@fintatech.com',
      password: 'kisfiz-vUnvy9-sopnyv'
    } // params from Postman collection
    return this.http.post<any>(proxy + finBasicUrl + this.realmURl, body)
    // got error 404: "Realm does not exist" and without proxy: strict-origin-when-cross-origin
  }

  getToken() { return this.websocket_token }

  requestToken() { 
    this.websocket_token = prompt('input auth token (without quotes)').trim();
    this.websocketUrl = 'wss://platform.fintacharts.com/api/streaming/ws/v1/realtime?token=' + this.websocket_token;
  }

  getInstruments(): Observable<IInstrument[]> {
    if (!this.websocket_token) this.requestToken();
    const apiInstr = '/api/instruments/v1/instruments?provider=oanda&kind=forex';
    return this.http.get<any>(proxy + finBasicUrl + apiInstr, {
      headers: new HttpHeaders({'Authorization' : `Bearer ${this.websocket_token}` })
    }).pipe(
      map((res: any) => res.data),
    )
}

  getBarsCount(insId = 'ebefe2c7-5ac9-43bb-a8b7-4a97bf2c2576'): Observable<IHistoricalObject[]> {
    const apiInstr = '/api/bars/v1/bars/count-back';
    return this.http.get<any>(proxy + finBasicUrl + apiInstr, {
      params: {
        instrumentId: insId,
        provider: 'oanda',
        interval: '1',
        periodicity: 'day',
        barsCount: '20'
      },
      headers: new HttpHeaders({'Authorization' : `Bearer ${this.websocket_token}` })
    }).pipe(
      map((res: {data: IHistoricalObject[]}) => res.data)
    )
  }

  createCanvas(livechart, buf, exchange): Chart {
    if (!this.websocket_token) this.requestToken();
    let canvas = document.createElement("canvas");
    canvas.id = 'chart-canvas-id';
    livechart.nativeElement.appendChild(canvas);
    let ctx = canvas.getContext('2d');
    Chart.register(ChartStreaming);

    return new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [{
          data: [],
          label: 'Bid',
          borderColor: 'rgb(0, 255, 0)',
          backgroundColor: 'rgba(0, 255, 0, 0.5)',
          fill: false,
        }, {
          data: [],
          label: 'Ask',
          borderColor: 'rgb(55, 48, 163)',
          backgroundColor: 'rgba(55, 48, 163, 0.5)',
          fill: false,
        }]
      },
      options: {
        scales: {
          x: {
            type: 'realtime',
            realtime: {
              onRefresh: (chart) => {
                if (chart && chart.data && chart.ctx) {
                  Array.prototype.push.apply(
                    chart.data.datasets[0].data, buf[exchange][0]
                  );
                  Array.prototype.push.apply(
                    chart.data.datasets[1].data, buf[exchange][1]
                  );
                  buf[exchange] = [[], []];
                }
              }
            },
          },
        }
      }
    })
  };
  closeStream = () => Chart.unregister(ChartStreaming); 
}

export const DEFAULT_PAIRS: IInstrument[] = [  //in order to show interface in a case of http or wss problems
  { symbol: 'AUD/CAD', id: 'ad9e5345-4c3b-41fc-9437-1d253f62db52'},
  { symbol: 'GBP/USD', id: '5071e03c-80d3-4b28-870d-28533306c8c6'},
  { symbol: 'EUR/JPY', id: 'fd7d35bc-271e-4000-b18d-257b4d505ee5'}
]

export const DEFAULT_HISTORY_DATA: IHistoricalObject[] = [
  {
      "t": "2024-09-08T00:00:00+00:00",
      "o": 1.10827,
      "h": 1.10911,
      "l": 1.10339,
      "c": 1.10352,
      "v": 82539
  },
  {
      "t": "2024-09-09T00:00:00+00:00",
      "o": 1.10373,
      "h": 1.10496,
      "l": 1.10153,
      "c": 1.10194,
      "v": 76047
  },
  {
      "t": "2024-09-10T00:00:00+00:00",
      "o": 1.10195,
      "h": 1.10549,
      "l": 1.1002,
      "c": 1.1012,
      "v": 104425
  },
  {
      "t": "2024-09-11T00:00:00+00:00",
      "o": 1.1013,
      "h": 1.10751,
      "l": 1.10055,
      "c": 1.10748,
      "v": 90785
  },
  {
      "t": "2024-09-12T00:00:00+00:00",
      "o": 1.10739,
      "h": 1.1102,
      "l": 1.10704,
      "c": 1.10756,
      "v": 89868
  },
  {
      "t": "2024-09-15T00:00:00+00:00",
      "o": 1.10802,
      "h": 1.11376,
      "l": 1.10757,
      "c": 1.11326,
      "v": 78929
  },
  {
      "t": "2024-09-16T00:00:00+00:00",
      "o": 1.11328,
      "h": 1.11463,
      "l": 1.11107,
      "c": 1.1114,
      "v": 92417
  },
  {
      "t": "2024-09-17T00:00:00+00:00",
      "o": 1.1115,
      "h": 1.11892,
      "l": 1.10966,
      "c": 1.11177,
      "v": 117447
  },
  {
      "t": "2024-09-18T00:00:00+00:00",
      "o": 1.11164,
      "h": 1.11788,
      "l": 1.10686,
      "c": 1.11616,
      "v": 126044
  },
  {
      "t": "2024-09-19T00:00:00+00:00",
      "o": 1.11632,
      "h": 1.1182,
      "l": 1.11361,
      "c": 1.11636,
      "v": 107605
  },
  {
      "t": "2024-09-22T00:00:00+00:00",
      "o": 1.11628,
      "h": 1.11673,
      "l": 1.10832,
      "c": 1.11108,
      "v": 99083
  },
  {
      "t": "2024-09-23T00:00:00+00:00",
      "o": 1.11153,
      "h": 1.1181,
      "l": 1.11035,
      "c": 1.11797,
      "v": 89839
  },
  {
      "t": "2024-09-24T00:00:00+00:00",
      "o": 1.11798,
      "h": 1.12142,
      "l": 1.11216,
      "c": 1.1133,
      "v": 92771
  },
  {
      "t": "2024-09-25T00:00:00+00:00",
      "o": 1.11334,
      "h": 1.11894,
      "l": 1.11258,
      "c": 1.11766,
      "v": 106658
  }
]
