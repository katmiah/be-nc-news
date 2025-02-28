Setting Up Environment Variables

Since .env.* files are ignored by Git, you must create them manually to configure the databases for local development.

Required .env Files

Create the following environment files in the root of your project:

.env.development

.env.test

Environment Variables

Each .env file should contain the appropriate database connection string:

.env.development (for local development database)

PGDATABASE=bookshop_dev

.env.test (for running tests)

PGDATABASE=bookshop_test




