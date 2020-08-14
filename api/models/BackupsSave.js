module.exports = {
  attributes: {
    data: { type: 'json',required:true},
    type: {type:'string',required:true},
    config: { model:'backupsconfig'}
  },
};
