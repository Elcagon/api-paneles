var express = require('express');
var router = express.Router();
var Client = require('../models/client')
var Panel = require('../models/panel')
var Read = require('../models/read')


//Get clients
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

//created clients
router.post('/', Client.findClient(false, false), function(req, res){
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

//Get client by id
router.get('/:userid', Client.findClient(true, true), function(req, res){
  res.status(200)
  res.send(req.client)
})

//Eliminated client
router.delete('/:userid', Client.findClient(true, true), function(req, res){
  req.client.remove(function(err){
    if(err){
      res.status(500)
      res.send(err)
    }
    else {
      req.client.panels.forEach(function(panel){
        panel.remove(function(err){
          if(err){
            res.status(500)
            res.send(err)
          }
        })
      })
      res.status(200)
      res.json({
        message : "Client deleted",
        client : req.client
      })
    }
  })
})

//Get panels from userid
router.get('/:userid/panels', Client.findClient(true, false), function(req, res){
  req.client.populate({path : 'panels'}, function(err, client_pop){
    if(err){
      res.status(500)
      res.send(err)
    }
    else {
      if(client_pop.panels.length > 0){
        res.status(200)
        res.send(client_pop.panels)
      }
      else {
        res.status(404)
        res.send('Not panels found found')
      }
    }
  })
})

//Create new panels for a specific client (Missing message update)
router.post('/:userid/', Client.findClient(true, true), Panel.findPanel(false, false), function(req, res){
  if(req.body.panelid && req.body.location && req.params.userid){
    var newPanel = new Panel()
    newPanel.panelid = req.body.panelid
    newPanel.location = req.body.location
    newPanel.save(function(err){
      if(err){
        res.status(500)
        res.send(err)
      }
      else{
        // actualizar el cliente con el nuevo panelid
        req.client.update({$push :{'panels': newPanel}},function(error){
          if (error) {
            res.status(500)
            res.send(error)
          }
          else{
            res.status(201)
            res.json({
              status : "Sucess",
              payload : newPanel,
              message : "Panel created"
            })
          }
        })
      }
    })
  }
  else{
    res.status(400)
    res.json({
      error : 'Missing Parameters'
    })
  }
})

//Delete panels for a specific client
router.delete('/:userid/:panelid', Client.findClient(true, true), Panel.findPanel(true, false), function(req, res){
  if(req.params.userid && req.params.panelid){
    req.client.update({$pull : {'panels': req.panel._id}}, function(err){
      if(err){
        res.status(500)
        res.json({error: 'Error updating object'})
      }
      else{
        req.panel.remove(function(err){
          if(err){
            res.status(500)
            res.send(err)
          }
          else{
            res.status(200)
            res.json({
              status : "Sucess",
              payload : req.panel,
              message : "Eliminated panel"
            })
          }
        })
      }
    })
  }
})

//Get Panel by id from user
router.get('/:userid/:panelid', Client.findClient(true, true), Panel.findPanel(true, false), function(req, res){
  res.status(200)
  res.send(req.panel)
})

//Post reads from a specific panel
router.post('/:userid/:panelid/', Client.findClient(true, true), Panel.findPanel(true, false), function(req, res){
  if(req.client && req.panel){
    var newRead = new Read()
    newRead.current = req.body.current
    newRead.temperature = req.body.temperature
    newRead.radiation = req.body.radiation
    newRead.save(function(err){
      if(err){
        res.status(500)
        res.send(err)
      }
      else{
        req.panel.update({$push :{'reads': newRead}},function(err){
          if(err){
            res.status(500)
            res.send(err)
          }
          else{
            res.status(201)
            res.json({
              status : "Sucess",
              // payload : newRead,
              message : "Reads created"
            })
          }
        })
      }
    })
  }
})

//Get reads for a specific panel
router.get('/:userid/:panelid/reads',Client.findClient(true, true), Panel.findPanel(true, true), function(req, res){
  res.status(200)
  res.send(req.panel)
})

module.exports = router
