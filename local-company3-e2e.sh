# This file starts the company 3 containers for integration testing. 
# Make sure that if you have postgresql installed, to stop or disable 
# the service before starting the containers. This will free up port 
# 5432 for the postgresql database to run.

# Set environment variables
export BACKEND_URL=http://localhost:4000/graphql
export ALGORITHM1_URL=http://localhost:4040
export ALGORITHM2_URL=http://localhost:5000
export DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres

# Install dependencies
npm install

# Build and run the containers
if ! command -v docker compose
then
    sudo docker-compose build
    sudo docker-compose up
else
    sudo docker compose build
    sudo docker compose up
fi