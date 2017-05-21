var mongoose = require('mongoose');

var clientSchema = mongoose.Schema({
    name : {type : String, required: true},
    userid : {type: String, required: true},
    panels : [{type: mongoose.Schema.Types.ObjectId, ref: 'Panel'}]
  }, {versionKey: false}
)

module.exports = mongoose.model('Client', clientSchema);
