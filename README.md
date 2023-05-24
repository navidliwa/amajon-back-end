# AMAJON BACK END

## Description
This project uses the Sequalize and MySQL2 to connect with a MySQL database modeled after an ecommerce platform. The code allows you to create a database and seed it with data fitting the models defined using Sequalize. Once seeded, you can start the database and send GET, POST, PUT and DELETE requests to fetch, update, or delete data from the database.

[Click here for a video demonstrating this project's usage!](https://www.youtube.com/watch?v=5YGqtcgrD-c)


## Table of Contents

- [Installation](#installation)

- [Usage](#usage)

- [Features](#features)

- [License](#license)

## Installation
To install simply download or clone this repository into a folder of your choosing on your local machine.


## Usage
After installed open up a terminal from the root folder of this project and invoke "mysql -u root -p", you will then be prompted for a password--you can input "root". Once connected to the database invoke "source db/schema.sql" and a database will be created. In a new terminal, you can use "npm run seed" to populate the database with data. Once there's information in the database you can invoke "npm start" in the command line. This will start the server and connect to the MySQL database. Once started you can test the Products, Categories and Tags routes by passing GET, POST, PUT and DELETE http requests through insomnia. The database will then be updated using the request bodies if applicable. Please refer to the video linked in the description for a more detailed overview.


## Features
- Connects to a MySQL database
- Allows for testing of Products, Categories and Tags routes
- Allows GET, POST, PUT and DELETE http requests to routes
- Updates database to reflect request bodies

## License
Licensed under the MIT License.

GitHub: [navidliwa](https://github.com/navidliwa)