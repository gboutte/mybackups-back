var sails = require('sails');
const fs = require('fs');
const path = require('path');
var moment = require('moment');
var AbstractType = require('../AbstractType');

class LocalType extends AbstractType {

  constructor() {
    super();
  }

  getName() {
    return 'Local';
  }

  getCode() {
    return 'local';
  }

  getParameters() {
    return [
      {
        name: 'path',
        label: 'Path',
        type: 'string'
      }
    ];
  }

  //Destination part
  isDestination() {
    return true;
  }
  getDestinationParameters() {
    return this.getParameters();
  }
  checkDestinationParameters(parameters) {
    var parametersOk = true;
    let errors = {
      path: {
        error: false,
        message: null
      }
    };
    try {
      fs.accessSync(parameters.path, fs.constants.W_OK);
    }
    catch (err) {
      // sails.log.error(err);
      parametersOk = false;
      errors.path.error = true;
      errors.path.message = 'The path isn\'t writable.';
    }

    return {
      valid: parametersOk,
      errors: errors,
      parameters: parameters
    };
  }
  async doDestination(config, parameters, pathToFile) {
    return new Promise((resolve, reject) => {
      var newName =
        config.name +
        '-' + moment().format('DDMMYYYYHHmmss') +
        path.extname(pathToFile);

      fs.copyFile(pathToFile, parameters.path + newName, (err) => {
        if (err) {
          sails.log.error(err);
          reject(err);
        } else {
          resolve({
            backupData: {
              path: parameters.path + newName
            }
          });
        }
      });
    });
  }

  getBackup(data) {
    var global_data = fs.readFileSync(data.path).toString();
    return global_data;

  }
  deleteBackup(data) {
    const path = data.path;
    try {
      fs.unlinkSync(path);
      return true;
    } catch (err) {
      sails.log.error(err);
      return false;
    }
  }

  //Origin part

  isOrigin() {
    return true;
  }
  getOriginParameters() {
    return this.getParameters();
  }
  checkOriginParameters(parameters) {
    let errors = {
      path: {
        error: false,
        message: null
      }
    };
    var parametersOk = true;
    try {
      fs.accessSync(parameters.path, fs.constants.R_OK);
    }
    catch (err) {
      // sails.log.error(err);
      errors.path.error = true;
      errors.path.message = 'The path isn\'t readable.';
      parametersOk = false;
    }
    return {
      valid: parametersOk,
      errors: errors,
      parameters: parameters
    };
  }


  //tmpDir always end with "/"
  //Must return object with attribut tmpFile
  doOrigin(config, parameters, tmpDir) {
    return new Promise((resolve, reject) => {
      var newName =
        config.name +
        '-' + moment().format('DDMMYYYYHHmmss') +
        path.extname(parameters.path);

      fs.copyFile(parameters.path, tmpDir + newName, (err) => {
        if (err) {
          sails.log.error(err);
          reject(err);
        } else {
          resolve({
            tmpFile: newName
          });
        }
      });

    });
  }
}


module.exports = new LocalType();
