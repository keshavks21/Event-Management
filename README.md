# Initializing Project : Event Management

- Setup project : npm init
- Install dependencies :
    - npm install express
    - npm install dotenv
    - npm install pg
    
# For database , creating :
-   CREATE DATABASE event_management_db;
-   \c event_management_db; 
-   \conninfo

  - SetUp .env file for DATABASE_SECRET_KEY

-   CREATE TABLE users(id SERIAL PRIMARY KEY, name VARCHAR(50) NOT NULL, email VARCHAR(50) UNIQUE NOT NULL);
-   CREATE TABLE events(id SERIAL PRIMARY KEY, title VARCHAR(200)  NOT NULL, datetime TIMESTAMP NOT NULL, location VARCHAR(100) NOT NULL, capacity INTEGER CHECK (capacity > 0 AND capacity <= 1000) NOT NULL);
-    CREATE TABLE registrations(user_id INTEGER REFERENCES users(id), event_id INTEGER REFERENCES events(id), PRIMARY KEY(user_id,event_id));

# Creating evenet.js file :
-   Post api (/create/event/) : for creating event
