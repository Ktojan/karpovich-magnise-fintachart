# KarpovichMagniseFintachart

This is a demo app using https://platform.fintacharts.com API for financial charts.
Stack: Angular 18, Angular Material with theming, flex-layout, websocket, REST API, chart.js + luxon, ng-apexcharts (https://apexcharts.com/). Implemented during 4-5 oct 2024.

## Comments and nuances

- The number of instruments (pairs) from "get list instruments" response was intentionally reduced x10, can be reverted in getPairs method.
- I assigned few initial chart properties to hardcoded constants (DEFAULT_PAIRS) in order to show UI even when facing some network or auth problems.
- For historical data I choosed periodicity= 1 day as a most illustrative one
- Sometimes live chart remains empty for a while due to the absence of new data (new messages from websocket). Change the pair in this case.
- I didn't create usual separate folders and even html/css files for each component due to their small size

## Issues, todos

The core blocking problem is that with initial get auth token request, see the comment in ./services/fintachart.service.ts:getAccessToken(). In order to get around this I implemented a prompt with token input (and button to reassign it)


## Development server

Run `npm i --legacy-peer-deps` (version conflicts, you know... sth wrong with @angular/flex-layout, needs time to clarify)
 `ng serve` for a dev server. 

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

![11](https://github.com/user-attachments/assets/a6562517-a39d-46f2-b043-751a5e3d0f23)

![22](https://github.com/user-attachments/assets/22f21c01-8f48-40dd-9347-f015a5226e71)




