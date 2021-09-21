/**
 * BackupsConfigController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const BackupCron = require('../../backup_cron/BackupCron');

function validParameters(values) {
  var valid = true;
  var fromType = BackupTypes.getTypeByCode(values.from_type);
  if (fromType !== null) {
    if (!fromType.checkOriginParameters(values.from_parameters).valid) {
      valid = false;
    }

  } else {
    valid = false;
  }
  var destType = BackupTypes.getTypeByCode(values.to_type);
  if (destType !== null) {
    if (!destType.checkOriginParameters(values.to_parameters).valid) {
      valid = false;
    }
  } else {
    valid = false;
  }
  if(!BackupCron.isValidFrequency(values.frequency)){
    valid = false;
  }
  return valid;

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
    var valid = validParameters(values);
    var record;
    if (valid) {
      record = await BackupsConfig.create(values).fetch();
      BackupCron.addCron(record);
    } else {
      record = null;
    }

    return res.json(record);
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

    var valid = validParameters(values);
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
