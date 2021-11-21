/**
 * BackupsConfigController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const BackupCron = require('../../backup_cron/BackupCron');

function validParameters(values) {
  let errors = {
    from_type: {
      error: true,
      message: 'The origin type is incorrect.'
    },
    from_parameters: {
      error: true,
      message: 'The origin parameters are incorrect.',
      parameters_errors: {}
    },
    destination_type: {
      error: true,
      message: 'The destination type is incorrect.'
    },
    destination_parameters: {
      error: true,
      message: 'The destination parameters are incorrect.',
      parameters_errors: {}
    },
    frequency: {
      error: true,
      message: 'The frequency is incorrect.'
    }
  };
  var valid = true;

  // == CHECKING ORIGIN ==
  var fromType = BackupTypes.getTypeByCode(values.from_type);
  if (fromType !== null) {
    let checkOrigin = fromType.checkOriginParameters(values.from_parameters);
    if (!checkOrigin.valid) {
      errors.from_parameters.parameters_errors = checkOrigin.errors;
      valid = false;
    } else {
      errors.from_parameters.error = false;
    }
    errors.from_type.error = false;
  } else {
    valid = false;
  }

  // == CHECKING DESTINATION ==
  var destType = BackupTypes.getTypeByCode(values.to_type);
  if (destType !== null) {
    let checkDestination = destType.checkOriginParameters(values.to_parameters);
    if (!checkDestination.valid) {
      errors.destination_parameters.parameters_errors = checkDestination.errors;
      valid = false;
    } else {
      errors.destination_parameters.error = false;
    }
    errors.destination_type.error = false;
  } else {
    valid = false;
  }

  // == CHECKING FREQUENCY ==
  if (!BackupCron.isValidFrequency(values.frequency)) {
    valid = false;
  } else {
    errors.frequency.error = false;
  }
  let result = {
    valid: valid,
    errors: errors
  };

  for (var key in result.errors) {
    if (!result.errors[key].error) {
      delete result.errors[key];
    }
  }
  return result;

}


module.exports = {


  /**
   * `BackupsConfigController.list()`
   */
  list: async function (req, res) {
    var configs = await BackupsConfig.find();
    return res.json(configs);
  },

  /**
   * `BackupsConfigController.create()`
   */
  create: async function (req, res) {

    var values = {
      id: 'uuid', //Will be generated on beforeCreate
      name: req.param('name'),
      enabled: true,
      to_keep: req.param('to_keep'),
      frequency: req.param('frequency'),
      from_type: req.param('from_type'),
      from_parameters: req.param('from_parameters'),
      to_type: req.param('to_type'),
      to_parameters: req.param('to_parameters')
    };
    if (typeof values.from_parameters !== 'undefined' && typeof values.from_parameters !== 'object') {
      values.from_parameters = JSON.parse(values.from_parameters);
    }
    if (typeof values.to_parameters !== 'undefined' && typeof values.to_parameters !== 'object') {
      values.to_parameters = JSON.parse(values.to_parameters);
    }
    var validResult = validParameters(values);
    let valid = validResult.valid;
    var record;

    if (valid) {
      record = await BackupsConfig.create(values).fetch();
      BackupCron.addCron(record);
    } else {
      record = null;
    }

    return res.json({
      record: record,
      ...validResult
    });
  },

  /**
   * `BackupsConfigController.update()`
   */
  update: async function (req, res) {
    var criteria = {
      id: req.param('id')
    };
    var values = {
      name: req.param('name'),
      enabled: req.param('enabled'),
      to_keep: req.param('to_keep'),
      frequency: req.param('frequency'),
      from_type: req.param('from_type'),
      from_parameters: req.param('from_parameters'),
      to_type: req.param('to_type'),
      to_parameters: req.param('to_parameters')
    };
    if (typeof values.from_parameters !== 'undefined') {
      values.from_parameters = JSON.parse(values.from_parameters);
    }
    if (typeof values.to_parameters !== 'undefined') {
      values.to_parameters = JSON.parse(values.to_parameters);
    }
    var validResult = validParameters(values);
    let valid = validResult.valid;

    var record;
    if (valid) {
      record = await BackupsConfig.updateOne(criteria).set(values);
      BackupCron.removeCron(record.id);
      BackupCron.addCron(record);
    } else {
      record = null;
    }
    return res.json(record);
  },

  /**
   * `BackupsConfigController.delete()`
   */
  delete: async function (req, res) {
    var criteria = {
      id: req.param('id')
    };
    var destroyedRecord = await BackupsConfig.destroy(criteria).fetch();
    BackupCron.removeCron(destroyedRecord.id);
    return res.json(destroyedRecord);
  }

};
