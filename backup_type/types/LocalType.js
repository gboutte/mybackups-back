var sails = require('sails');
const fs = require('fs');
const path = require('path')
var moment = require('moment');
var AbstractType = require('../AbstractType');

class LocalType extends AbstractType{

  constructor(){
    super();
  }

  getName(){
    return "Local";
  }

  getCode(){
    return "local";
  }

  getParameters(){
    return [
      {
        name:"path",
        label: "Path",
        type:"string"
      }
    ];
  }

  //Destination part
  isDestination(){
    return true;
  }
  getDestinationParameters(){
    return getParameters();
  }
  checkDestinationParameters(parameters){
    var parametersOk = true;
    try {
      fs.accessSync(parameters.path, fs.constants.W_OK);
    }
    catch (err) {
      parametersOk = false;
    }

    return {
      valid:parametersOk,
      parameters:parameters
    };
  }
  doDestination(parameters,pathToFile){

    var newName =
    this.getName()+
    "-"+moment().format('DDMMYYYYHHmmss')+
    "."+path.extname(parameters.path);

    fs.copyFile(pathToFile, parameters.path+newName, (err) => {
      if (err) sails.log.error(err);
    });
  }

  //Origin part

  isOrigin(){
    return true;
  }
  getOriginParameters(){
    return getParameters();
  }
  checkOriginParameters(parameters){
    var parametersOk = true;
    try {
      fs.accessSync(parameters.path, fs.constants.R_OK);
    }
    catch (err) {
      parametersOk = false;
    }
    return {
      valid:parametersOk,
      parameters:parameters
    };
  }


  //tmpDir always end with "/"
  //Must return object with attribut tmpFile
  doOrigin(parameters,tmpDir){
    var newName =
    this.getName()+
    "-"+moment().format('DDMMYYYY')+
    "."+path.extname(parameters.path);

    fs.copyFile(parameters.path, tmpDir+newName, (err) => {
      if (err) sails.log.error(err);
    });
    return {
      tmpFile: newName
    }
  }



}


module.exports = new LocalType();
