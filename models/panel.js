var mongoose = require('mongoose');

var panelSchema = mongoose.Schema({
    panelid : {type: String, required: true},
    location : {type: String, required: false},
    reads : [{type: mongoose.Schema.Types.ObjectId, ref: 'Read'}]
  }, {versionKey: false}
)

module.exports = mongoose.model('Panel', panelSchema);
