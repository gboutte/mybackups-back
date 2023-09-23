# MyBackups

MyBackups is an application that help you do backups. You can specify source of files (ftp / drive / url / mysql...) and
the destination.
You can also specify the frequency of the backup and the number of backups to keep.

However this application won't do complex backups for you, it will only help you to save the backup files where you
want.

## Description

## Installation

## Contributing

### Installation

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

### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Creating a backup type

To create a backup type you need to create a new file in the `src/backups/backups-type/types` folder.

The file must export a class that extends the `AbstractType` class.

You'll need to create a method called `getConfig` that will return a `BackupTypeConfigInterface` object.

Here is an example

```typescript
getConfig()
:
BackupTypeConfigInterface
{
  return {
    name: 'Local',
    code: 'local',
    description: 'Local backup',
  };
}
```

The `AbstractType` will give you access to some methods that you can use to help you create your backup type.

- `getParameters` will return the parameters that are typed by the user.
- `getParameter` will return a specific parameter.
- `hasParameter` will check if a parameter exists.
- `getTemporaryDirectory` will give you the path to the directory to put the backup done by the source. Then the
  destination will take it from there.

Then the there is two interface that you can implement. One to allow your type to be used as a source, and another for
the destination.

- `BackupSourceInterface`
- `BackupDestinationInterface`

For each interface you will need to implement 3 methods.

#### BackupSourceInterface

For the source you will need to implement the following methods:

- `getSourceParameters` that allow you to define all the parameters that the user can set for the source.
- `validateSourceParameters` that's where you will validate the parameters that the user set.
- `doSource` that's where you will do the backup.

##### getSourceParameters

This method will return an array of `BackupSourceParameterInterface` that will be used to create the form for the user.

The `BackupSourceParameterInterface` has the following properties:

- `name` the name of the parameter
- `description` the description of the parameter
- `type` the type of the parameter (BackupParameterTypeEnum.STRING, BackupParameterTypeEnum.NUMBER,
  BackupParameterTypeEnum.BOOLEAN)
- `required` if the parameter is required or not

Here is an example:

```typescript
getSourceParameters()
:
BackupParameterInterface[]
{
  return [
    {
      name: 'path',
      description: 'The path to backup',
      type: BackupParameterTypeEnum.STRING,
      required: true,
    },
  ];
}
```

##### validateSourceParameters

This method will be called when the backup is triggered. It will receive the parameters that the user set.

Before calling this method the system will validate the parameters using the required property.

You can return `true` or an array of `BackupParameterErrorInterface` that will explain why the parameter is invalid.

Here is an example:

```typescript
 validateSourceParameters()
:
true | BackupParameterErrorInterface[]
{
  const errors: BackupParameterErrorInterface[] = [];
  const path = this.getParameter('path');

  //Check if the path defined by the user is readable
  try {
    fs.accessSync(path, fs.constants.R_OK);
  } catch (err) {

    // There was an error so the path isn't readable, we add an error to the array
    errors.push({
      parameter: 'path',
      message: `The path "${path}" isn't readable.`,
    });
  }

  return errors.length > 0 ? errors : true;
}
```

##### doSource

This method will be called when the backup is triggered. It will receive the parameters that the user set.

At this step the parameters are validated by the system using the required then by calling the
method `validateSourceParameters`.

You will need to put the backup file in the temporary directory using the method `getTemporaryDirectory`.

And then you will return the path to the backup file inside a `BackupSourceResultInterface` object.

Here is an example:

```typescript
doSource(): Promise<BackupSourceResultInterface> {
    const tmpDir = this.getTemporaryDirectory();
    
    return new Promise((resolve, reject) => {
        
        // Do your things here to save the backup file in the temporary directory
        // ...
        
        resolve({
            temporaryFile: "newbackup.zip", // Replace with the name of the backup file
        });
    });
}