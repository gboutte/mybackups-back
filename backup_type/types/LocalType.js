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
    return getParameters();
  }
  checkDestinationParameters(parameters) {
    var parametersOk = true;
    try {
      fs.accessSync(parameters.path, fs.constants.W_OK);
    }
    catch (err) {
      sails.log.error(err);
      parametersOk = false;
    }

    return {
      valid: parametersOk,
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
    return getParameters();
  }
  checkOriginParameters(parameters) {
    var parametersOk = true;
    try {
      fs.accessSync(parameters.path, fs.constants.R_OK);
    }
    catch (err) {
      sails.log.error(err);
      parametersOk = false;
    }
    return {
      valid: parametersOk,
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
