/**
 * TestController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {


  /**
   * `TestController.types()`
   */
  types: async function (req, res) {
    return res.json({

        types: BackupTypes.types.map(
          (type)=> {return type.getName()}
        ),
        local:BackupTypes.getTypeByCode("Local")
    }
    );
  }

};
