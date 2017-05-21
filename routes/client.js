var express = require('express');
var router = express.Router();
var Client = require('../models/client')
var Panel = require('../models/panel')

function clientExist(req, res, next){
  Client.findOne({userid : (req.params.userid || req.body.userid)}, function(err, client){
    if(err){
      res.status(500)
      res.send(err)
    }
    else if (client){
      req.client = client
      next();
    }
    else {
      res.status(404)
      res.send('user not found')
    }
  })
}

function clientNotExist(req, res, next){
  Client.findOne({userid : (req.params.userid || req.body.userid)}, function(err, client){
    if(err){
      res.status(500)
      res.send(err)
    }
    else if (client){
      res.status(400)
      res.send('client already in db')
    }
    else {
      next();
    }
  })
}

function panelExist(req, res, next){
  Panel.findOne({panelid : (req.params.panelid || req.body.panelid)},function(err, panel){
    if(err){
      res.status(500)
      res.send(err)
    }
    else if(panel){
      req.panel = panel
      next();
    }
    else {
      res.status(404)
      res.send('panel not found')
    }
  })
}

function panelNotExist(req, res, next){
  Panel.findOne({panelid : (req.params.panelid || req.body.panelid)},function(err, panel){
    if(err){
      res.status(500)
      res.send(err)
    }
    else if(panel){
      res.status(400)
      res.send('panel already in the db ')
    }
    else {
      next()
    }
  })
}


router.get('/', function(req, res){
  Client.find({}, function(err, clients){
    if(err){
      res.status(500)
      res.send(err)
    }
    else {
      if(clients.length > 0){
        res.status(200)
        res.send(clients)
      }
      else {
        res.status(404)
        res.send('Not clients found')
      }
    }
  })
})

router.post('/', clientNotExist, function(req, res){
  if(req.body.name && req.body.userid){
    var newClient = new Client()
    newClient.name = req.body.name
    newClient.userid = req.body.userid
    newClient.save(function(err){
      if(err){
        res.status(500)
        res.send(err)
      }
      else {
        res.status(201)
        res.send(newClient)
      }
    })
  }
  else {
    res.send(400)
    res.json({
      error : 'Missing parameters'
    })
  }
})

router.delete('/:userid', clientExist, function(req, res){
  if(!req.client){
    res.status(404)
    res.send('client not found')
  }
  else {
    req.client.remove(function(err){
      if(err){
        res.status(500)
        res.send(err)
      }
      else {
        res.status(200)
        res.json({
          message : 'client deleted',
          client : req.client
        })
      }
    })
  }
})

router.get('/:userid/panels', findClient, function(req, res){
  if(!req.client){
    res.status(404)
    res.send('user not found')
  }
  else {
    req.client.populate({
      path : 'panels',
      select : 'panelid location'
    }, function(err, client){
      if(err){
        res.status(500)
        res.send(err)
      }
      else {
        if(client.panels.length > 0){
          res.status(200)
          res.send(client.panels)
        }
        else {
          res.status(404)
          res.send("not panels found")
        }
      }
    })
  }
})

router.post('/:userid/', clientExist, panelNotExist, function(req, res){
  if(!req.client){
    res.status(404)
    res.send('user not found')
  }
  else {
    if(req.body.panelid){
      var newPanel = new Panel()
      newPanel.panelid = req.body.panelid
      newPanel.location = req.body.location
      newPanel.save(function(err) {
        if(err){
          res.status(500)
          res.send(err)
        }
        else {
          req.client.update({$push : {panels : newPanel}}, function(err){
            if(err){
              res.status(500)
              res.send(err)
            }
            else {
              res.status(200)
              res.send({
                messaje : 'panel created',
                panel : newPanel
              })
            }
          })
        }
      })
    }
    else {
      res.status(400)
      res.send('invalid parameters')
    }
  }
})

router.delete('/:userid/:panelid', findClient, findPanel, function(req,res){
  if(!req.panel){
    res.status(404)
    res.send('Panel not found')
  }
  else {
    req.panel.remove(function(err){
      if(err){
        res.status(500)
        res.send(err)
      }
      else{
        res.status(200)
        res.json({
          message : 'Panel deleted',
          panel : req.panel
        })
      }
    })
  }
})

module.exports = router
