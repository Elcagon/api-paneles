var mongoose = require('mongoose');

var panelSchema = mongoose.Schema({
    panelid : {type: String, required: true},
    location : {type: String, required: false},
    reads : [{type: mongoose.Schema.Types.ObjectId, ref: 'Read'}]
  }, {versionKey: false}
)

panelSchema.statics.findPanel = function(require = true, full = false){
  return function(req, res, next) {
    mongoose.model('Panel').findOne({panelid : req.params.panelid || req.body.panelid}).exec(function(err, panel){
      if(err){
        res.status(500)
        res.send(err)
      }
      else{
        if(panel){
          if(require){
            if(full){
              panel.populate({
                path : 'reads',
                select : 'power temperature radiation current time'
              },function(err, panel_pop){
                if(err){
                  res.status(500)
                  res.send(err)
                }
                else{
                  req.panel = panel_pop
                  next()
                }
              })
            }
            else{
              req.panel = panel
              next()
            }
          }
          else{
            res.status(400)
            res.json({
              message : 'panel already exist in db'
            })
          }
        }
        else{
          if(require){
            res.status(404)
            res.json({
              message : 'panel not found'
            })
          }
          else{
            next();
          }
        }
      }
    })
  }
}

module.exports = mongoose.model('Panel', panelSchema);
