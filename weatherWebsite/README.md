# CS402 homework 4 Project

## Author

Timothy Thoman

## Description
This is a web application for getting live weather using a real weather api. The frontend is built with Angular and the backend is built with Spring and mongodb. This application lets you login to already created users.

## Installation

Make sure you have Angular, Maven, Spring, and MongoDB (Free small verison) installed.

## Running program

Open 2 terminals and run the following in order:
Anywhere in one of the terminals run:
```
mongod
```

In the next terminal, cd into the weatherlist folder and run:
```
mvn spring-boot:run
```

Open a browser and go to http://localhost:8080 to see the program

## Using the software

There are 3 logins you can use, it doesn't matter which one.

email: tom@uwlax.edu
password : 123

email : sue@uwlax.edu 
password : abc

email : fin@uwlax.edu
password : xyz

## Known bugs and problem areas

If you click on the home page, you automatically go to the main page without logging in. If you click on the home tab, just click on the profile on the top left and logout, or go back a page on the browser.

The profile in the top right should not show up until you login.

There's some issues with deleting locations.
