# Approved Premises

Apply for and manage approved premises

## Running the app
The easiest way to run the app is to use docker compose to create the service and all dependencies. 

`docker-compose pull`

`docker-compose up`

### Dependencies
The app requires: 
* hmpps-auth - for authentication
* redis - session store and token caching
* PostGIS - the Postgres extension needs to be installed *on the specific db* with
`CREATE EXTENSION postgis;` See [https://postgis.net/install/](https://postgis.net/install/) if you need to install PostGIS itself.

### Environment variables

For simplicity during our alpha phase, we are using a full-stack approach with a
database. We use a couple of db-related environment variables, which can be set
locally e.g. in a `.env` file.

- `DATABASE_URL` - path to the db
- `DATABASE_SEED_FILE` - absolute file path to CSV with details of APs and their beds
- `GEOLOCATION_SEED_FILE` - absolute file path to CSV with details of AP coordinates


### Running the app for development

To start the main services excluding the example typescript template app: 

`docker-compose up --scale=app=0`

Install dependencies using `npm install`, ensuring you are using >= `Node v14.x`

And then, to build the assets and start the app with nodemon:

`npm run start:dev`

### Run linter

`npm run lint`

### Run tests

`npm run test`

### Running integration tests

For local running, start a test db, redis, and wiremock instance by:

`docker-compose -f docker-compose-test.yml up`

Then run the server in test mode by:

`npm run start-feature` (or `npm run start-feature:dev` to run with nodemon)

And then either, run tests in headless mode with:

`npm run int-test`
 
Or run tests with the cypress UI:

`npm run int-test-ui`


### Dependency Checks

The template project has implemented some scheduled checks to ensure that key dependencies are kept up to date.
If these are not desired in the cloned project, remove references to `check_outdated` job from `.circleci/config.yml`
