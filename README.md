# Pharma API


## Requirements

Before you begin, make sure you have the following tools installed on your machine:

- [Git](https://git-scm.com)
- [Docker](https://www.docker.com)
- [Node.js](https://nodejs.org) (version 20.x or higher)
- [NestJS CLI](https://docs.nestjs.com/cli/overview)
- [Prisma CLI](https://www.prisma.io/docs/concepts/components/prisma-cli)

## Setup Instructions

### 1. Configuring Environment Variables

Copy the `.env.example` file and rename it to `.env`. Adjust the environment variables as necessary:

```bash
cp .env.example .env
```

### 2. Starting the Database with Docker

Ensure Docker is running. The `docker-compose.yml` file is already configured for PostgreSQL.

Run the following command to start the database:

```bash
docker-compose up -d
```
This will start the PostgreSQL service with the volume and network settings described in the `docker-compose.yml` file.

### 3. Install Dependencies

Next, install the project dependencies using npm:

```bash
npm install
```
This will start the PostgreSQL service with the volume and network settings described in the `docker-compose.yml` file.


### 4. Running Prisma Migrations
After setting up the database, run the migrations to ensure the database schema is up to date:
```bash
npx prisma migrate dev
```

### 5. Generate Prisma Client
To generate the Prisma client, which handles database interactions, run:
```bash
npx prisma generate
```

### 6. Starting the Server
Now you can start the server in development mode:
```bash
npx run start:dev
```
The API will be available at `http://localhost:3000`.

### Running Tests
To run automated tests, use the following command:
```bash
npm run test
```
To run automated tests e2e, use the following command:
```bash
npm run test:e2e
```