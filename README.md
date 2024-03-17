
## Products & Reviews management

Set of services for managing products and their reviews.

Automatically calculates average rating for each product and updates it when review is created/edited/deleted.

## Technology stack
- [NestJS](https://nestjs.com/) framework
- [TypeORM](https://typeorm.io/) ORM for database operations
- [MySQL](https://www.mysql.com/) DB engine
- [RabbitMQ](https://www.rabbitmq.com/) message broker
- [Redis](https://redis.io/) in-memory data structure store used for caching
- [Docker](https://www.docker.com/) for containerization
- [docker-compose](https://docs.docker.com/compose/) for running multi-container Docker applications

## Services
### product-reviews
Contains modules for managing products and their reviews.
Runs on [localhost:3000](localhost:3000). 

Swagger API is available on [localhost:3000/api](localhost:3000/api).

- Products module
  - provides REST API for managing [products](./apps/product-reviews/src/products/entities/product.entity.ts)
- Reviews module
  - provides REST API for managing [reviews](./apps/product-reviews/src/reviews/entities/review.entity.ts)
- App module
  - provides HTML page on root path with all products and their reviews

### review-processor
Contains module for updating average product ratings based on reviews.

## Architecture
- `product-reviews`:
  - handling all DB operations related to products and reviews
  - using _Redis_ for caching products and reviews to decrease DB traffic
  - sending messages to dedicated queue in _RabbitMQ_ about rating recalculation needs
- `review-processor`:
  - listening for messages on dedicated _RabbitMQ_ queue
  - fetching product reviews from DB to recalculate average product rating
  - stores new rating into DB
  - invalidates relevant caches in _Redis_
  - can be scaled to _n_ replicas as needed
- dynamic configuration based on [.env](./.env.development) file

## Installation

```bash
$ npm install
```

## Running the app on localhost

```bash
# start dependencies
$ docker-compose up -d mysql rabbitmq redis

# start product-reviews service
$ npm run start:product-reviews

# start review-processor service
$ npm run start:review-processor

# or start both just by running
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod:<service-name>
```

## Running the app in docker
```bash
# build & run unit tests & start all services (review-processor in 2 instances - no limit on number of instances)
$ docker-compose up --build -d
```


## Testing

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Documentation
[Generated](./documentation/index.html) from codebase using [compodoc](https://compodoc.app/).

```bash
$ npm run compodoc
```

## Optional TODOs
- extract entities to [library](https://docs.nestjs.com/cli/libraries) to remove redundant definitions per app
- health check endpoints to be used in k8s

## Known issues (to be resolved)
- e2e tests doesn't end properly, they pass but something is wrong with teardown
