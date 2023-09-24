# MyBackups

## Description

MyBackups is an application that helps you make backups. You can specify source of files (ftp / drive / url / mysql...)
and
the destination.
You can also specify the frequency of the backup and the number of backups to keep.

However, this application won't do complex backups for you, it will only help you to save the backup files where you
want.

## How it works

You can create backups config, for each config you can specify multiple sources and multiple destinations.

Then you can trigger the backup manually or you can specify a frequency to trigger the backup automatically.

When a backup is triggerd:

1. First the sources will be executed. All those sources will put their backup files in a temporary directory.
2. If the result of the sources is multiple files (inside the temporary directory), all these files will be compressed
   in a zip file.
3. Then the destinations will be executed. All those destinations will take the backup file from the temporary directory
   and put it where you want.
4. After that the temporary directory will be cleaned.
5. Finally, if you specified a number of backups to keep, the system will delete the oldest backups if it's needed.

## Installation

Coming soon, when the docker image is ready.

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

You also can find examples in this folder (`src/backups/backups-type/types`).

The file must export a class that extends the `AbstractType` class.

You'll need to create a method called `getConfig` that will return a `BackupTypeConfigInterface` object.

Here is an example:

```typescript
export class LocalType extends AbstractType {
  getConfig(): BackupTypeConfigInterface {
    return {
      name: 'Local',
      code: 'local',
      description: 'Local backup',
    };
  }
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
- `type` the type of the parameter (`BackupParameterTypeEnum.STRING`, `BackupParameterTypeEnum.NUMBER`,
  `BackupParameterTypeEnum.BOOLEAN` )
- `required` if the parameter is required or not

Here is an example:

```typescript

```

##### validateSourceParameters

That's where you will validate the parameters that the user set.

This method will be called when the backup is triggered. It will receive the parameters that the user set.

Before calling this method the system will automatically check that the required parameters are set, so you don't need
to do it.

You can return `true` or an array of `BackupParameterErrorInterface` that will explain why the parameter is invalid.

Here is an example:

```typescript
 
```

##### doSource

This method will be called when the backup is triggered. It will receive the parameters that the user set.

At this step the parameters are validated by the system using the required then by calling the
method `validateSourceParameters`.

You will need to put the backup file in the temporary directory using the method `getTemporaryDirectory`.

And then you will return the path to the backup file inside a `BackupSourceResultInterface` object.

This path need to be relative to the temporary directory.

###### Example of the source implementation

```typescript
export class LocalType extends AbstractType implements BackupSourceInterface {

  getConfig(): BackupTypeConfigInterface {
    return {
      name: 'Local',
      code: 'local',
      description: 'Local backup',
    };
  }

  // The definition off the parameters that the user can set
  getSourceParameters(): BackupParameterInterface[] {
    return [
      {
        name: 'path',
        description: 'The path to backup',
        type: BackupParameterTypeEnum.STRING,
        required: true,
      },
    ];
  }

  // The validation of the parameters that the user set
  validateSourceParameters(): true | BackupParameterErrorInterface[] {
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

  // The backup process
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
}
```