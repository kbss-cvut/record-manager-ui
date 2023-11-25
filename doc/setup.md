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

This repo contains example Docker Compose configurations that can be used to spin up Record Manager quickly, with Record Manager server,
a GraphDB repository, S-pipes form generation, and Keycloak as the authentication service optionally. The configuration uses published images
of the dependent services.

### Set up with Internal Authorization

This setup is described in [Running with Dockerized Services and Internal Authorization](./development.md#running-with-dockerized-services-and-internal-authorization).

### Set up with Keycloak Authorization

The deployment is pretty much self-contained. It sets up the corresponding repositories, imports a realm where clients
are configured for both the Record Manager backend and frontend. All the services (except PostgreSQL used by Keycloak) 
in the deployment export their ports to the host system, so ensure the following ports are available on your system: 
3000, 8080, 8081, 8088.

To run the deployment for the first time, follow these steps:

1. Create the `.env` file and set the following variables in it: `KC_ADMIN_USER`, `KC_ADMIN_PASSWORD`.
2. Run `docker compose up -d db-server` first. It uses a script that creates GraphDB repositories needed by the system.
3. Wait approximately 20s (check the log and wait for GraphDB to be fully up).
4. Start the rest of the system by running `docker compose up -d --build` (`--build` is used because Record Manager backend needs to be build)
5. Go to [http://localhost:8088](http://localhost:8088), login to the Keycloak admin console using `KC_ADMIN_USER` and `KC_ADMIN_PASSWORD`.
6. Select realm `record-manager`.
7. Add user accounts as necessary. Do not forget to assign them one of `ROLE_ADMIN` or `ROLE_USER` roles.
8. Go to [http://localhost:3000](http://localhost:3000) and log in using one of the created user accounts.

When running the deployment next time, just execute `docker compose up -d --build` and go to [http://localhost:3000](http://localhost:3000).
