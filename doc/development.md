# Development

This file contains info for contributors to the Record Manager UI codebase. The frontend uses the following [components and libraries](./components-libraries.md).

## Running in Development Mode

To configure the application use [Setup Guide](./setup.md).
To run the application in development mode use `npm run dev`.
By default, the application is accessible from http://localhost:5173.

### Development with Dockerized Services

It is possible to develop the frontend over prepared docker services.

#### Using Internal Authorization

This section describes the development scenario when developer uses
[dockerized services with internal authorization](../deploy/internal-auth/docker-compose.yml) to develop.
All the services, including dockerized record-manager-ui, run by default at URL starting with `http://localhost:1235/record-manager`.
To attach simultaneously frontend for the development use setup from [.env.internal-auth](../.env.internal-auth),
e.g., by running `ln -s .env.internal-auth .env;  npm run dev`.

#### Using Keycloak Authorization

This section describes the development scenario when developer uses
[dockerized services with keycloak authorization](../deploy/keycloak-auth/docker-compose.yml) to develop.
All the services, including dockerized record-manager-ui, run by default at URL starting with `http://localhost:1235/record-manager`.
To attach simultaneously frontend for the development use setup from [.env.keyclaok-auth](../.env.keyclaok-auth),
e.g., by running `ln -s .env.keycloak-auth .env;  npm run dev`.

`npm run dev` starts developement version of record-manager-ui at `http://localhost:5173`. In order to login to through keycloak `record-manager` realm needs to be configured: open the `record-manager` realm, under _Clients_ open the `record-manager` client and set
_Valid redirect URIs_ (by default it should be `http://localhost:5173/*`) and _Web Origins_ (by default it should be `http://localhost:5173`).

#### Additional configuration parameters

The environment variable `INTERNAL_RECORD_MANAGER_SERVER_SERVICE` points to the Record Manager backend. `http://host.docker.internal` can be used to configure the backend running locally on the host computer. See more info in the appropriate .env file, e.g., [keycloak-auth/.env](../deploy/keycloak-auth/.env).

### Running with all Services in Development Mode

This section describes the development scenario when the developer runs all dependent services in development mode.
By default, Record Manager UI runs at `http://localhost:5173` while Record Manager Server runs at different port.
This requires setting up the CORS policy of the server appropriately, i.e., configuring `config.properties`
to contain `security.sameSite=None` and set up also `cors.allowedOrigin` if needed.

## Adding Configuration Parameters

When runtime configuration parameters are added to the application, they also need to be added to Docker processing so
that environment variables can be used to set the variables. The following needs to be done:

1. Add the parameters to `.docker/config.js.template`
2. Add the parameters to environment substitution in `.docker/docker-entrypoint.sh`
3. Add the parameters to `.env.example`

## Securing the Application

The application supports two modes of authentication and authorization: internal and Keycloak-based.
It can be configured to use either of these modes. See [setup.md](./setup.md) for more details.

## Form generation

Forms are generated in the backend by SPipes Engine. See [form-generation.md](./form-generation.md) for more details.
