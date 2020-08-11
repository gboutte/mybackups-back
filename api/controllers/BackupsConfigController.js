/**
 * BackupsConfigController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

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
      id:"uuid", //Will be generated on beforeCreate
      name:req.param("name"),
      enabled: true,
      to_keep:req.param("to_keep"),
      frequency:req.param("frequency"),
      from_type:req.param("from_type"),
      from_parameters:req.param("from_parameters"),
      to_type:req.param("to_type"),
      to_parameters:req.param("to_parameters")
    };

    var record = await BackupsConfig.create(values).fetch();
    return res.json(record);
  },

  /**
   * `BackupsConfigController.update()`
   */
  update: async function (req, res) {
    var criteria = {
        id:req.param("id")
    };
    var values = {
      name:req.param("name"),
      enabled: req.param('enabled'),
      to_keep:req.param("to_keep"),
      frequency:req.param("frequency"),
      from_type:req.param("from_type"),
      from_parameters:req.param("from_parameters"),
      to_type:req.param("to_type"),
      to_parameters:req.param("to_parameters")
    };

    var record = await BackupsConfig.update(criteria).set(values).fetch();
    return res.json(record);
  },

  /**
   * `BackupsConfigController.delete()`
   */
  delete: async function (req, res) {
    var criteria = {
        id:req.param("id")
    };
    var destroyedRecord = await BackupsConfig.destroy(criteria).fetch();
    return res.json(destroyedRecord);
  }

};
