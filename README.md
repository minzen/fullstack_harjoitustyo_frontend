# Project work "Memory tracks" for the course Full Stack Web Development at University of Helsinki

See [https://courses.helsinki.fi/en/aytkt21010/129098202](https://courses.helsinki.fi/en/aytkt21010/129098202) and [https://github.com/fullstackopen-2019/misc/blob/master/projekti.md](https://github.com/fullstackopen-2019/misc/blob/master/projekti.md) for the reference regarding the course information.

The project has been implemented in three different git repositories: [the first one contains the backend implementation on top of NodeJS and GraphQL](https://github.com/minzen/fullstack_harjoitustyo_backend), [the second repository has the React JS based frontend implementation](https://github.com/minzen/fullstack_harjoitustyo_frontend) and [the third one has the experimental React Native implementation for iOS and Android mobile devices](https://github.com/minzen/fullstackharjoitustyoreactnative).

## General

The application "Memory tracks" is designated for a user who utilizes Internet services with multiple devices and wants to easily access the previously store data. The application enables an easy way of storing/linking meaningful content (e.g. important notes, links to web resources that the user wants to have a look at a bit later). The notes can be stored, classified and searched by using keywords. The frontend takes care of fetching and presenting the information obtained from the API provided by the backend.

The use of the application requires a user account. You can register one by using the instructions listed on the landing page of the application.

## Frontend implementation

The frontend implementation has been mostly built on ReactJS and Material UI framework. Apollo Client is used to access the data from the GraphQL API.

## Build and execution

### System requirements

- nodejs (e.g. v.10.19.0), yarn/npm installed
- The backend implementation has to be running on a server (e.g. on localhost)

### Building the application

- execute the command _yarn install_ to install the required dependencies
- The production version of the frontend is built by invoking the command _yarn run build_. This triggers a webpack build in the application directory. As a result the directory _build_ is generated. This can be copied to a desired server, where it can be run e.g. with the command _serve -s build -l 3000_
- In the previous command the last parameter specifies in which port the application will be run. The command serve has to be naturally installed by the packet manager _yarn_ or _npm_.

At the moment the production version of the application [resides at https://minzen.github.io/fullstack_harjoitustyo_frontend/)](https://minzen.github.io/fullstack_harjoitustyo_frontend/). The frontend designated for the end-to-end tests is run at [https://agile-dusk-61060.herokuapp.com/](https://agile-dusk-61060.herokuapp.com)

## Executing the end-to-end tests

The project includes a set of end-to-end tests implemented on top of the framework cypress.io. Running the tests locally can be achieved by executing the command _yarn run cypress:open_. Before this the backend has to be started with the command _yarn run e2e_. This triggers an initialization of an In-Memory MongoDB instance that can easily be restored to the desired state before the tests.

## Used technologies

- React JS
- GraphQL + Apollo Client and other Apollo related libraries
- Material UI
- ESLint
- Webpack
- i18next for localization
- Cypress.io

## Time keeping

[Time keeping for the project work](https://github.com/minzen/fullstack_harjoitustyo_backend/blob/master/tyokirjanpito.md)
