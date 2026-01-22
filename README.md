# tax-test
A simple application to manage user profiles and track their engagements/activities in tax-related projects.

## Running the Application

In order to run the application locally, please follow the following instructions:

1. `git clone` the repository
2. cd into the tax-coding-test repository
3. run `npm install`
4. run `npm start` to launch the web app
5. run `npm run test:all` to run unit and e2e tests

# Needs Analysis & Assumptions:

I first interpreted the three main objectives as:
    1. Create Users which have a one to many relationship with activities
    2. Allow CRUD on users and activities
    3. Filter on activities
    4. Have CRUD operations persist

So many assumptions were made. Here are a few:
- data attributed to users and activities like email, data, name
- dates attributed to activities were selecteable and not always last updated/created
- dates could be selected in the future
- not allowing the deletion of a user unless their activities have been deleted
- allowing an activity to be updated to a new user


# What needs improvement:


# Technologies:
For the backend I decided to go with NestJS as I have previous experience (though a few years old) and it is recommended for quick projects. Similarily SQLite with TypeORM was chosen for ease of implementation. Even data as simple as users[]->activities[] is already lending itself to SQL over JSON. 


# Steps

Started by asking ChatGPT how it would solve this.
Decided on NestJS since I have prior experience but wanted a refresher.
Started with updating packages, installing nestjs.
