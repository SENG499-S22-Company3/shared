# SENG 499 Shared for Company 3/4

## Documentation

**[GraphQL](https://seng499-s22-company3.github.io/shared/graphql)** (Backend/Frontend - GraphQL)

**[Algorithm 1](https://seng499-s22-company3.github.io/shared/algorithm1/)** (OpenAPI 3)

**[Algorithm 2](https://seng499-s22-company3.github.io/shared/algorithm2/)** (OpenAPI 3)

## Running Integration Tests Locally (Company 3)

1. To run the integration test suite locally, first clone this repository as well as the
backend repository (https://github.com/SENG499-S22-Company3/backend). Then, make sure 
that if you have Postgresql installed, that the service on your machine is either stopped
or disabled for the duration of the integration test run. This will free port 5432 so 
the `postgresl` container can expose the port to the host.

2. Next, run `sudo ./local-company3-e2e.sh`, which will setup the environment variables
and the start the application containers. Ensure all containers are up and running.

3. Then, seed the database. Open another terminal, and ensure the folowing environment variable is set: `export DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres`. Navigate to the backend repository, ensure all npm dependencies 
are installed (`npm ci`), and then run `npx -y prisma migrate dev && npx -y prisma db seed`. This will seed the postgresql with all 
the data needed to run the integration tests.

4. Run `npm test` in this repository, and tests should be executed successfully.