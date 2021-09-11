const { types } = require('../../backup_type');


module.exports = {


  /**
   * `BackupsConfigController.list()`
   */
  list: function (req, res) {
    let typesResults = [];

    types.forEach(type => {
      typesResults.push({
        code: type.getCode(),
        name: type.getName(),
        isOrigin: type.isOrigin(),
        isDestination: type.isDestination(),
        parameters: type.getParameters(),
      });
    });

    return res.json(typesResults);
  },
};
