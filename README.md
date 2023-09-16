# MyBackups

MyBackups is an application that help you do backups. You can specify source of files (ftp / drive / url / mysql...) and the destination.
You can also specify the frequency of the backup and the number of backups to keep.

However this application won't do complex backups for you, it will only help you to save the backup files where you want.

## Description

## Installation

## Development

## Installation
First you need to install the dependencies
```bash
$ npm install
```
Then you need to create a .env file in the root of the project with the following variables, you can adjust the values
```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=username
DATABASE_PASSWORD=password
DATABASE_NAME=database
```
## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
