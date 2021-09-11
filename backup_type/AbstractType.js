var sails = require('sails');

class AbstractType {
  constructor() {
    if (this.constructor === AbstractType) {
      throw new TypeError('Abstract class "AbstractType" cannot be instantiated directly');
    }
    AbstractType.isImplemented(this);


  }

  static isImplemented(object) {
    var missingMethods = [];
    var isImplemented = true;
    var requiredMethods = [
      'getName',
      'getCode',
      'isDestination',
      'isOrigin',
    ];

    var requiredMethodsOrigin = [
      'getOriginParameters',
      'doOrigin',
      'checkOriginParameters'
    ];
    var requiredMethodsDestination = [
      'getDestinationParameters',
      'doDestination',
      'checkDestinationParameters',
      'getBackup',
      'deleteBackup'
    ];

    var resultRequired = AbstractType.haveMethods(object, requiredMethods);
    if (!resultRequired.haveMethods) {
      sails.log.error(`The object doesn't implement the AbstractType interface. Methods not found : ${resultRequired.missingMethods.join(', ')}`);
      isImplemented = false;
    } else {
      if (object.isOrigin()) {
        resultRequired = AbstractType.haveMethods(object, requiredMethodsOrigin);
        if (!resultRequired.haveMethods) {
          sails.log.error(`The object doesn't implement the AbstractType interface. Methods not found : ${resultRequired.missingMethods.join(', ')}`);
          isImplemented = false;
        }
      }

      if (object.isDestination()) {
        resultRequired = AbstractType.haveMethods(object, requiredMethodsDestination);
        if (!resultRequired.haveMethods) {
          sails.log.error(`The object doesn't implement the AbstractType interface. Methods not found : ${resultRequired.missingMethods.join(', ')}`);
          isImplemented = false;
        }
      }

    }

    return isImplemented;
  }

  static haveMethods(object, requiredMethods) {
    var missingMethods = [];
    for (var method of requiredMethods) {
      if (!object[method] || typeof object[method] !== 'function') {
        missingMethods.push(method);
      }
    }
    var haveMethods = true;
    if (missingMethods.length > 0) {
      haveMethods = false;
    }

    return {
      missingMethods: missingMethods,
      haveMethods: haveMethods
    };
  }
}


module.exports = AbstractType;
