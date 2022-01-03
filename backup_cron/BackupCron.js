var schedule = require('node-schedule');
const cronValidator = require('cron-validator');
var sails = require('sails');
const os = require('os');

class BackupCron {

  constructor() {
    this.cron = [];
    this.initiated = false;
  }
  initCron() {
    if (!this.initiated) {
      BackupsConfig.find().then((configs) => {
        for (var config of configs) {
          this.addCron(config);
        }
      });
      this.initiated = true;
    }
  }

  isValidFrequency(frequency) {
    return cronValidator.isValidCron(frequency);
  }

  removeCron(id) {
    for (let i = 0; i < this.cron.length; i++) {
      if (id === this.cron[i].id) {
        sails.log.info('[CRON] remove: ' + id);
        this.cron[i].sh.cancel();
        this.cron.splice(i, 1);
      }
    }

  }
  addCron(config) {
    var self = this;
    if (config.enabled) {
      var fromType = BackupTypes.getTypeByCode(config.from_type);
      var toType = BackupTypes.getTypeByCode(config.to_type);
      if (fromType !== null && toType !== null && fromType.checkOriginParameters(config.from_parameters).valid && toType.checkDestinationParameters(config.to_parameters).valid) {
        sails.log.info('[CRON] add: ' + config.id);
        this.cron.push({
          'id': config.id,
          'sh': schedule.scheduleJob(config.frequency, () => {
            self.doBackup(config.id);
          })

        });
      } else {
        sails.log.warn('[CRON] invalid configuration: ' + config.id);
      }
    }
  }

  addCronFromId(id) {
    console.log(id);
    //@Todo implement
  }

  async doBackup(id) {
    sails.log.info('[CRON] backup: ' + id);
    var config = await BackupsConfig.findOne({ id: id }).populate('saves');
    var fromType = BackupTypes.getTypeByCode(config.from_type);
    var toType = BackupTypes.getTypeByCode(config.to_type);
    if (fromType !== null && toType !== null && fromType.checkOriginParameters(config.from_parameters).valid && toType.checkDestinationParameters(config.to_parameters).valid) {

      var tmpDir = os.tmpdir() + '/';
      var fromResult = await fromType.doOrigin(config, config.from_parameters, tmpDir);
      var backupResult = await toType.doDestination(config, config.to_parameters, tmpDir + fromResult.tmpFile);
      console.log(backupResult.backupData)
      //create backup
      await BackupsSave.create({
        id: 'uuid',
        data: backupResult.backupData,
        type: config.to_type,
        config: config.id
      });
      //check to keep
      var currentNumberSaves = config.saves.length + 1;
      if (currentNumberSaves > config.to_keep) {
        var savesToDelete = await BackupsSave.find({
          where: { config: config.id },
          limit: (currentNumberSaves - config.to_keep),
          sort: 'createdAt ASC'
        });
        for (var save of savesToDelete) {
          await this.deleteSave(save.id);
        }
      }
    }

  }

  async deleteSave(id) {
    var save = await BackupsSave.findOne({ id: id });
    var toType = BackupTypes.getTypeByCode(save.type);
    if (toType !== null) {
      await toType.deleteBackup(save.data);
      await BackupsSave.destroy({ id: save.id });
    }
  }



}

module.exports = new BackupCron();
