# Development

This file contains info for contributors to the Record Manager UI codebase.

## Running in Development Mode

To configure the application use [Setup Guide](./setup.md).
To run application in development mode use `npm run dev`. 
By default, the application is accessible from http://localhost:3000.

## Add Configuration Parameters

When runtime configuration parameters are added to the application, they also need to be added to Docker processing so
that environment variables can be used to set the variables. The following needs to be done:

1. Add the parameters to `.docker/config.js.template`
2. Add the parameters to environment substitution in `.docker/docker-entrypoint.sh`
3. Add the parameters to `.env.example`
