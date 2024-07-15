# Record Manager UI Setup Guide

This guide provides information on how to build and deploy Record Manager UI.

## Build

### System Requirements

- NodeJS 14.x

### Setup

Uses `.env` to configure options like:

- url of backend
- application title in browser
- internationalization settings

See `.env.example` for detailed description of options.

## Docker Compose Deployment

This repo contains example Docker Compose configurations that can be used to spin up Record Manager (runs at [/record-manager](http://localhost:1235/record-manager)) quickly, with Record Manager server (runs at [/services/record-manager-server](/services/record-manager-server)),
a GraphDB repository (runs at [/services/db-server](http://localhost:1235/services/db-server)), S-pipes form generation, and Keycloak (runs at [/services/auth](http://localhost:1235/services/auth)) as the authentication service optionally. The configuration uses published images
of the dependent services.

### Set up with Internal Authorization

The deployment is based on [docker-compose.yml](../deploy/internal-auth/docker-compose.yml) and described in [Running with Dockerized Services and Internal Authorization](./development.md#running-with-dockerized-services-and-internal-authorization).

By default, if no `.env` is provided the application runs at `http://locahost:1235/record-manager`.

#### Set up behind reverse proxy

It is possible to set up Record Manager behind reverse proxy using variables:

- `PUBLIC_ORIGIN` -- Public origin of URL where Record Manager UI will run, e.g. `https://kbss.fel.cvut.cz`, `http://kbss.fel.cvut.cz:8080`, `http://localhost`.
- `RECORD_MANAGER_ROOT_PATH` - Path to Record Manager UI (by default it is set to "/record-manager").

Example set up with reverse proxy:

1. create `.env` file with following variables:

```
PUBLIC_ORIGIN=http://localhost
RECORD_MANAGER_ROOT_PATH=/record-manager-example
```

2. set up apache2 reverse proxy on the host computer:

```
<VirtualHost *:80>
        <Location /record-manager-example>
                ProxyPass http://localhost:1235/record-manager nocanon
                ProxyPassReverse http://localhost:1235/record-manager
        </Location>
</VirtualHost>
```

3. run the Record Manager UI at http://localhost/record-manager-example

### Set up with Keycloak Authorization

The deployment is pretty much self-contained based on [docker-compose.yml](../deploy/keycloak-auth/docker-compose.yml). It sets up the corresponding repositories, imports a realm where clients
are configured for both the Record Manager backend and frontend.

To run the deployment for the first time, follow these steps:

1. Create the `.env` file in directory [deploy/keycloak-auth](../deploy/keycloak-auth/docker-compose.yml) and set the following variables in it: `KC_ADMIN_USER`, `KC_ADMIN_PASSWORD`.
2. Run `docker compose up -d db-server` first. It uses a script that creates GraphDB repositories needed by the system.
3. Wait approximately 20s (check the log and wait for GraphDB to be fully up).
4. Start the rest of the system by running `docker compose up -d --build` (`--build` is used because Record Manager backend needs to be build)
5. Go to [http://localhost:1235/services/auth](http://localhost:1235/services/auth), login to the Keycloak admin console using `KC_ADMIN_USER` and `KC_ADMIN_PASSWORD`.
6. Select realm `record-manager`.
7. Add user accounts as necessary. Do not forget to assign them one of `ROLE_ADMIN` or `ROLE_USER` roles.
8. Go to [http://localhost:1235/record-manger](http://localhost:1235/record-manger) and log in using one of the created user accounts.

When running the deployment next time, just execute `docker compose up -d --build` and go to [http://localhost:1235/record-manger](http://localhost:1235/record-manger).
