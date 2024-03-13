
## Description

Products review services.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## TODOs
- return proper HTTP codes based on https://docs.devland.is/technical-overview/api-design-guide/rest-response
- PATCH/PUT/DELETE in products/reviews controllers return directly DB results (hide them and return just HTTP code)