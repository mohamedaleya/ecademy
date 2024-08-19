#!/bin/sh

# Wait for the MySQL server to be available
until nc -z -v -w30 db 3306; do
  echo 'Waiting for MySQL...'
  sleep 1
done
echo "MySQL is up and running"

# Run Prisma migrations
npx prisma migrate deploy

# Seed the database
node ./scripts/seed.ts

# Start the application
exec "$@"