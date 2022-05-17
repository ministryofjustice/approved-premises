# Approved Premises

Apply for and manage approved premises

## Prerequisites

* Docker
* NodeJS

You will also need two CSV files stored in a known location on your system:

* A CSV with details of APs and their beds
* A CSV with details of AP coordinates

To get hold of these, speak to a member of the Approved Premises team.

You will be asked for the full path of these two files during the setup process.

## Setup

When running the application for the first time, run the following command:

```bash
script/setup
```

This will tear down and setup the application, create .env files and bootstrap the application.

If you're coming back to the application after a certain amount of time, you can run:

```bash
script/bootstrap
```

This will install dependencies and seed the databases.

## Running the application

To run the server, from the root directory, run:

```bash
script/server
```

This starts the backing services using Docker, and runs the server on `localhost:3000`.

## Running the tests

To run linting, unit and end-to-end tests, from the root directory, run:

script/test

