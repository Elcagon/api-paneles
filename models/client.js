var mongoose = require('mongoose');

var clientSchema = mongoose.Schema({
    name : {type : String, required: true},
    userid : {type: String, required: true},
    panels : [{type: mongoose.Schema.Types.ObjectId, ref: 'Panel'}]
  }, {versionKey: false}
)

clientSchema.statics.findClient = function(require = true, full = false){
  return function(req, res, next){
    mongoose.model('Client').findOne({userid : req.params.userid || req.body.userid}).exec(function(err, client){
      if(err){
        res.status(500)
        res.send(err)
      }
      else{
        if(client){
          if(require){
            if(full){
              client.populate({
                path : 'panels',
                select : 'panelid location'
              }, function(err, clien_pop){
                if(err){
                  res.status(500)
                  res.send(err)
                }
                else{
                  req.client = clien_pop
                  next()
                }
              })
            }
            else{
              req.client = client
              next()
            }
          }
          else{
            res.status(400)
            res.json({
              message : 'client already in db'
            })
          }
        }
        else{
          if(require){
            res.status(404)
            res.json({
              message : 'client not found'
            })
          }
          else {
            next();
          }
        }
      }
    })
  }
}

module.exports = mongoose.model('Client', clientSchema);
