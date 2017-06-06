var mongoose = require('mongoose');

var readSchema = mongoose.Schema({
    current : {
      network: {type : String, required: true},
      panel: {type : String, required: true},
      used: {type : String, required: true}
      },
    temperature : {type: String, required: true},
    radiation : {type: String, required: true},
    time : {type: Date, default: Date.now()}
    // time : {type: String, required: true}
    
  }, {versionKey: false}
)

module.exports = mongoose.model('Read', readSchema);
