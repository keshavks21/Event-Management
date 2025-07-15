# Initializing Project : Event Management

- Setup project : npm init
- Install dependencies :
    - npm install express
    - npm install dotenv
    - npm install pg

# we use: npm start to start the app
-   "start": "nodemon ./src/app.js" : when we run npm start then this command will run in shell and our app run
    
# For database , creating :
-   CREATE DATABASE event_management_db;
-   \c event_management_db; 
-   \conninfo

# SetUp .env file for DATABASE_SECRET_KEY and PORT

-   CREATE TABLE users(id SERIAL PRIMARY KEY, name VARCHAR(50) NOT NULL, email VARCHAR(50) UNIQUE NOT NULL);
-   CREATE TABLE events(id SERIAL PRIMARY KEY, title VARCHAR(200)  NOT NULL, datetime TIMESTAMP NOT NULL, location VARCHAR(100) NOT NULL, capacity INTEGER CHECK (capacity > 0 AND capacity <= 1000) NOT NULL);
-    CREATE TABLE registrations(user_id INTEGER REFERENCES users(id), event_id INTEGER REFERENCES events(id), PRIMARY KEY(user_id,event_id));

# Creating evenet.js file for creating APIs:

- Post APIs :
    - (/create/event/) : for creating event
    - (/create/user/) : for creating new user
    - (/event/:eventId/register) : for register user for any events

- Get APIs : 
    - (/event/upcoming) : for getting all upcomig events 
        - we put this api before (/event/:eventId) because if we use this after this api then   upcoming will match to :eventId and gives error. So we put dynamic routing after static.

    - (/event/:eventId) : for getting all details of events 
    - (/event/:eventId/stats) : for getting statistics of any events

- Delete API :
    - (/event/:eventId/cancle) : for cancle user registration for any events
