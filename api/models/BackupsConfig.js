


module.exports = {
  attributes: {
    name: { type: 'string', required: true },
    enabled: { type: 'boolean', defaultsTo: true },
    to_keep: { type: 'number', columnType: 'INT', required: true },
    frequency: { type: 'string', required: true },
    from_type: { type: 'string', required: true },
    to_type: { type: 'string', required: true },
    from_parameters: { type: 'json', required: true },
    to_parameters: { type: 'json', required: true },
    saves: { collection: 'backupssave', via: 'config' }
  },
};
