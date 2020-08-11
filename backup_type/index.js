var AbstractType = require('./AbstractType');


var normalizedPath = require("path").join(__dirname, "types");
var types = [];
require("fs").readdirSync(normalizedPath).forEach(function(file) {
  var tmp = require("./types/" + file);
  if(AbstractType.isImplemented(tmp)){
    types.push(tmp);
  }
});

function getTypeByCode(code){
  var typeSearched = null;

  for(let type of types){
    if(type.getCode() === code){
      typeSearched = type;
    }
  }
  return typeSearched;

}


module.exports = {
  types : types,
  getTypeByCode:getTypeByCode
};
