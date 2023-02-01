## Installation

```
# 1. Run:
$ npm install
# 2. Install posgreSQL and set the environment for it
# 3. Add .env file to the root directory
```

## .env

```
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=devme123
POSTGRES_DB=iogru
MODE=DEV
REDIS_HOST=localhost
REDIS_PORT=6379
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

## License

Nest is [MIT licensed](LICENSE).
