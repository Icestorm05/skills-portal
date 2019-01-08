# Skills Portal

The Skills Portal is an application developed to help manage and create statistics on the skills in a business.
The application allows a user to choose from a selection of different skills, and add them to their own skill profile. They may choose a skill they feel they are competent in, and assign a currency and level value to them. This skill will initially get flagged for approval by their line manager.
Line managers in the system have the option of viewing skills of their team members. They may also approve or disapprove skills that they have submitted.

## Dependencies

The application requires v8 of [Node.js](https://nodejs.org/en/download/), [MongoDB](https://www.mongodb.com/download-center?jmp=nav#community) and [SQL Server](https://www.microsoft.com/en-gb/sql-server/sql-server-2017).

It will also require the npm module `node-gyp` to be installed globally. This is required in order to compile the Microsoft SQL Server Client for Node.js. To install this run the following command:
```sh
$ sudo npm install node-gyp -g
```

You will also need to have Xcode downloaded, if you are on a Mac. To do so, run the following command:
```sh
$ sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
```

In SQL server, you will need to restore the skills database which is called `skills.bak` in the root directory of this project.

To setup authentication for the app, copy the file `server/config.sample.js` to `server/config.js` and fill out the JSON file with your authentication details to SQL Server and MongoDB.

## Default Users

Username: Michael.Tugby@test.com   
Password: test123   
Role: User   

Username: John.Doe@test.com   
Password: test123   
Role: Line Manager   

## Live Website

The live version of the project can be found [here](www.skillsportaldemo.co.uk).

## Build Setup

First, install all dependencies:
```sh
$ npm install
```

### Dev Server

To start the application up with hot reload:
```sh
$ npm run dev
```

**This server should NOT be used in production.**

### Prod Server

To generate all of the static content:
```sh
$ npm run build
```

To start the prod server:
```sh
$ npm start
```

For detailed explanation on how things work, checkout the [Nuxt.js docs](https://github.com/nuxt/nuxt.js).
