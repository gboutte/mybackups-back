var schedule = require('node-schedule');

class BackupCron{

  constructor(){


  }



  static removeCron(uuid){
      for(let i = 0;i < cron.length;i++){
          if(uuid == cron[i].id){
              cron[i].sh.cancel();
              cron.splice(i,1);
          }
      }

  }
  static addCron(uuid){
    // this.backupPlan.find({uuid:uuid}, function(err, plans) {
    //     if (!err){
    //         for (let i = 0;i<plans.length;i++){
    //             let plan = plans[i];
    //             if(plan.enabled){
    //                 cron.push({
    //                     'id':plan.uuid,
    //                     'sh': schedule.scheduleJob(BackupsUtil.frequencyToCron(plan.frequency,plan.first_date), function(){
    //                         BackupsUtil.doBackup(plan.uuid)
    //                     })
    //
    //                 })
    //             }
    //         }
    //     } else {throw err;}
    // });
  }

  static doBackup(uuid){
    
  }

}

modules.export =  BackupCron;
