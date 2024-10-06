# KarpovichMagniseFintachart

This is demo app using https://platform.fintacharts.com API for financial charts.
Stack: Angular 18, Angular Material with theming, flex-layout, websocket, REST API, chart.js + luxon, ng-apexcharts (https://apexcharts.com/). Implemented during 4-5 oct 2024.

## Comments and nuances

- Number of instruments (pairs) from "get list instruments" response was intentionally reduced x10, can be reverted in getPairs method.
- I assigned few initial chart properties to hardcoded constants (DEFAULT_PAIRS) in order to show UI even when facing some network or auth problems.
- For historical data I choosed periodicity= 1 day as a most illustrative
- Sometimes live chart remains empty for sometime due to absence of new data (new messages from websocket). Change the pair in this case.

## Issues, todos

The core blocking problem is that with initial get auth token request, see the comment in ./services/fintachart.service.ts:getAccessToken(). In order to get around this I implemented a prompt with token input (and button to reassign it)


## Development server

Run `npm i --legacy-peer-deps` (version conflicts, you know... sth wrong with @angular/flex-layout, needs time to clarify)
 `ng serve` for a dev server. 

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.




