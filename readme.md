# vidxpress-api

> RESTful API for video rental app built with Node, Express and MongoDB

## Setup

### Config

Export environment variables based on config/custom-environment-variables.json

```bash
# Mac/Linux
export MONGO_URI=yourMongoDBConnectionString
export PORT=3000
export JWT_SECRET=yourSecureKey

# Windows
set MONGO_URI=yourMongoDBConnectionString
set PORT=3000
set JWT_SECRET=yourSecureKey
```

Or create enviroment config files. The config name corresponds to the NODE_ENV environment variable.

```bash
# Dev config
cp config/default.json config/development.json

# Prod config
cp config/default.json config/production.json

# Test config
cp config/default.json config/test.json
```

### Install Dependencies

```bash
npm install
```

### Run App

```bash
# Run the server
npm start

# Run in dev mode
npm run dev
```

### Database Seeder

To seed the database with data from the "database/data" folder, run

```bash
# Import all data
npm run seed -- -i

# Destroy all data
npm run seed -- -d
```

## Testing

Run the tests to make sure everything is working.

```bash
# Run all tests
npm test

# Run all tests from a specific directory
npm test -- tests/integration/routes

# Run a single test
npm test -- tests/integration/routes/returns
```

## Demo

The API is live at [vidxpress-api.herokuapp.com](https://vidxpress-api.herokuapp.com)
