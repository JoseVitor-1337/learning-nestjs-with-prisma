# Basic project

### Learning the basic of nestjs and prisma

![Badge projeto concluido](https://img.shields.io/badge/Status-Projeto%20concluido-blue)

## Technologies used

- [Nest.js](https://nodejs.org/en/)
- [Prisma](https://www.prisma.io/)
- [Typescript](https://www.typescriptlang.org/)

## Required installation to use

> Need have **npm** installed [Go Here to install](https://nodejs.org/en/)

> Need have **docker** installed [Go Here to install](https://docs.docker.com/desktop/install/windows-install/)

> Need have **git** installed [Go Here to install](https://git-scm.com/downloads)


## Usage

Install all dependencies for this the client

```
  npm install
```

You must run the docker commando to start postgre database to connect to the application

```
  npm run dev-db:restart
```

Now use prisma migrate to generate the tables into the database

```
  npm run prisma:dev:deploy
```

Now you start the server:

```
  npm run start:dev
```

Server be running on [http://localhost:3000](http://localhost:3000)
